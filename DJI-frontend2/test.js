const mqtt = require('mqtt');

const client = mqtt.connect('mqtt://192.168.6.3:1883');

client.on('connect', () => {
  console.log('Connected');
});

client.on('error', (error) => {
  console.error('Error:', error);
});
