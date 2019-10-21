const fs = require('fs');
const path = require('path');

const handlerConsole = (msg) => {
  console.log(`[${new Date().toISOString()}] ${msg.fields.routingKey}: ${msg.content.toString()}`);
};


let writer = null;
const handlerFile = (msg) => {
  if (writer === null) {
    writer = fs.createWriteStream(path.join(__dirname, '../', 'logs.log'), {
      flags: 'a',
      encoding: 'utf8'
    });
  }
  writer.write(`[${new Date().toISOString()}] ${msg.fields.routingKey}: ${msg.content.toString()}\n`);
};


const handlerBoth = (msg) => {
  handlerConsole(msg);
  handlerFile(msg);
};

module.exports = { handlerConsole, handlerFile, handlerBoth };
