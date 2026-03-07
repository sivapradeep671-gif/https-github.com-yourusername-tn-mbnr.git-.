const http = require('http');

const data = JSON.stringify({
  legalName: "Amrit Tea Exports Pvt Ltd",
  tradeName: "Amrit Tea House",
  type: "Private Limited",
  category: "Food & Beverage",
  gstNumber: "33AABCX7891K1Z5",
  address: "45 Sterling Road, Nungambakkam, Chennai",
  branchName: "Main Branch, Nungambakkam",
  contactNumber: "9876543210",
  email: "contact@amrittea.com"
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
