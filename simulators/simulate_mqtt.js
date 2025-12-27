const mqtt = require('mqtt');
const axios = require('axios');

const MQTT_BROKER = process.env.MQTT_BROKER || 'mqtt://localhost:1883';
const API_URL = process.env.API_URL || 'http://localhost:3000';
const SCENARIO = process.env.SCENARIO || 'day-night';
const RATE = parseInt(process.env.RATE_MS) || 1000; // milliseconds

// Device configurations
const devices = [
  { id: 'd1', name: 'Living Room Light', type: 'light', room: 'Living Room' },
  { id: 'd2', name: 'Bedroom Thermostat', type: 'thermostat', room: 'Bedroom' },
  { id: 'd3', name: 'Kitchen Motion Sensor', type: 'sensor', room: 'Kitchen' },
  { id: 'd4', name: 'Front Door Lock', type: 'lock', room: 'Entrance' },
];

// Connect to MQTT broker
const client = mqtt.connect(MQTT_BROKER);

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  startSimulation();
});

client.on('error', (error) => {
  console.error('MQTT error:', error);
});

function generateTelemetry(device) {
  const now = new Date();
  const hour = now.getHours();
  
  let metrics = {};
  
  switch (device.type) {
    case 'light':
      metrics = {
        brightness: Math.floor(Math.random() * 100),
        on: hour >= 6 && hour < 22, // Daytime
        power: Math.random() * 50 + 10,
      };
      break;
    case 'thermostat':
      metrics = {
        temperature: 20 + Math.random() * 5,
        humidity: 40 + Math.random() * 20,
        targetTemp: 22,
        mode: 'auto',
      };
      break;
    case 'sensor':
      metrics = {
        motion: Math.random() > 0.7,
        light: Math.random() * 1000,
        temperature: 21 + Math.random() * 3,
      };
      break;
    case 'lock':
      metrics = {
        locked: true,
        battery: 80 + Math.random() * 20,
      };
      break;
    default:
      metrics = { value: Math.random() * 100 };
  }
  
  return {
    deviceId: device.id,
    ts: now.toISOString(),
    metrics,
  };
}

async function publishTelemetry(telemetry) {
  // Publish to MQTT
  const topic = `devices/${telemetry.deviceId}/telemetry`;
  client.publish(topic, JSON.stringify(telemetry), { qos: 1 });
  
  // Also send to backend API
  try {
    await axios.post(`${API_URL}/api/telemetry`, telemetry);
  } catch (error) {
    console.error('Error sending to API:', error.message);
  }
}

function startSimulation() {
  console.log(`Starting simulation with scenario: ${SCENARIO}, rate: ${RATE}ms`);
  
  setInterval(() => {
    devices.forEach(device => {
      const telemetry = generateTelemetry(device);
      publishTelemetry(telemetry);
      console.log(`Published: ${device.name}`, telemetry.metrics);
    });
  }, RATE);
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down...');
  client.end();
  process.exit(0);
});

