#!/usr/bin/env node

import amqp from 'amqplib/callback_api.js';
import fs from 'fs';
import path from 'path';

//var rabbitHost = 'localhost:5672';
//var rabbitHost = 'jtetrisapprabbitmqserver.azurewebsites.net:80';
var rabbitHost = 'jtetrisapprabbitmqserver.azurewebsites.net:443';

var opts = {
    cert: fs.readFileSync(path.resolve( './', './client.crt')),
    key:  fs.readFileSync(path.resolve( './', './client.key')),
    ca: [fs.readFileSync(path.resolve( './', './autoridad1.crt')),
         fs.readFileSync(path.resolve( './', './autoridad2.crt')),
         fs.readFileSync(path.resolve( './', './azureca1.pem')),
         fs.readFileSync(path.resolve( './', './azureca2.pem'))]
};

console.log( 'Trying to connect to rabbitmq...' );

amqp.connect('amqps://guest:guest@'+rabbitHost, opts, function(error0, connection) {
//amqp.connect('amqp://guest:guest@'+rabbitHost, function(error0, connection) {
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
