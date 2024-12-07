import requests
import os

ABUSEIPDB_API_KEY = os.getenv("ABUSEIPDB_API_KEY")
ABUSEIPDB_URL = "https://api.abuseipdb.com/api/v2/check"

def query_abuseipdb(ip: str):
    params = {"ipAddress": ip, "maxAgeInDays": 90}
    headers = {"Accept": "application/json", "Key": ABUSEIPDB_API_KEY}

    response = requests.get(ABUSEIPDB_URL, headers=headers, params=params)
    return response.json() if response.status_code == 200 else {"error": response.text}

PROXYCHECK_API_KEY = os.getenv("PROXYCHECK_API_KEY")
PROXYCHECK_URL = "http://proxycheck.io/v2"

def query_proxycheck(ip: str):
    params = {"key": PROXYCHECK_API_KEY, "vpn": 3, "asn": 1, "risk": 2, "port": 1, "seen": 1, "days": 30}
    response = requests.get(f"{PROXYCHECK_URL}/{ip}", params=params)
    return response.json() if response.status_code == 200 else {"error": response.text}

IPQS_API_KEY = os.getenv("IPQS_API_KEY")
IPQS_URL = f"https://ipqualityscore.com/api/json/ip/{IPQS_API_KEY}"

def query_ipqs(ip: str):
    params = {"strictness": 1}
    response = requests.get(f"{IPQS_URL}/{ip}", params=params)
    return response.json() if response.status_code == 200 else {"error": response.text}
