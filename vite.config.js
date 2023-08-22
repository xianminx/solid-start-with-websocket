import solid from "solid-start/vite";
import { defineConfig } from "vite";
import startCloudflareWorkers from "solid-start-cloudflare-workers";

export default defineConfig({
  plugins: [
    solid({
      ssr: false,
      experimental: {
        websocket: true
      },
      adapter: startCloudflareWorkers({
        durableObjectsPersist: true,
        kvPersist: false,
        // durableObjects: {
        //   db: "db",
        //   DO_WEBSOCKET: "DO_WEBSOCKET"
        // },
        async init(mf) {}
      })
    }),
   
  ],
});
