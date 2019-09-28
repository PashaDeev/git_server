const http = require(`http`);
const debug = require(`debug`)("server: ");
const express = require(`express`);

const { app } = require(`./app`);
// const app = express();
// app.get(`/`, (req, res) => {
//   res.end(`test`)
// })

const server = http.createServer(app);

const PORT = process.env.PORT || 8076;

//app.configure, app.use etc

// app.listen(PORT, () => {
//   debug(`server is running on port: ${PORT}`)
// });
server.listen(PORT, () => {
  debug(`server is running on port: ${PORT}`);
});
