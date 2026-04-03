const dns = require('dns');

console.log('Starting DNS query...');
dns.resolve('_mongodb._tcp.taha.pry7k64.mongodb.net', 'SRV', (err, addresses) => {
  if (err) {
    console.error('DNS Error:', err);
  } else {
    console.log('Addresses:', addresses);
  }
});
