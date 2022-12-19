import express from 'express';
import http from 'http';
import assert from 'assert';

const opts = {
  port: 5001,
  host: "localhost",
}

const app = express();

const http_server = http.createServer(app);

app.use(express.json());
app.use(express.static('public'));

app.get("/messages.json", (req, res) => {
  res.status(200).json({message: "HELLO!"});
});

http_server.listen(opts.port, opts.host, () => {
  console.log(`listening on ${opts.host}:${opts.port}`);
});
