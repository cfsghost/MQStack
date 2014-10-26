MQStack
---

MQStack is a messsage queuing framework, written in Node.js.

Installation
-

Installing MQStack via NPM:

```
npm install mqstack
```

Usage
-

Here is an example to use MQStack to publish message to AMQP server(RabbitMQ):

```js
var MQStack = require('../');

var mqStack = new MQStack();

mqStack.on('ready', function() {
	// Using "output" handler to forward message to specific channel "test"
	mqStack.publish('output', 'test', 'Hello');
});
```

License
-
MIT
