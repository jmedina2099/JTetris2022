#!/usr/bin/env node

import { connection } from "./socket.js";
import { Server } from "socket.io";
import express from "express";
import http from "http";
import cors from 'cors';
import amqp from 'amqplib/callback_api.js';
import fs from 'fs';
import path from 'path';
import request from 'request';

//var host = 'localhost';
var host = 'jtetrisapprabbitmqserver.azurewebsites.net';
var hostBack = 'localhost';

var portProxy = 4000;
var rabbitPort = 443;

console.log( 'Starting listener on port='+portProxy );

var app = express();
app.use(cors());
var server = http.createServer(app);
var io = new Server(server,{
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
server.listen(portProxy);
var socketConection = [];
connection(io,socketConection);

app.get('/', (req, res) => {
    req.pipe(request('http://'+hostBack+':8080')).pipe(res);
}).get('/start', (req, res) => {
    req.pipe(request('http://'+hostBack+':8080/start')).pipe(res);
}).get('/pause', (req, res) => {
    req.pipe(request('http://'+hostBack+':8080/pause')).pipe(res);
}).get('/right', (req, res) => {
    req.pipe(request('http://'+hostBack+':8080/right')).pipe(res);
}).get('/left', (req, res) => {
    req.pipe(request('http://'+hostBack+':8080/left')).pipe(res);
}).get('/up', (req, res) => {
    req.pipe(request('http://'+hostBack+':8080/up')).pipe(res);
}).get('/down', (req, res) => {
    req.pipe(request('http://'+hostBack+':8080/down')).pipe(res);
}).get('/space', (req, res) => {
    req.pipe(request('http://'+hostBack+':8080/space')).pipe(res);
}).get('/board', (req, res) => {
    req.pipe(request('http://'+hostBack+':8080/board')).pipe(res);
});

var urlObj = {
    protocol: 'amqps',
    hostname: host,
    port: rabbitPort,
    username: 'jmedina',
    password: 'jmedina',
    locale: 'en_US',
    frameMax: 0,
    heartbeat: 0,
    vhost: '/',
}

var opts = {
    cert: fs.readFileSync(path.resolve( './', './client.crt')),
    key:  fs.readFileSync(path.resolve( './', './client.key')),
    ca: [fs.readFileSync(path.resolve( './', './autoridad1.crt')),
         fs.readFileSync(path.resolve( './', './autoridad2.crt')),
         fs.readFileSync(path.resolve( './', './azureca1.pem')),
         fs.readFileSync(path.resolve( './', './azureca2.pem'))]
};

console.log( 'Connecting to rabbitmq...' );
amqp.connect(urlObj, opts, function(error0, connection) {
    console.log( 'Answering..' );
    if (error0) {
        throw error0;
    }
    console.log( 'No errors..' );
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        var queue = 'score-queue';
        channel.assertQueue(queue, {
            durable: false
        });
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
        channel.consume(queue, function(msg) {
            if( socketConection[0] ) {
                socketConection[0].sendScore(msg.content.toString());
            }
        }, {
            noAck: true
        });
    });
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        var queue = 'board-queue';
        channel.assertQueue(queue, {
            durable: false
        });
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
        channel.consume(queue, function(msg) {
            if( socketConection[0] ) {
                socketConection[0].sendBoard(msg.content.toString());
            }
        }, {
            noAck: true
        });
    });
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        var queue = 'hash-board-queue';
        channel.assertQueue(queue, {
            durable: false
        });
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
        channel.consume(queue, function(msg) {
            if( socketConection[0] ) {
                socketConection[0].sendHash(msg.content.toString());
            }
        }, {
            noAck: true
        });
    });
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        var queue = 'figures-queue';
        channel.assertQueue(queue, {
            durable: false
        });
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
        channel.consume(queue, function(msg) {
            if( socketConection[0] ) {
                socketConection[0].sendFigures(msg.content.toString());
            }
        }, {
            noAck: true
        });
    });
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        var queue = 'figure-falling-queue';
        channel.assertQueue(queue, {
            durable: false
        });
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
        channel.consume(queue, function(msg) {
            if( socketConection[0] ) {
                socketConection[0].sendFigureFalling(msg.content.toString());
            }
        }, {
            noAck: true
        });
    });
});
