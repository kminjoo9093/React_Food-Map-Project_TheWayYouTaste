const jsonServer = require("json-server");
const cors = require("cors");

const server = jsonServer.create();
const router = jsonServer.router("db.json");

server.use(cors());
server.use(jsonServer.defaults());
server.use(router);

const port = process.env.PORT || 4000;

server.listen(port, () => {
  console.log("json server is running");
});
