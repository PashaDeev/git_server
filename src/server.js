const http = require(`http`);
const debug = require(`debug`)("server: ");

const { app } = require(`./app`);

const server = http.createServer(app);

const PORT = process.env.PORT || 8076;

server.listen(PORT, () => {
  debug(`server is running at port: ${PORT}`);
});
