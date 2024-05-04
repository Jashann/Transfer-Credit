const https = require('https');
const { randomInt } = require('crypto');
const fs = require('fs'); // Require the filesystem module
const readline = require('readline');

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
  return new Promise((resolve, reject) => {
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
        const output = result.includes(courseName) ? 'YES' : 'NO';
        const message = ` ${courseName} - ${data.get('p_selInstitution')} - ${output}  \n`;

        fs.appendFile('results.txt', message, (err) => {
          if (err) {
            console.error('Error writing to file:', err);
            reject(err);
          } else {
            console.log(
              'Result appended to file for',
              data.get('p_selInstitution')
            );
            resolve();
          }
        });
      });
    });

    req.on('error', (error) => {
      console.error(error);
      reject(error);
    });

    req.write(data.toString());
    req.end();
  });
}

async function sendRequestWithRandomUserAgent(
  universityCode,
  department,
  courseCode
) {
  console.log(`REQUEST for [${courseCode} - ${universityCode}]`);

  const urlencoded = new URLSearchParams();
  urlencoded.append('rpt_type', 'current');
  urlencoded.append('p_selProvState', 'ALL');
  urlencoded.append('p_selInstitution', universityCode);
  urlencoded.append('p_selSubject', department);

  await makeRequestToServer(urlencoded, courseCode);
}

async function readAndPrintLines(fileName) {
  const fileStream = fs.createReadStream(fileName);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    await sendRequestWithRandomUserAgent(line, 'STAT', 'STAT 1000');
  }

  console.log('Finished reading the file.');
  rl.close();
}

readAndPrintLines('universityCodesSmall.txt');
// sendRequestWithRandomUserAgent('CMB022', 'STAT', 'STAT 1000');
