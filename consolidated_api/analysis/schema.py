def unify_results(abuseipdb, proxycheck, ipqs):
    return {
        "ip": abuseipdb.get("data", {}).get("ipAddress", "N/A"),
        "risk_score": {
            "abuseipdb": abuseipdb.get("data", {}).get("abuseConfidenceScore", "N/A"),
            "proxycheck": proxycheck.get("risk", "N/A"),
            "ipqs": ipqs.get("fraud_score", "N/A"),
        },
        "proxy_detection": {
            "abuseipdb": abuseipdb.get("data", {}).get("isPublic", "N/A"),
            "proxycheck": proxycheck.get("proxy", "N/A"),
            "ipqs": ipqs.get("proxy", "N/A"),
        },
        "geolocation": {
            "country": abuseipdb.get("data", {}).get("countryName", "N/A"),
            "region": ipqs.get("region", "N/A"),
            "city": ipqs.get("city", "N/A"),
        },
        "details": {
            "abuseipdb": abuseipdb,
            "proxycheck": proxycheck,
            "ipqs": ipqs,
        },
    }
