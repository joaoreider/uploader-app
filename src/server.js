const net = require("net");
const fs = require("fs/promises");

const PORT = 3000;
const server = net.createServer((socket) => {});

let fileHandler;
let fileStream;
// with socket you communicate with the client
server.on("connection", (socket) => {
  console.log("A new connection has been established.");

  socket.on("data", async (chunk) => {
    if (!fileHandler) {
      socket.pause(); // pause the socket until the file is created
      const fileName = chunk.toString().split(": ")[1].replace(" ---", "");
      console.log("File name received: " + fileName);
      fileHandler = await fs.open(`storage/up-${fileName}`, "w");
      fileStream = fileHandler.createWriteStream(); // stream to write to the file
      // Writing to the file
      fileStream.write(chunk.subarray(chunk.indexOf("---") + 3));

      socket.resume(); // resume the socket when the file is created

      fileStream.on("drain", () => {
        socket.resume(); // resume the socket when the buffer is empty
      });
    } else {
      if (!fileStream.write(chunk)) {
        socket.pause(); // take care of backpressure (when returning false)
      }
    }
  });

  socket.on("end", () => {
    fileHandler.close();
    fileHandler = null;
    fileStream = null;
    socket.end();
    console.log("Closing connection with the client.");
  });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log("Uploader Server is running on port " + PORT + ".");
});
