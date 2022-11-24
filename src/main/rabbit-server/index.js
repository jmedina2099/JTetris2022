#!/usr/bin/env node

import { connection } from "./socket.js";
import { Server } from "socket.io";
import express from "express";
import http from "http";
import amqp from 'amqplib/callback_api.js';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

var port = 4000;

const app = express();
app.get('/.well-known/pki-validation/386ABA2CD06A6CBD2B1669C0BEB859F5.txt', (req, res) => {
    const filename = path.resolve( './', './386ABA2CD06A6CBD2B1669C0BEB859F5.txt')
    res.download(filename);
});
app.listen(port, () => console.log(`Started server at http://localhost:4000!`));

/*
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
*/

//var rabbitHost = 'localhost:5672';
//var rabbitHost = 'jtetrisapprabbitmqserver.azurewebsites.net:80';
var rabbitHost = 'jtetrisapprabbitmqserver.azurewebsites.net:443';

var opts = {
    cert: fs.readFileSync(path.resolve( './', './client.crt')),
    key: fs.readFileSync(path.resolve( './', './client.key')),
    ca: [fs.readFileSync(path.resolve( './', './serverca.crt')),
         fs.readFileSync(path.resolve( './', './azureca1.pem')),
         fs.readFileSync(path.resolve( './', './azureca2.pem'))]
};

/*
amqp.connect('amqps://guest:guest@'+rabbitHost, opts, function(error0, connection) {
//amqp.connect('amqp://guest:guest@'+rabbitHost, function(error0, connection) {
    if (error0) {
        throw error0;
    }
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
*/


