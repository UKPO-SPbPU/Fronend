# pull official base image
FROM node:20.18.0-alpine3.20 as builder

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
# RUN npm install react-scripts@3.4.1 -g --silent

# add app
COPY . ./

# build
RUN npm run build


FROM nginx:1.16.0-alpine

WORKDIR /usr/share/nginx/html

COPY --from=builder /app/dist .
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]