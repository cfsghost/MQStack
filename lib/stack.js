"use strict";

var events = require('events');
var util = require('util');
var HandlerManager = require('./handler_manager');

var Stack = module.exports = function(opts) {
	var self = this;

	var _opts = opts || {};
	self.host = _opts.host || null;
	self.port = _opts.port || null;
	self.exchangeName = _opts.exchangeName || null;
	self.handlerManager = new HandlerManager(self);

	self.handlerManager.on('ready', function() {
		self.emit('ready');
	});
};

util.inherits(Stack, events.EventEmitter);

Stack.prototype.addHandler = function(name, handler, callback) {
	var self = this;

	if (self.handlerManager.exists(name)) {
		throw new Error('Handler name exists already');
		return;
	}

	self.handlerManager.add(name, handler, function() {
		if (callback)
			callback();
	});
};

Stack.prototype.publish = function(handlerName, topic, message) {
	var self = this;

	if (!self.handlerManager.exists(handlerName)) {
		throw new Error('No such handler');
		return;
	}

	var packet = {
		routingKey: topic,
		message: message
	};

	self.handlerManager.emit(handlerName, packet);
};
