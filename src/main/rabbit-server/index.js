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

var hostRabbit = 'jtetrisapprabbitmqserver.azurewebsites.net';
var rabbitPort = 5671;

var hostBack = 'localhost';
var hostPort = '8080';

var portProxy = 4000;

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

var forwardtoBack  = (req, res, url ) => {
    try {
        req.pipe(request(url))
            .on('error', err => {
                const msg = 'Error on connecting to the request, url='+url;
                console.error(msg, err);
                res.status(500).send(msg);
            })
            .pipe(res);
    } catch (error) {
        console.error( "********************** ERROR on forwardtoBack()" );
        console.error(error);
        res.status(404).send({
            message: 'Error redirecting to url ='+url
        });
    }
};

app.get('/', (req, res) => {
    forwardtoBack( req,res,'http://'+hostBack+':'+hostPort);
}).get('/start', (req, res) => {
    forwardtoBack( req,res,'http://'+hostBack+':'+hostPort+'/start');
}).get('/pause', (req, res) => {
    forwardtoBack( req,res,'http://'+hostBack+':'+hostPort+'/pause');
}).get('/right', (req, res) => {
    forwardtoBack( req,res,'http://'+hostBack+':'+hostPort+'/right');
}).get('/left', (req, res) => {
    forwardtoBack( req,res,'http://'+hostBack+':'+hostPort+'/left');
}).get('/up', (req, res) => {
    forwardtoBack( req,res,'http://'+hostBack+':'+hostPort+'/up');
}).get('/down', (req, res) => {
    forwardtoBack( req,res,'http://'+hostBack+':'+hostPort+'/down');
}).get('/space', (req, res) => {
    forwardtoBack( req,res,'http://'+hostBack+':'+hostPort+'/space');
}).get('/board', (req, res) => {
    forwardtoBack( req,res,'http://'+hostBack+':'+hostPort+'/board');
});

app.use((err,req,res,next) => {
    res.status(500).send('ERROR')
});

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
            console.error(error0);
            return;
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