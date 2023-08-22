import {
  createHandler,
  renderAsync,
  StartServer,
} from "solid-start/entry-server";
import { createDurableObject, DurableObjectContext } from "solid-start/durable-object"

export default createHandler(
  renderAsync((event) => <StartServer event={event} />)
);


// async function wsHandler(request: Request, ctx: DurableObjectContext<{}>) {
async function wsHandler(request, ctx) {
  // To accept the WebSocket request, we create a WebSocketPair (which is like a socketpair,
  // i.e. two WebSockets that talk to each other), we return one end of the pair in the
  // response, and we operate on the other end. Note that this API is not part of the
  // Fetch API standard; unfortunately, the Fetch API / Service Workers specs do not define
  // any way to act as a WebSocket server today.
  let pair = new WebSocketPair();
  const [client, server] = Object.values(pair);


  // TODO: https://developers.cloudflare.com/workers/runtime-apis/websockets/use-websockets/
  // ​​Durable Objects and WebSocket state If your application needs to coordinate among multiple WebSocket connections, such as a chat room or game match, you will need to create a Durable Object so clients send messages to a single-point-of-coordination. Durable Objects are a coordinated state tool for Cloudflare Workers, which are often used in parallel with WebSockets to persist state over multiple clients and connections. Refer to Durable Objects to get started, and prefer using the Durable Objects WebSockets Hibernation API rather than the .accept method described above.

  // We're going to take pair[1] as our end, and return pair[0] to the client.
  // Accept our end of the WebSocket. This tells the runtime that we'll be terminating the
  // WebSocket in JavaScript, not sending it elsewhere.
  // @ts-ignore
  server.accept();

  const websocketEvent = Object.freeze({ durableObject: ctx, request, env: {} });


  function serverHandler(server, event) {
    server.addEventListener("open", (event) => {
      console.log("Server WebSocket opened");
    });
    server.addEventListener("message", (event) => {
      console.log("Received from client: " + event.data);
      server.send("Hello from the server!");
    });
    server.addEventListener("close", (event) => {
      console.log("Server WebSocket closed");
    });
  }

  console.log("WebSocket request received, creating server: ", request.url);
  serverHandler(server, websocketEvent);

  // Now we return the other end of the pair to the client.
  return new Response(null, { status: 101, webSocket: client });
};




// eslint-disable-next-line @typescript-eslint/naming-convention
export const DO_WEBSOCKET = createDurableObject(wsHandler)
export const db = DO_WEBSOCKET
