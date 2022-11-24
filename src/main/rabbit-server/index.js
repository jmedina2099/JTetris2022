#!/usr/bin/env node

import { connection } from "./socket.js";
import { Server } from "socket.io";
import express from "express";
import http from "http";
import cors from 'cors';

var port = 4000;

/*
const app = express();
app.get('/.well-known/pki-validation/E09C9F9EDF3AEAB5DD155570E4244C55.txt', (req, res) => {
    const filename = path.resolve( './', './E09C9F9EDF3AEAB5DD155570E4244C55.txt')
    res.download(filename);
});
app.listen(port, () => console.log(`Started server at http://localhost:4000!`));
*/

console.log( 'Starting listener on port='+port );

var app = express();
app.use(cors());
var server = http.createServer(app);
var io = new Server(server,{
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
server.listen(port);
var socketConection = [];
connection(io,socketConection);

console.log( 'DONE setting listener' );