const https = require('https');
const fs = require('fs');

https.get('https://cloudflare-dns.com/dns-query?name=_mongodb._tcp.taha.pry7k64.mongodb.net&type=SRV', {
  headers: { 'accept': 'application/dns-json' }
}, (res) => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => {
    fs.writeFileSync('dns_result.json', data);
    console.log('Done');
  });
}).on('error', (e) => {
  fs.writeFileSync('dns_result.json', JSON.stringify({error: e.message}));
});
