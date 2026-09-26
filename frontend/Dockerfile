# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
# VITE_API_URL is baked at build; for runtime proxy we use nginx proxy
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Serve stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# SPA fallback + /api proxy to backend service
RUN printf 'server {\n\
  listen 80;\n\
  root /usr/share/nginx/html;\n\
  index index.html;\n\
  location /api/ { proxy_pass http://backend:8000; proxy_set_header Host $$host; proxy_set_header X-Real-IP $$remote_addr; }\n\
  location / { try_files $$uri $$uri/ /index.html; }\n\
  gzip on;\n\
  gzip_types text/plain text/css application/json application/javascript text/xml;\n\
}\n' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
