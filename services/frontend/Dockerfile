FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build arguments for environment variables at build time
ARG NEXT_PUBLIC_API_URL=/api
ARG NEXT_PUBLIC_BACKEND_URL=https://talaseen.com

# Set environment variables for Next.js build
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}

# Build the Next.js app for production
RUN npm run build

EXPOSE 3000

# Start in production mode, ensure Next.js listens on all interfaces
CMD ["npx", "next", "start", "-H", "0.0.0.0"]
