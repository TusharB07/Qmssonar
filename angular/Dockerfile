# Stage 1: Compile and Build angular codebase
# Use official node image as the base image
FROM node:18 as build

# Set the working directory
WORKDIR /usr/local/app

# Add the source code to app
COPY ./ /usr/local/app/

# Install all the dependencies
ARG SERVER_NAME
RUN npm install --force
RUN npm install -g @angular/cli

# Generate the build of the application
RUN ng build --prod --base-href $SERVER_NAME --deployUrl=/

# Stage 2: Serve app with nginx server
# Use official nginx image as the base image
FROM nginx:stable-alpine

# Copy the build output to replace the default nginx contents.
COPY --from=build /usr/local/app/dist/inexchg-ng /usr/share/nginx/html

# We have moved this to the docker compose file.
# COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80