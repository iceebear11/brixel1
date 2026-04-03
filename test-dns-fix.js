const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
dns.resolve('_mongodb._tcp.taha.pry7k64.mongodb.net', 'SRV', (err, res) => {
  if(err) process.exit(1);
  else process.exit(0);
});
