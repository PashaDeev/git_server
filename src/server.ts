import app from './app/app';
import http from 'http';
import debugInit from 'debug';

const debug = debugInit('server: ');

const server = http.createServer(app);

const PORT = process.env.PORT || 8076;

server.listen(PORT, () => {
  debug(`server is running at port: ${PORT}`);
});
