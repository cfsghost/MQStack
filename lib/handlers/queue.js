"use strict";

var amqp = require('amqp');
var ascoltatori = require('ascoltatori');
var Handler = require('../handler');

module.exports = function() {
	var handler = new Handler();

	handler.context = null;
	handler.connection = null;
	handler.exchange = null;
	handler.queue = null;

	handler.host = 'localhost';
	handler.port = 5672;
	handler.exchangeName = 'mqstack.queue';

	handler.on('initialize', function(context) {
		var self = this;

		self.context = context;
		self.host = context.host || self.host;
		self.port = context.port || self.port;
		self.queueName = 'default';

		self.connection = amqp.createConnection({
			host: self.host,
			port: self.port
		});

		self.connection.on('ready', function() {
			self.connection.exchange(self.exchangeName, {}, function(exchange) {
				self.exchange = exchange;

				// Initializing queue
				self.connection.queue(self.queueName, function(q) {
					self.queue = q;

					q.bind(exchange, '#');

					q.subscribe(function(message, header, deliveryInfo, messageObject) {
						var packet = {
							routingKey: deliveryInfo.routingKey,
							message: message.data
						};

						self.emit('process', packet);
					});

					self.emit('ready');
				});

			});
		});
	});

	handler.on('input', function(packet) {
		var self = this;

		// Add to queue
		self.exchange.publish(packet.routingKey, packet.message, {});
	});

	return handler;
};
