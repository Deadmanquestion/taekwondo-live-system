const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// 提供前端页面（public文件夹）
app.use(express.static("public"));

// 初始数据
let matchData = [
  { ring: "Ring 1", now: "Kata U18", next: "Kumite U18" },
  { ring: "Ring 2", now: "Kumite U21", next: "Kata U21" },
  { ring: "Ring 3", now: "Kata Open", next: "Kumite Open" },
  { ring: "Ring 4", now: "Team Kata", next: "Team Kumite" }
];

// 有人连接（display / admin）
io.on("connection", (socket) => {
  console.log("User connected");

  // 🔥 一连接就发送当前数据
  socket.emit("update", matchData);

  // 🔥 admin 更新数据
  socket.on("adminUpdate", (data) => {
    console.log("Admin updated:", data);

    matchData = data;

    // 🔥 广播给所有人（display 自动更新）
    io.emit("update", matchData);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// ❗关键（部署必须这样写）
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});