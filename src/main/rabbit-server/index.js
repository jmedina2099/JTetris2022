#!/usr/bin/env node

import { connection } from "./socket.js";
import { Server } from "socket.io";
import express from "express";
import http from "http";
import cors from 'cors';
import amqp from 'amqplib/callback_api.js';
import fs from 'fs';
import path from 'path';

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

var port = 5671;
//var rabbitHost = 'localhost';
var rabbitHost = 'jtetrisapprabbitmqserver.azurewebsites.net';

var urlObj = {
    protocol: 'amqps',
    hostname: rabbitHost,
    port: port,
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
