const net = require("net");
const fs = require("fs/promises");
const path = require("path");

const PORT = 3000;
const HOST = "127.0.0.1";

const clearLine = (dir) => {
  return new Promise((resolve, reject) => {
    process.stdout.clearLine(dir, () => {
      resolve();
    });
  });
};
const moveCursor = (dx, dy) => {
  return new Promise((resolve, reject) => {
    process.stdout.moveCursor(dx, dy, () => {
      resolve();
    });
  });
};

// upload progress
let uploadedPercentage = 0;
let bytesUploaded = 0;

const socket = net.createConnection({ host: HOST, port: PORT }, async () => {
  const filePath = process.argv[2];
  const fileName = path.basename(filePath);
  const fileHandler = await fs.open(filePath, "r");
  const fileStream = fileHandler.createReadStream();
  const fileSize = (await fileHandler.stat()).size;

  socket.write(`filename: ${fileName} ---`);

  fileStream.on("data", async (chunk) => {
    if (!socket.write(chunk)) {
      fileStream.pause();
    }
    bytesUploaded += chunk.length; // update the number of bytes uploaded
    newPercentage = Math.round((bytesUploaded / fileSize) * 100); // update the percentage
    if (newPercentage !== uploadedPercentage) {
      uploadedPercentage = newPercentage;
      await moveCursor(0, -1);
      await clearLine(0);
      console.log(`Uploading... ${uploadedPercentage}%`);
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
