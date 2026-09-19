# ---- 构建阶段：编译前端 ----
FROM node:22.14-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

# ---- 运行阶段：零 npm 依赖，仅 Node 内置模块 ----
FROM node:22.14-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=3000 DATA_DIR=/app/data
COPY server/server.mjs ./server/server.mjs
COPY --from=build /app/dist ./dist
VOLUME ["/app/data"]
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD node -e "fetch('http://127.0.0.1:'+process.env.PORT+'/api/session').then(()=>process.exit(0)).catch(()=>process.exit(1))"
CMD ["node", "server/server.mjs"]
