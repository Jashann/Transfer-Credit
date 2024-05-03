const fs = require('fs'); // Require the filesystem module
const readline = require('readline');

const myHeaders = new Headers();
myHeaders.append(
  'Accept',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7'
);
myHeaders.append(
  'Accept-Language',
  'en-US,en-GB;q=0.9,en;q=0.8,fr;q=0.7,hi;q=0.6'
);
myHeaders.append('Cache-Control', 'max-age=0');
myHeaders.append('Connection', 'keep-alive');
myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
myHeaders.append(
  'Cookie',
  'BIGipServer~INB_SSB_Flex~Banner_Self_Service_BANPROD_pool=319946762.64288.0000'
);
myHeaders.append('DNT', '1');
myHeaders.append('Origin', 'https://aurora.umanitoba.ca');
myHeaders.append(
  'Referer',
  'https://aurora.umanitoba.ca/ssb/ksstransequiv.p_trans_eq_main'
);
myHeaders.append('Sec-Fetch-Dest', 'document');
myHeaders.append('Sec-Fetch-Mode', 'navigate');
myHeaders.append('Sec-Fetch-Site', 'same-origin');
myHeaders.append('Sec-Fetch-User', '?1');
myHeaders.append('Upgrade-Insecure-Requests', '1');
myHeaders.append(
  'User-Agent',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
);
myHeaders.append(
  'sec-ch-ua',
  '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"'
);
myHeaders.append('sec-ch-ua-mobile', '?0');
myHeaders.append('sec-ch-ua-platform', '"Windows"');

async function readAndPrintLines(fileName) {
  const fileStream = fs.createReadStream(fileName);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity, // Handles CR+LF combinations in files correctly
  });

  rl.on('line', (line) => {
    const urlencoded = new URLSearchParams();
    urlencoded.append('rpt_type', 'current');
    urlencoded.append('p_selProvState', 'ALL');
    urlencoded.append('p_selInstitution', line); // Assigning institution code
    urlencoded.append('p_selSubject', 'STAT');

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow',
      timeout: 8000,
    };

    makeRequestToServer(requestOptions, 'STAT 2000');
  });

  rl.on('close', () => {
    console.log('Finished reading the file.');
  });

  rl.on('error', (error) => {
    console.error(`Error reading the file: ${error.message}`);
  });
}

// Usage: Pass the filename you want to read
// readAndPrintLines('universityCodes.txt');

async function makeRequestToServer(requestOptions, courseName) {
  fetch(
    'https://aurora.umanitoba.ca/ssb/ksstransequiv.p_trans_eq_main',
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => {
      if (result.includes(courseName))
        console.log(requestOptions.body.get('p_selInstitution'))
      else 
        console.log('No');
    })
    .catch((error) => console.error(error));
}

const urlencoded = new URLSearchParams();
urlencoded.append('rpt_type', 'current');
urlencoded.append('p_selProvState', 'ALL');
urlencoded.append('p_selInstitution', 'CMB022'); // Assigning institution code
urlencoded.append('p_selSubject', 'STAT');

const requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: urlencoded,
  redirect: 'follow',
};

makeRequestToServer(requestOptions, 'STAT 2000');