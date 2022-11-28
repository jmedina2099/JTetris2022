#!/usr/bin/env node

import { connection } from "./socket.js";
import { Server } from "socket.io";
import express from "express";
import http from "http";
import cors from 'cors';
import amqp from 'amqplib/callback_api.js';
import fs from 'fs';
import path from 'path';

//var hostRabbit = 'localhost';
var hostRabbit = 'jtetrisapprabbitmqserver.azurewebsites.net';
var rabbitPort = 5671;
var vhostRabbit = 'rbbt';

var portProxy = 4000;

var socketConection = [];
var channels = {
    channelHash: undefined,
    channelScore: undefined,
    channelBoard: undefined,
    channelFiguras: undefined,
    channelFiguraCayendo: undefined,
}

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
connection(io,socketConection,channels);

var amqpCreateQueueListeners = ( socketConn ) => {

    var urlObj = {
        protocol: 'amqps',
        hostname: hostRabbit,
        port: rabbitPort,
        username: 'jmedina',
        password: 'jmedina',
        locale: 'en_US',
        frameMax: 0,
        heartbeat: 0,
        vhost: vhostRabbit,
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
            console.error(error0);
            return;
        }
        console.log( 'No errors..' );
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }

            channels.channelScore = channel;

            var queue = 'score-queue';
            channel.assertQueue(queue, {
                durable: false
            });
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
            channel.consume(queue, function(msg) {
                if( socketConn[0] ) {
                    socketConn[0].sendScore(msg.content.toString());
                }
            }, {
                noAck: true
            });
        });
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }

            channels.channelBoard = channel;

            var queue = 'board-queue';
            channel.assertQueue(queue, {
                durable: false
            });
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
            channel.consume(queue, function(msg) {
                if( socketConn[0] ) {
                    socketConn[0].sendBoard(msg.content.toString());
                }
            }, {
                noAck: true
            });
        });
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }

            channels.channelHash = channel;

            var queue = 'hash-board-queue';
            channel.assertQueue(queue, {
                durable: false
            });
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
            channel.consume(queue, function(msg) {
                if( socketConn[0] ) {
                    socketConn[0].sendHash(msg.content.toString());
                }
            }, {
                noAck: true
            });
        });
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }

            channels.channelFiguras = channel;

            var queue = 'figures-queue';
            channel.assertQueue(queue, {
                durable: false
            });
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
            channel.consume(queue, function(msg) {
                if( socketConn[0] ) {
                    socketConn[0].sendFigures(msg.content.toString());
                }
            }, {
                noAck: true
            });
        });
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }

            channels.channelFiguraCayendo = channel;

            var queue = 'figure-falling-queue';
            channel.assertQueue(queue, {
                durable: false
            });
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
            channel.consume(queue, function(msg) {
                if( socketConn[0] ) {
                    socketConn[0].sendFigureFalling(msg.content.toString());
                }
            }, {
                noAck: true
            });
        });
    });
}

try {
    amqpCreateQueueListeners( socketConection );
} catch (error) {
    console.error( "********************** ERROR on amqpCreateQueueListeners()" );
    console.error(error);
}

console.error( "END of index.js" );