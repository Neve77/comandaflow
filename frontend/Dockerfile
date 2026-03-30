FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código-fonte
COPY . .

# Build Next.js
RUN npm run build

# Runtime stage
FROM node:18-alpine

WORKDIR /app

# Copiar dependências necessárias
COPY package*.json ./
RUN npm ci --only=production

# Copiar build do estágio anterior
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/pages ./pages

# Expor porta
EXPOSE 3000

# Variáveis de ambiente
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Comando padrão
CMD ["npm", "run", "dev"]
