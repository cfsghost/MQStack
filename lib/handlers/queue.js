"use strict";

var amqp = require('amqp');
var ascoltatori = require('ascoltatori');
var Handler = require('../handler');

module.exports = function() {
	var handler = new Handler();

	handler.context = null;
	handler.host = 'localhost';
	handler.port = 5672;
	handler.connection = null;
	handler.exchangeName = 'mqstack.default';
	handler.exchange = null;
	handler.queueName = 'default';

	handler.on('initialize', function(context) {
		var self = this;

		self.context = context;
		self.connection = amqp.createConnection({
			host: self.host,
			port: self.port
		});

		self.connection.on('ready', function() {
			self.connection.exchange(self.exchangeName, {}, function(exchange) {
				self.exchange = exchange;

				// Initializing queue
				self.connection.queue(self.queueName, function(q) {
					q.bind('#');

					q.subscribe(function(message, header, deliveryInfo, messageObject) {
						var packet = {
							routingKey: deliveryInfo.routingKey,
							message: message
						};

						self.emit('process', packet);
					});
				});

				self.emit('ready');
			});
		});
	});

	handler.on('input', function(packet) {

		// Add to queue
		self.exchange.publish(packet.routingKey, packet.message, {}, function() {
			// Done
		});
	});

	return handler;
};
