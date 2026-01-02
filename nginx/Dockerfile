FROM nginx:alpine

# Copy nginx configuration
# Use nginx-no-ssl.conf by default (rename to nginx.conf)
COPY nginx-no-ssl.conf /etc/nginx/nginx.conf

# Keep SSL config for later use
COPY nginx.conf /etc/nginx/nginx-ssl.conf

# Create directory for Let's Encrypt challenges
RUN mkdir -p /var/www/certbot

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
