# Stage 1: Build
FROM node:20 AS build
WORKDIR /frontend-resume-agent

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the Vite app (outputs to /app/dist)
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copy built files from stage 1
COPY --from=build /frontend-resume-agent/dist .

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
