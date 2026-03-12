FROM node:20-alpine

WORKDIR /app

# Install only production dependencies.
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source and run as non-root user.
COPY --chown=node:node . .
USER node

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "server.js"]
