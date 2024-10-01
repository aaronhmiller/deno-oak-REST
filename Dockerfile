FROM denoland/deno:alpine-1.32.3

WORKDIR /app

COPY deps.ts .
RUN deno cache deps.ts

COPY . .
RUN deno cache app.ts

EXPOSE 8000

CMD ["run", "--allow-net", "--allow-env", "app.ts"]
