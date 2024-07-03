

Deno.serve({
    port: 8080,
  handler: async (request) => {
    console.log('starting on port 8080')
    // If the request is a websocket upgrade,
    // we need to use the Deno.upgradeWebSocket helper
    console.log(request.url);
    if (request.headers.get("upgrade") === "websocket") {
      console.log('im here');
      const { socket, response } = Deno.upgradeWebSocket(request);

      socket.onopen = () => {
        console.log("CONNECTED");
      };
      socket.onmessage = (event) => {
        console.log(`RECEIVED: ${event.data}`);
        socket.send("pong");
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
