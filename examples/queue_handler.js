var MQStack = require('../');

var mqStack = new MQStack();
mqStack.on('ready', function() {

	var queueHandler = MQStack.createHandler('queue');
	queueHandler.on('process', function(packet) {
		packet.message += ' was modified';

		// Send out to destination with internal "output" handler
		this.context.handlerManager.emit('output', packet);
	});

	// Add customized handler
	mqStack.addHandler('myQueueHandler', queueHandler, function() {

		// Using this handler to process message
		mqStack.publish('myQueueHandler', 'test', 'Hello');
	});
});
