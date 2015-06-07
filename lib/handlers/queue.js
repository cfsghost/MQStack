"use strict";

var amqp = require('amqp');
var ascoltatori = require('ascoltatori');
var Handler = require('../handler');

module.exports = function() {
	var handler = new Handler();
	handler.setMaxListeners(0);

	handler.context = null;
	handler.connection = null;
	handler.exchange = null;
	handler.queue = null;

	handler.host = 'localhost';
	handler.port = 5672;
	handler.exchangeName = 'mqstack.queue';
	handler.queueName = 'default';

	handler.once('initialize', function(context) {
		var self = handler;

		self.context = context;
		self.host = context.host || self.host;
		self.port = context.port || self.port;

		self._messageHandler = function(message, header, deliveryInfo, messageObject) {
			var packet = {
				routingKey: deliveryInfo.routingKey,
				message: message.data
			};

			var success = handler.emit('process', packet);
		};

		self.connection = amqp.createConnection({
			host: self.host,
			port: self.port
		});

		self.connection.on('error', function(err) {
			self.emit('error', err);
		});

		self.connection.on('ready', function() {

			self.connection.exchange(self.exchangeName, { confirm: true }, function(exchange) {
				self.exchange = exchange;

				// Initializing queue
				self.connection.queue(self.queueName, function(q) {
					self.queue = q;

					q.bind(exchange, '#');

					q.subscribe(self._messageHandler);

					self.emit('ready');
				});

			});
		});
	});

	handler.on('input', function(packet) {
		var self = this;

		// Add to queue
		self.exchange.publish(packet.routingKey, packet.message, { mandatory: true });
	});

	return handler;
};
