const http = require('http');

const data = JSON.stringify({
  id: "27357af0-85f8-4e4e-b5c9-ab1cc74fae4b",
  legalName: "Test Legal",
  tradeName: "Test Trade",
  type: "Private Limited",
  category: "Retail",
  address: "123 Test Street, Chennai",
  branchName: "Main",
  contactNumber: "9876543210",
  email: "test@example.com",
  gstNumber: "33AABCX7891K1Z5",
  status: "Pending",
  registrationDate: new Date().toISOString(),
  riskScore: 10,
  latitude: 13.0827,
  longitude: 80.2707
});

const options = {
  hostname: 'localhost',
  port: 5173,
  path: '/api/businesses',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  console.log('statusCode:', res.statusCode);
  res.on('data', d => {
    process.stdout.write(d);
  });
});

req.on('error', error => {
  console.error(error);
});

req.write(data);
req.end();
