const mqtt = require('mqtt');
const { InfluxDB } = require('influx');
const config = require('./config.json');

// Create a new InfluxDB instance with configuration options from the config file
const influx = new InfluxDB(config.influxdb);

// Connect to MQTT broker with configuration options from the config file
let client = mqtt.connect(config.mqtt);

// Handle MQTT client connection errors
client.on('error', (error) => {
  console.error('MQTT client error:', error);
});

// Handle MQTT client reconnects
client.on('reconnect', () => {
  console.log('MQTT client reconnecting...');
});

// Handle MQTT client close
client.on('close', () => {
  console.log('MQTT client disconnected');
});

// Handle InfluxDB connection errors
//influx.on ('error', (error) => {
//  console.log('InfluxDB error:', error);
//});

// Handle InfluxDB connection close
//influx.on('close', () => {
//  console.log('InfluxDB connection closed');
//});

// Subscribe to MQTT topics for each machine listed in the config file
for (let machine of config.machines) {
  client.subscribe(machine.topic, (err) => {
    if (err) {
      console.error(`Failed to subscribe to topic ${machine.topic}:`, err);
    } else {
      console.log(`Subscribed to topic ${machine.topic}`);
    }
  });
}

// Handle incoming MQTT messages
client.on('message', (topic, message) => {
  const data = JSON.parse(message);
  const machine = config.machines.find((m) => m.topic === topic);

  if (!machine) {
    console.error(`Received message for unknown topic ${topic}`);
    return;
  }

  // Write data to InfluxDB at logging interval
  setInterval(() => {
    influx.writePoints([
      {
        measurement: 'oee',
        tags: {
          machine: machine.name,
        },
        fields: {
          availability: data.availability,
          performance: data.performance,
          quality: data.quality,
          oee: data.oee,
        },
      },
    ])
    .catch((error) => {
      console.error(`Failed to write data for machine ${machine.name}:`, error);
    });
  }, config.loggingInterval);
});

