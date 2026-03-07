const db = require('./database.cjs');
const { calculateLicenseTimestamps } = require('./licenseStatus.cjs');

console.log('🌱 Starting database seeding...\n');

// Sample businesses with varied license statuses
const businesses = [
  // ACTIVE licenses (valid for 1 year from registration)
  ['CHN-001', 'Sri Krishna Sweets Pvt Ltd', 'Sri Krishna Sweets', 'Private Limited', 'Food & Beverage', '123 M.G. Road, Adyar, Chennai', null, null, null, null, '33AABCS1234F1Z5', 'Verified', '2024-01-15', 5, 13.0067, 80.2496],
  ['CHN-002', 'A2B Adyar Ananda Bhavan', 'A2B', 'Private Limited', 'Food & Beverage', '45 Anna Salai, T. Nagar, Chennai', null, null, null, null, '33AABCA2345F1Z6', 'Verified', '2024-02-20', 2, 13.0418, 80.2341],
  ['CBE-001', 'Annapoorna Hotel Pvt Ltd', 'Annapoorna', 'Private Limited', 'Food & Beverage', 'East Arokiasamy Road, RS Puram, Coimbatore', null, null, null, null, '33AABAN6789F1Z0', 'Verified', '2024-03-15', 4, 11.0168, 76.9558],

  // GRACE period (expired but within 30 days grace)
  ['CHN-003', 'Saravana Stores Pvt Ltd', 'Saravana Stores', 'Private Limited', 'Retail', '78 Ranganathan Street, T. Nagar, Chennai', null, null, null, null, '33AABSS3456F1Z7', 'Verified', '2023-01-10', 3, 13.0422, 80.2344],
  ['CBE-002', 'Geetha Cafe', 'Geetha Cafe', 'Partnership', 'Food & Beverage', 'Nehru Street, Gandhipuram, Coimbatore', null, null, null, null, '33AABGC7890F1Z1', 'Verified', '2023-02-05', 2, 11.0183, 76.9674],

  // PENDING payment (grace expired, payment window active)
  ['CHN-004', 'Murugan Idli Shop', 'Murugan Idli', 'Partnership', 'Food & Beverage', '12 Harrington Road, Chetpet, Chennai', null, null, null, null, '33AABMI4567F1Z8', 'Verified', '2022-12-05', 1, 13.0698, 80.2500],
  ['MDU-001', 'Kumar Mess', 'Kumar Mess', 'Proprietorship', 'Food & Beverage', 'West Masi Street, Madurai', null, null, null, null, '33AABKM9012F1Z3', 'Verified', '2022-11-12', 3, 9.9252, 78.1198],

  // EXPIRED (payment deadline passed)
  ['TPJ-001', 'Vasantha Bhavan', 'Vasantha Bhavan', 'Private Limited', 'Food & Beverage', 'Salai Road, Trichy', null, null, null, null, '33AABVB1234F1Z5', 'Verified', '2022-08-15', 1, 10.7905, 78.7047],
  ['SLM-001', 'Selvam Textiles', 'Selvam Textiles', 'Partnership', 'Retail', 'Cherry Road, Salem', null, null, null, null, '33AABST3456F1Z7', 'Verified', '2022-07-20', 2, 11.6643, 78.1460],

  // High-risk business (ACTIVE but suspicious)
  ['CHN-999', 'Quick Mart Stores', 'Quick Mart', 'Proprietorship', 'Retail', 'Ambattur, Chennai', null, null, null, null, '33AABQM5678F1Z9', 'Pending', '2024-02-01', 45, 13.1143, 80.1548],
];

// Sample scans
const scans = [
  ['CHN-001', null, 13.0067, 80.2496, 'VALID', 0.05, '2024-02-10 10:30:00', null],
  ['CHN-002', null, 13.0418, 80.2341, 'VALID', 0.03, '2024-02-10 11:15:00', null],
  ['CHN-001', null, 13.0500, 80.2800, 'LOCATION_MISMATCH', 5.2, '2024-02-10 14:00:00', null],
  ['CHN-002', null, 13.1000, 80.2900, 'LOCATION_MISMATCH', 7.8, '2024-02-10 14:30:00', null],
  ['CHN-003', null, 13.0422, 80.2344, 'EXPIRED', 0.01, '2024-02-10 15:30:00', null],
  ['CHN-999', null, 13.1143, 80.1548, 'COUNTERFEIT', 0.05, '2024-02-10 16:30:00', null],
  ['CHN-004', null, 13.0698, 80.2500, 'VALID', 0.04, '2024-02-11 09:00:00', null],
  ['CBE-001', null, 11.0168, 76.9558, 'VALID', 0.02, '2024-02-11 10:00:00', null],
  ['CHN-999', null, 13.2000, 80.2000, 'LOCATION_MISMATCH', 12.5, '2024-02-11 12:00:00', null],
];

console.log('📦 Inserting businesses with license timestamps...');
const businessStmt = db.prepare(`
  INSERT OR REPLACE INTO businesses (
    id, legalName, tradeName, type, category, address, 
    proofOfAddress, branchName, contactNumber, email,
    gstNumber, status, registrationDate, riskScore, latitude, longitude,
    license_valid_till, grace_ends_at, pay_by_date, payment_done, license_status
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

businesses.forEach(business => {
  const registrationDate = business[12];
  const licenseTimestamps = calculateLicenseTimestamps(registrationDate);

  const params = [
    ...business,
    licenseTimestamps.license_valid_till,
    licenseTimestamps.grace_ends_at,
    licenseTimestamps.pay_by_date,
    licenseTimestamps.payment_done,
    licenseTimestamps.license_status
  ];

  businessStmt.run(params);
  console.log(`   ✅ ${business[2]} (${business[0]}) - Registered: ${registrationDate}`);
});

console.log(`\n✅ Businesses seeded: ${businesses.length}\n`);

console.log('📊 Inserting scan records...');
const scanStmt = db.prepare(`
  INSERT INTO scans (
    business_id, token, scan_lat, scan_lng, result, distance, scanned_at, device_id
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

scans.forEach(scan => {
  scanStmt.run(scan);
  console.log(`   ✅ Scan for ${scan[0]}: ${scan[4]}`);
});

console.log(`\n✅ Scans seeded: ${scans.length}\n`);

// Display statistics with license status
const allBusinesses = db.prepare('SELECT * FROM businesses').all();
console.log('📈 Database Statistics:');
console.log(`   Total Businesses: ${allBusinesses.length}`);
console.log(`   - Verified: ${allBusinesses.filter(b => b.status === 'Verified').length}`);
console.log(`   - Pending: ${allBusinesses.filter(b => b.status === 'Pending').length}`);

console.log('\n📅 License Status Distribution:');
const now = new Date();
let active = 0, grace = 0, pending = 0, expired = 0;

allBusinesses.forEach(b => {
  if (!b.license_valid_till) return;

  const validTill = new Date(b.license_valid_till);
  const graceEnds = new Date(b.grace_ends_at);
  const payBy = new Date(b.pay_by_date);

  if (now <= validTill) active++;
  else if (now <= graceEnds) grace++;
  else if (now <= payBy && !b.payment_done) pending++;
  else if (now > payBy && !b.payment_done) expired++;
});

console.log(`   - ACTIVE: ${active} (within valid period)`);
console.log(`   - GRACE: ${grace} (30-day grace period)`);
console.log(`   - PENDING: ${pending} (payment overdue)`);
console.log(`   - EXPIRED: ${expired} (license expired)`);

console.log('\n🎉 Database seeding completed successfully!');
console.log('\n📍 Businesses by City:');
console.log(`   Chennai: ${allBusinesses.filter(b => b.id && b.id.startsWith('CHN')).length}`);
console.log(`   Coimbatore: ${allBusinesses.filter(b => b.id && b.id.startsWith('CBE')).length}`);
console.log(`   Madurai: ${allBusinesses.filter(b => b.id && b.id.startsWith('MDU')).length}`);
console.log(`   Trichy: ${allBusinesses.filter(b => b.id && b.id.startsWith('TPJ')).length}`);
console.log(`   Salem: ${allBusinesses.filter(b => b.id && b.id.startsWith('SLM')).length}`);

db.close();

