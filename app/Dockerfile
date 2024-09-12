# (1)
FROM node:22.7.0-bookworm-slim
WORKDIR /src
# (2)
# RUN [ "npm", "install", "-g", "npm@10.8.2" ]
# 以下はsupabaseでhttps通信するために設定
RUN [ "apt-get", "update"]
# RUN [ "apt-get", "install", "-y", "ca-certificates" ]
