FROM node:18-alpine

WORKDIR /app

# Instalar dependências do sistema
RUN apk add --no-cache python3 make g++

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências de produção
RUN npm ci --only=production

# Copiar código-fonte
COPY . .

# Expor porta
EXPOSE 4000

# Comando padrão
CMD ["npm", "run", "dev"]
