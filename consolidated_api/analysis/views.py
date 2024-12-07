from django.shortcuts import render
from django.http import JsonResponse
from .services import query_abuseipdb, query_proxycheck, query_ipqs
from .schema import unify_results

def analyze_ip(request, ip):
    abuseipdb = query_abuseipdb(ip)
    proxycheck = query_proxycheck(ip)
    ipqs = query_ipqs(ip)

    if "error" in abuseipdb or "error" in proxycheck or "error" in ipqs:
        return JsonResponse({"error": "Error querying one or more APIs"}, status=500)

    result = unify_results(abuseipdb, proxycheck, ipqs)
    return JsonResponse(result)
