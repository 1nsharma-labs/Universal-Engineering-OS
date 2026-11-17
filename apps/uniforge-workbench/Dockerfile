# ==============================================================================
# UNIFORGE AI Workbench — Production Multi-Stage Build (Node 22 -> Nginx Alpine)
# ==============================================================================
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --no-audit --no-fund
COPY . .
RUN npm run build

FROM nginx:1.27-alpine AS production
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 5173
HEALTHCHECK --interval=15s --timeout=3s --retries=3 CMD wget -qO- http://127.0.0.1:5173/ || exit 1
CMD ["nginx", "-g", "daemon off;"]

