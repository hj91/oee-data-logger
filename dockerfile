# Use a Node.js runtime as the base image
FROM node:16.13.2-alpine3.14

# Set the working directory inside the container
WORKDIR ./

# Copy the package.json file to the working directory
COPY package.json ./
COPY index.js ./
COPY config.json ./

# Install the dependencies
RUN npm install -g --production

# Copy the oee-cli.js file to the working directory
COPY . .


# Set the command to run when the container starts
ENTRYPOINT ["node", "index.js"]

