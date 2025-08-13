FROM node:20.19-bookworm-slim

# Make sure image is up to date
RUN apt-get update && \
  apt-get upgrade -y && \
  rm -rf /var/lib/apt/lists/* && \
  npm install --ignore-scripts -g npm@10.9.1

ENV SKIP_ENV_VALIDATION=true

WORKDIR /app

COPY src /app/src
COPY public /app/public
COPY package.json package-lock.json tailwind.config.ts next.config.ts postcss.config.mjs tsconfig.json /app/

RUN npm ci --ignore-scripts
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
