# views.py
from django.shortcuts import render
from django.http import JsonResponse
from .services import query_abuseipdb, query_proxycheck, query_ipqs
from .schema import unify_results
from django.core.validators import validate_ipv46_address
from django.core.exceptions import ValidationError
from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)

def analyze_ip(request, ip: str) -> JsonResponse:
    """
    Analyze an IP address using multiple threat intelligence services.
    
    Args:
        request: HTTP request object
        ip: IP address to analyze
        
    Returns:
        JsonResponse containing the analysis results or error message
    """
    try:
        # Validate IP address format
        validate_ipv46_address(ip)
        
        # Query external APIs
        api_results = {
            'abuseipdb': query_abuseipdb(ip),
            'proxycheck': query_proxycheck(ip),
            'ipqs': query_ipqs(ip)
        }
        
        # Check for API errors
        errors = {
            service: result.get('error')
            for service, result in api_results.items()
            if 'error' in result
        }
        
        if errors:
            logger.error(f"API errors encountered: {errors}")
            return JsonResponse({
                'error': 'Error querying APIs',
                'details': errors
            }, status=500)
            
        result = unify_results(**api_results)
        return JsonResponse(result)
        
    except ValidationError:
        return JsonResponse({
            'error': 'Invalid IP address format'
        }, status=400)
    except Exception as e:
        logger.exception("Unexpected error analyzing IP")
        return JsonResponse({
            'error': 'Internal server error'
        }, status=500)
