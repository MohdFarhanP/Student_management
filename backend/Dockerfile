# Build stage
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

EXPOSE 5000
CMD ["npm", "start"]