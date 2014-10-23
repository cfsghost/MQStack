var amqp = require('amqp');
var ascoltatori = require('ascoltatori');

// Connect to pub/sub server
ascoltatori.build({
	type: 'amqp',
	json: false,
	amqp: amqp,
	exchange: 'mqstack.default',
	client: {
		host: 'localhost',
	}
}, function(ascoltatore) {

	ascoltatore.subscribe('test', function(message) {
		console.log('Received:', message);
	});
});
