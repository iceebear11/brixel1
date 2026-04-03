const https = require('https');
const fs = require('fs');

https.get('https://cloudflare-dns.com/dns-query?name=taha.pry7k64.mongodb.net&type=TXT', {
  headers: { 'accept': 'application/dns-json' }
}, (res) => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => {
    fs.writeFileSync('dns_txt_result.json', data);
    console.log('Done TXT');
  });
});
