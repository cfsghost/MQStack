var MQStack = require('../');

var mqStack = new MQStack();
mqStack.on('ready', function() {
	mqStack.publish('output', 'test', 'Hello');
});
