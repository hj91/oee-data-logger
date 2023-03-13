The expected message sent to the oee/Machine1 topic should include JSON data with the following fields: availability, performance, quality, and oee.

example json

{
  "availability": 0.95,
  "performance": 0.85,
  "quality": 0.99,
  "oee": 0.8175
}


The input is taken from mqtt topic and output is logged into influxdb. This program expects that calculations are performed before getting logged.


To run the program, simply do npm start after running npm install 

Harshad Joshi, Bufferstack.IO Analytical Technology LLP, Pune
