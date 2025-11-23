# Stage 1: Base image with Node.js and npm
FROM node:20-slim AS base
WORKDIR /usr/src/app
RUN npm install -g npm@10

# Stage 2: Build stage with development dependencies
FROM base AS build
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 3: Production stage with only necessary artifacts
FROM base AS production
ENV NODE_ENV=production
COPY --from=build /usr/src/app/package*.json ./
RUN npm ci --omit=dev
COPY --from=build /usr/src/app/dist ./dist
EXPOSE 3000
CMD ["npm", "start"]
