FROM nginx:alpine

# Copy nginx configuration
# Use nginx.conf (SSL enabled by default)
COPY nginx.conf /etc/nginx/nginx.conf

# Create directory for Let's Encrypt challenges
RUN mkdir -p /var/www/certbot

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
