const net = require("net");
const fs = require("fs/promises");

const PORT = 3000;
const HOST = "127.0.0.1";

const socket = net.createConnection({ host: HOST, port: PORT }, async () => {
  const filePath = "file_example_MP4_1920_18MG.mp4";
  const fileHandler = await fs.open(filePath, "r");
  const fileStream = fileHandler.createReadStream();

  fileStream.on("data", (chunk) => {
    if (!socket.write(chunk)) {
      fileStream.pause();
    }
  });

  socket.on("drain", () => {
    fileStream.resume();
  });

  fileStream.on("end", () => {
    socket.end();
    console.log("File uploaded.");
  });
});

socket.on("connect", () => {
  console.log("Connected to server.");
});
