"use strict";

var amqp = require('amqp');
var ascoltatori = require('ascoltatori');
var Handler = require('../handler');

module.exports = function() {
	var handler = new Handler();

	handler.context = null;
	handler.host = 'localhost';
	handler.port = 5672;
	handler.exchangeName = 'mqstack.default';

	handler.on('initialize', function(context) {
		var self = this;

		self.context = context;
		self.ascoltatore = null;

		// Connect to pub/sub server
		ascoltatori.build({
			type: 'amqp',
			json: false,
			amqp: amqp,
			exchange: self.exchangeName,
			client: {
				host: self.host,
				port: self.port
			}
		}, function(ascoltatore) {

			self.ascoltatore = ascoltatore;

			self.emit('ready');
		});
	};

	//handler.on('input', function(message, header, deliveryInfo, messageObject) {
	handler.on('input', function(packet) {

		// Sent out message to client's queue
		this.ascoltatore.publish(packet.routingKey, packet.message, function() {
			// Done
		});
	});

	return handler;
};
