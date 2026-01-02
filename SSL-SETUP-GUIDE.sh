#!/bin/bash

# SSL Setup and Deployment Guide for Talaseen
# This script helps you set up HTTPS/SSL for talaseen.com

echo "╔════════════════════════════════════════════════════════════╗"
echo "║         🔒 SSL Setup Guide for Talaseen.com 🔒           ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

echo "📋 Prerequisites:"
echo "  ✓ Domain talaseen.com pointing to this server IP"
echo "  ✓ Ports 80 and 443 open in firewall"
echo "  ✓ Docker and Docker Compose installed"
echo ""

echo "🚀 Steps to enable SSL:"
echo ""
echo "1️⃣  Stop any running containers:"
echo "   docker compose -f docker-compose.prod.yml down"
echo ""

echo "2️⃣  Initialize Let's Encrypt SSL certificates:"
echo "   ./init-letsencrypt.sh"
echo ""
echo "   This will:"
echo "   • Create temporary certificates"
echo "   • Start nginx"
echo "   • Request real SSL certificates from Let's Encrypt"
echo "   • Reload nginx with the new certificates"
echo ""

echo "3️⃣  Start all services with SSL enabled:"
echo "   docker compose -f docker-compose.prod.yml up -d"
echo ""

echo "4️⃣  Check nginx logs:"
echo "   docker logs talaseen-nginx"
echo ""

echo "5️⃣  Verify SSL is working:"
echo "   Visit: https://talaseen.com"
echo ""

echo "📝 Configuration Summary:"
echo "  • HTTP (port 80) → Redirects to HTTPS"
echo "  • HTTPS (port 443) → Serves your application"
echo "  • SSL auto-renewal every 12 hours"
echo "  • CORS headers enabled for fonts"
echo "  • Rate limiting enabled"
echo "  • Security headers added"
echo ""

echo "🔧 Troubleshooting:"
echo "  • Make sure domain DNS is properly configured"
echo "  • Check nginx logs: docker logs talaseen-nginx"
echo "  • Check certbot logs: docker logs talaseen-certbot"
echo "  • Verify ports: sudo ufw status (or firewall-cmd --list-all)"
echo ""

echo "💡 Manual Certificate Renewal (if needed):"
echo "   docker compose -f docker-compose.prod.yml run --rm certbot renew"
echo "   docker compose -f docker-compose.prod.yml exec nginx nginx -s reload"
echo ""

echo "Ready to proceed? Follow the steps above! 🎉"
