require('make-promises-safe');
require('dotenv').config();
const amqp = require('amqplib');
const { handlerBoth } = require('./handlers');

let conn, channel;


function getTopics() {
  let topics = null;

  const args = process.argv.slice(2);
  if (args.length > 0) {
    topics = args;
  } else {
    topics = process.env.LISTEN ? process.env.LISTEN.split(' ') : [];
  }
  return topics.filter(topic => topic && validateTopic(topic));
}


function validateTopic(topic) {
  /** @TODO: pattern can be improved */
  const pattern = new RegExp("^([a-z\#\.\*]+)$");
  return pattern.test(topic);
}


function getQueueName(topic) {
  return `logs_${topic.replace('#', 'x_x').replace('.', '_').replace(/\*/g, 'x')}`;
}


async function consume(topics, messageHandler) {
  try {
    // connect to RabbitMQ
    conn = await amqp.connect(process.env.RABBITMQ_URL);

    // create a channel
    channel = await conn.createChannel();
  } catch (err) {
    console.log('Error occurred while initializing RabbitMQ!');
    console.log(err);
    return;
  }

  const exchange = 'platform_logs';

  channel.assertExchange(exchange, 'topic', {
    durable: false
  });

  const queue = await channel.assertQueue('', {
    exclusive: true,
  });

  topics.forEach((topic) => {
    channel.bindQueue(queue.queue, exchange, topic);
  });

  console.log(`[${new Date().toISOString()}] Waiting for logs (${topics.join(', ')}). To exit press CTRL+C`);

  channel.consume(queue.queue, (msg) => {
    messageHandler(msg);
  }, {
    noAck: true
  });

}



const topics = getTopics();
if (!topics || topics.length === 0) {
  console.log('Usage: app.js "<application>.<severity>"  OR  LISTEN="<application>.<severity>" app.js');
  process.exit(1);
}

consume(topics, handlerBoth);
