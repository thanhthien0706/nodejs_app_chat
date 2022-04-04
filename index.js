"use strict";

const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const { handle } = require("express/lib/router");
const server = http.createServer(app);

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "./public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/**
 * Router
 */

app.get("/", (req, res) => {
  res.render("home");
});

/**
 * socket io
 */
const io = require("socket.io")(server);

let listUser = [];

io.on("connection", (socket) => {
  console.log("co nguoi ket noi" + socket.id);

  // nghe su kien dang ki
  socket.on("client-send-name", (data) => {
    data = data.toLowerCase();

    if (listUser.length != 0) {
      const check = listUser.some((user) => user.name == data);

      if (check) {
        socket.emit("server-send-res-fail", "User name exits");
      } else {
        handleSuccess({ id: socket.id, name: data }, socket);
      }
    } else {
      handleSuccess({ id: socket.id, name: data }, socket);
    }
  });

  // client send data to server
  socket.on("client-send-mess", (mess) => {
    const user = listUser.filter((user) => user.id === socket.id);

    io.sockets.emit("server-send-all-mess", {
      ...user[0],
      mess,
    });
  });

  // người dung ròi khoi
  socket.on("disconnect", () => {
    const newListUser = listUser.filter((user) => user.id == socket.id);
    listUser.splice(listUser.indexOf(newListUser[0]), 1);
    io.sockets.emit("server-send-all-success", listUser);
  });
});

function handleSuccess(data, socket) {
  listUser.push(data);
  socket.emit("server-send-res-success", data);
  io.sockets.emit("server-send-all-success", listUser);
}

/**
 * Lestiening server
 */
server.listen(port, () => {
  console.log("listening on port " + port);
});
