import { DB } from "https://deno.land/x/sqlite@v3.8/mod.ts";

const db = new DB("wstest.db");

Deno.serve({
    port: 8080,
  handler: async (request) => {
    console.log('starting on port 8080')
    // If the request is a websocket upgrade,
    // we need to use the Deno.upgradeWebSocket helper
    if (request.headers.get("upgrade") === "websocket") {

      const { socket, response } = Deno.upgradeWebSocket(request);

      socket.onopen = () => {
        console.log("CONNECTED: WS API v1");
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if(data.id){
          const result = db.query(`SELECT * FROM user where ID = ${data.id}`)
          console.log(result);
          socket.send(JSON.stringify(result));
        }
        else{
          socket.send("pong");
        }
      };
      socket.onclose = () => console.log("DISCONNECTED");
      socket.onerror = (error) => console.error("ERROR:", error);

      return response;
    } else {
      // If the request is a normal HTTP request,
      // we serve the client HTML file.
      const file = await Deno.open("./index.html", { read: true });
      return new Response(file.readable);
    }
  },
});
