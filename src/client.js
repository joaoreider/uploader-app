const net = require("net");
const fs = require("fs/promises");

const PORT = 3000;
const HOST = "127.0.0.1";

const socket = net.createConnection({ host: HOST, port: PORT }, async () => {
  const filePath = "src/text.txt";
  const fileHandler = await fs.open(filePath, "r");
  const fileStream = fileHandler.createReadStream();

  fileStream.on("data", (chunk) => {
    socket.write(chunk);
  });
});

socket.on("connect", () => {
  console.log("Connected to server.");
});
