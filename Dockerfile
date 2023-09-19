# # syntax = docker/dockerfile:1

# # Adjust NODE_VERSION as desired
# ARG NODE_VERSION=18.17.1
# FROM node:${NODE_VERSION}-slim as base

# LABEL fly_launch_runtime="NestJS"

# # NestJS app lives here
# WORKDIR /app


# # Set production environment
# ENV NODE_ENV="production"


# # Throw-away build stage to reduce size of final image
# FROM base as build

# # Install packages needed to build node modules
# RUN apt-get update -qq && \
#     apt-get install -y build-essential pkg-config python-is-python3

# # Install node modules
# COPY --link package-lock.json package.json yarn.lock ./
# RUN yarn install --frozen-lockfile --production=false

# # Copy application code
# COPY --link . .

# # Build application
# RUN yarn run build




# # Final stage for app image
# FROM base

# # Copy built application
# COPY --from=build /app /app
# COPY ./.env.prod .
# ENV $(cat .env.prod | xargs)

# RUN yarn add dotenv-cli
# # Start the server by default, this can be overwritten at runtime
# EXPOSE 3000
# CMD [ "yarn", "run", "start:prod" ]



# Adjust NODE_VERSION as desired
ARG NODE_VERSION=18.17.1
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="NestJS"

# NestJS app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install -y build-essential pkg-config python-is-python3

# Install node modules using npm and then install pnpm
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && \
    npm install --frozen-lockfile --production=false


# Copy application code
COPY . .
RUN npm install -g @nestjs/cli
# Build application
RUN pnpm install && pnpm run build 

# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app
# COPY --from=build /app/node_modules ./node_modules
COPY ./.env.prod .
ENV $(cat .env.prod | xargs)


# Install dotenv-cli globally
RUN npm install -g dotenv-cli
# RUN pnpm update -g pnpm
# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "npm", "run", "start:prod" ]



