import * as http from 'http';
import url from 'url';
import express from 'express';
import WebSocket, { AddressInfo } from 'ws';

const app = express();

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

declare class MyWebSocket extends WebSocket {
  name: string;
}

wss.on('connection', (ws: MyWebSocket, req: Request) => {
  const parameters = url.parse(req.url, true);
  ws.name = (parameters.query.name as string) || 'Anonymous';

  console.log(`${ws.name} has joined the chat!`);

  wss.clients.forEach((client) => {
    if (client !== ws) {
      client.send(`${ws.name} has joined the chat!`);
    }
  });

  ws.on('message', (message: string) => {
    console.log(`Received message: ${message} from ${ws.name}`);
    wss.clients.forEach((client) => {
      client.send(`${ws.name}: ${message}`);
    });
  });

  ws.on('close', () => {
    console.log(`${ws.name} has left the chat!`);
    wss.clients.forEach((client) => {
      client.send(`${ws.name} has left the chat!`);
    });
  });
});

server.listen(8089, () => {
  console.log(`Listening on port ${(server.address() as AddressInfo).port}`);
});
