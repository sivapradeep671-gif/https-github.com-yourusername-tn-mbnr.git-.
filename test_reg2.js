const http = require('http');

const data = JSON.stringify({
  legalName: "Test API",
  tradeName: "Test Trade",
  type: "Sole Proprietorship",
  category: "Retail",
  address: "Test Addr",
  branchName: "",
  contactNumber: "9876543210"
});

const options = {
  hostname: 'localhost',
  port: 3001,
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
