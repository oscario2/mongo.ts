FROM denoland/deno:1.11.2

WORKDIR /mongo.ts

## Add the wait script to the image
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait

USER deno

# cache dependencies
COPY deps.ts .
RUN deno cache --unstable deps.ts

# these steps will be re-run upon each file change in your working directory:
COPY deps.ts .
ADD . .

# compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache --unstable tests/mongo.test.ts

# run
CMD /wait && deno run -A --unstable tests/mongo.test.ts