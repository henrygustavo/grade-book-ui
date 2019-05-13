#==================== Building Stage ================================================ 

# Create the image based on the official Node 8.9.0 image from Dockerhub
FROM node:8.9.0 as node

# Create a directory where our app will be placed. This might not be necessary
RUN mkdir -p /grade-book-ui

# Change directory so that our commands run inside this new directory
WORKDIR /grade-book-ui

# Copy dependency definitions
COPY package.json /grade-book-ui

# Install dependencies using npm
RUN npm install

# Get all the code needed to run the app
COPY . /grade-book-ui

# Expose the port the app runs in
EXPOSE 4200

#Build the app
RUN npm run build

#==================== Setting up stage ==================== 
# Create image based on the official nginx - Alpine image
FROM nginx:1.13.7-alpine

COPY --from=node /grade-book-ui/dist/ /usr/share/nginx/html

COPY ./nginx-grade-book-ui.conf /etc/nginx/conf.d/default.conf