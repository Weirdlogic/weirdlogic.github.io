# backend/schema.py

def unify_results(abuseipdb, proxycheck, ipqs):
    """Unify results from multiple IP intelligence sources."""
    # Get IP from responses
    ip = (abuseipdb.get("data", {}).get("ipAddress") 
          or proxycheck.get("status", {}).get("ip") 
          or ipqs.get("host") 
          or "N/A")
    
    proxy_data = proxycheck.get(ip, {})
    abuse_data = abuseipdb.get("data", {})

    # Enhanced risk scores
    risk_score = {
        "abuseipdb": abuse_data.get("abuseConfidenceScore", 0),
        "proxycheck": proxy_data.get("risk", 0),
        "ipqs": ipqs.get("fraud_score", 0),
        "combined": max([
            abuse_data.get("abuseConfidenceScore", 0),
            proxy_data.get("risk", 0),
            ipqs.get("fraud_score", 0)
        ])
    }

    # Use IPQS as source of truth for proxy/VPN detection
    proxy_detection = {
        "abuseipdb": abuse_data.get("isPublic", False),
        "proxycheck": normalize_boolean(proxy_data.get("proxy", "no")),
        "ipqs": ipqs.get("proxy", False),
        "final_decision": ipqs.get("proxy", False),  # Using IPQS as source of truth
        "vpn_detected": ipqs.get("vpn", False),      # Using IPQS as source of truth
        "tor_detected": ipqs.get("tor", False)       # Using IPQS as source of truth
    }

    # Enhanced geolocation with all available data
    geolocation = {
        "country": {
            "name": (abuse_data.get("countryName") 
                    or proxy_data.get("country") 
                    or ipqs.get("country_code", "N/A")),
            "code": (abuse_data.get("countryCode") 
                    or proxy_data.get("isocode") 
                    or ipqs.get("country_code", "N/A"))
        },
        "region": {
            "name": proxy_data.get("region", "N/A"),
            "code": proxy_data.get("regioncode", "N/A")
        },
        "city": {
            "proxycheck": proxy_data.get("city", "N/A"),
            "ipqs": ipqs.get("city", "N/A")
        },
        "coordinates": {
            "proxycheck": {
                "latitude": proxy_data.get("latitude"),
                "longitude": proxy_data.get("longitude")
            },
            "ipqs": {
                "latitude": ipqs.get("latitude"),
                "longitude": ipqs.get("longitude")
            }
        },
        "timezone": proxy_data.get("timezone") or ipqs.get("timezone", "N/A")
    }

    # Enhanced ISP and network info
    network_info = {
        "isp": {
            "primary": abuse_data.get("isp") or proxy_data.get("provider", "N/A"),
            "vpn_provider": ipqs.get("ISP", "N/A"),
            "organization": proxy_data.get("organisation") or ipqs.get("organization", "N/A")
        },
        "asn": {
            "number": proxy_data.get("asn") or str(ipqs.get("ASN", "N/A")),
            "range": proxy_data.get("range", "N/A")
        },
        "usage_type": abuse_data.get("usageType", "N/A"),
        "domain": abuse_data.get("domain", "N/A")
    }

    # Additional security indicators
    security_info = {
        "is_crawler": ipqs.get("is_crawler", False),
        "is_mobile": ipqs.get("mobile", False),
        "recent_abuse": ipqs.get("recent_abuse", False),
        "bot_status": ipqs.get("bot_status", False),
        "abuse_history": {
            "total_reports": abuse_data.get("totalReports", 0),
            "distinct_users": abuse_data.get("numDistinctUsers", 0),
            "last_reported": abuse_data.get("lastReportedAt", "N/A")
        }
    }

    result = {
        "ip": ip,
        "risk_score": risk_score,
        "proxy_detection": proxy_detection,
        "geolocation": geolocation,
        "network_info": network_info,
        "security_info": security_info,
        "detailed_results": {
            "abuseipdb": abuseipdb,
            "proxycheck": proxycheck,
            "ipqs": ipqs
        }
    }

    # Add the summary to the result
    result["summary"] = generate_ip_summary(result)
    
    return result

def normalize_boolean(value):
    """Convert various truth values to boolean."""
    if isinstance(value, bool):
        return value
    return str(value).lower() in ["yes", "true"]

def generate_ip_summary(unified_data):
    """Generate a human-readable summary and risk assessment of an IP address."""
    # Known legitimate services
    KNOWN_SERVICES = {
        "Google": ["Google", "GCloud", "AS15169"],
        "Microsoft": ["Microsoft", "Azure", "AS8075"],
        "Amazon": ["Amazon", "AWS", "AS16509"],
        "Cloudflare": ["Cloudflare", "AS13335"]
    }

    risk_level = "LOW"
    concerns = []
    
    # Assess risk scores
    highest_risk = unified_data["risk_score"]["combined"]
    if highest_risk >= 80:
        risk_level = "HIGH"
    elif highest_risk >= 50:
        risk_level = "MEDIUM"
    
    # Check if known service
    network_info = unified_data["network_info"]
    is_known_service = False
    service_name = None
    
    for service, patterns in KNOWN_SERVICES.items():
        if any(pattern in network_info["isp"]["primary"] or 
               pattern in network_info["asn"]["number"] 
               for pattern in patterns):
            is_known_service = True
            service_name = service
            break

    # Get IPQS data for VPN/proxy detection
    ipqs_data = unified_data["detailed_results"]["ipqs"]

    # Add connection type information
    if ipqs_data.get("vpn", False):
        concerns.append("VPN Connection Detected")
        if unified_data["network_info"]["isp"]["vpn_provider"] != "N/A":
            concerns.append(f"VPN Provider: {unified_data['network_info']['isp']['vpn_provider']}")
    
    if ipqs_data.get("proxy", False):
        concerns.append("Proxy Connection Detected")
    
    if ipqs_data.get("tor", False):
        concerns.append("Tor Exit Node Detected")

    # Add infrastructure information if it's a known service
    if is_known_service:
        concerns.append(f"Known {service_name} Infrastructure")
    else:
        # Only check these for unknown services
        security_info = unified_data["security_info"]
        if security_info.get("recent_abuse"):
            concerns.append("Recent abuse detected")
        
        # Add bot/crawler info only if not a known service
        if security_info.get("bot_status"):
            concerns.append("Bot activity detected")
        if security_info.get("is_crawler"):
            concerns.append("Crawler activity detected")
        
        # Add abuse history only if significant
        abuse_history = security_info.get("abuse_history", {})
        if abuse_history.get("total_reports", 0) > 10:
            concerns.append(f"Previously reported {abuse_history['total_reports']} times")

    # Generate summary
    summary = {
        "overall_risk": risk_level,
        "risk_score": highest_risk,
        "location": f"{unified_data['geolocation']['city']['proxycheck']}, {unified_data['geolocation']['country']['name']}",
        "concerns": concerns,
        "recommendation": ("ALLOW" if is_known_service else
                         "BLOCK" if risk_level == "HIGH" or len(concerns) >= 2 else
                         "CAUTION" if risk_level == "MEDIUM" or concerns else
                         "ALLOW")
    }
    
    # Generate human-readable text
    text_summary = f"""IP Analysis Summary for {unified_data['ip']}:
Risk Level: {summary['overall_risk']} ({summary['risk_score']}/100)
Location: {summary['location']}
"""

    if concerns:
        text_summary += "\nContext and Findings:\n- " + "\n- ".join(concerns)
    else:
        text_summary += "\nNo significant concerns identified."
        
    text_summary += f"\n\nRecommendation: {summary['recommendation']}"
    
    return {
        "structured_summary": summary,
        "text_summary": text_summary
    }