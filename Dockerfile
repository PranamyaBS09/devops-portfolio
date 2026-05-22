# Use the official nginx image as the base
FROM nginx:alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy our portfolio files into the nginx web folder
COPY index.html /usr/share/nginx/html/
COPY style.css  /usr/share/nginx/html/
COPY script.js  /usr/share/nginx/html/

# Expose port 80 (nginx default port)
EXPOSE 80

# nginx starts automatically when the container runs (default CMD from base image)
