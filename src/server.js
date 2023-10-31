const net = require("net");
const fs = require("fs/promises");

const PORT = 3000;
const server = net.createServer((socket) => {});

// with socket you communicate with the client
server.on("connection", (socket) => {
  console.log("A new connection has been established.");

  socket.on("data", async (chunk) => {
    console.log(`Data received from client: ${chunk.toString()}`);
    const fileHandler = await fs.open(`storage/test.txt`, "w");
    const fileStream = fileHandler.createWriteStream();
    fileStream.write(chunk);
  });

  socket.on("end", () => {
    fileHandler.close();
    console.log("Closing connection with the client.");
  });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log("Uploader Server is running on port " + PORT + ".");
});
