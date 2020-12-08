const express = require("express");
const path = require("path");

const webChatModel = require("./model/webchatModel");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const moment = require('moment');

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "public"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.use("/", (req, res) => {
  res.render("index.html");
});

io.on("connection", (socket) => {
  console.log("Socket connectado", socket.id);
  webChatModel.getAll().then((messages) => socket.emit("historicMessages", messages));

  socket.on("message", async (data) => {    
    const date = moment(new Date()).format('DD-MM-yyyy hh:mm:ss A');
    const dados = { date , ...data };

    await webChatModel.add(dados);

    socket.broadcast.emit("message", dados);
  });
});

server.listen(3000, () => console.log("Ouvindo na porta 3000"));
