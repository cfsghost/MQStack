"use strict";

var events = require('events');
var util = require('util');
var HandlerManager = require('./handler_manager');

var Stack = module.exports = function() {
	var self = this;

	self.handlerManager = new HandlerManager(self);
};

util.inherits(Stack, events.EventEmitter);

Stack.prototype.addHandler = function(name, handler) {
	var self = this;

	if (self.handlerManager.exists(name)) {
		return throw new Error('Handler name exists already');
	}

	self.handlerManager.add(name, handler);
};
