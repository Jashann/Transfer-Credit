const https = require('https');
const { randomInt } = require('crypto');

function getRandomUserAgent() {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko',
    'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Mobile Safari/537.36',
    'Mozilla/5.0 (iPad; CPU OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
  ];
  return userAgents[randomInt(userAgents.length)];
}

function makeRequestToServer(data, courseName) {
  const options = {
    hostname: 'aurora.umanitoba.ca',
    path: '/ssb/ksstransequiv.p_trans_eq_main',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': getRandomUserAgent(),
    },
  };

  const req = https.request(options, (res) => {
    let result = '';
    res.on('data', (chunk) => {
      result += chunk;
    });
    res.on('end', () => {
      if (result.includes(courseName)) {
        console.log(data.get('p_selInstitution'));
      } else {
        console.log('No');
      }
    });
  });

  req.on('error', (error) => {
    console.error(error);
  });

  req.write(data.toString());
  req.end();
}

function sendRequestWithRandomUserAgent() {
  const urlencoded = new URLSearchParams();
  urlencoded.append('rpt_type', 'current');
  urlencoded.append('p_selProvState', 'ALL');
  urlencoded.append('p_selInstitution', 'CMB022');
  urlencoded.append('p_selSubject', 'STAT');

  makeRequestToServer(urlencoded, 'STAT 1000');

  // Optionally introduce random delay
  const delay = randomInt(1000, 5000); // Delay between 1000 to 5000 milliseconds
  setTimeout(sendRequestWithRandomUserAgent, delay);
}

sendRequestWithRandomUserAgent();
