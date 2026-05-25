FROM nginx:1.25-alpine

RUN apk add --no-cache openssl

# Generate self-signed cert for dev (replace with Let's Encrypt in prod)
RUN mkdir -p /etc/nginx/certs && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
      -keyout /etc/nginx/certs/server.key \
      -out /etc/nginx/certs/server.crt \
      -subj "/C=US/ST=Dev/L=Dev/O=TourMate/CN=localhost"

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
