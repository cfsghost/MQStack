"use strict";

var events = require('events');
var util = require('util');

var Handler = module.exports = function() {
};

util.inherits(Handler, events.EventEmitter);
