FROM node:lts-alpine
# ENV NODE_ENV=production

# make available locally, the installed npm packages' binary 
ENV PATH "$PATH:/approot/node_modules/.bin"

WORKDIR /approot

# Copy dependency list and install
COPY ["./project/package.json", "./project/package-lock.json*", "./"]
RUN apk update \
    && apk add git \
    && npm install \
    && npm cache clean --force

# Copy source
COPY . .
# EXPOSE 3000
CMD ["sleep", "infinity"]
