const https = require('https');
const { randomInt } = require('crypto');
const fs = require('fs'); // Require the filesystem module
const readline = require('readline');


// HELPER METHOD
function extractUniversityOfferingName(htmlString) {
  // A basic regular expression to find the content of the first <th> tag in a specific way
  const regex = /<th[^>]*>\s*<p[^>]*>\s*([^<]+)\s*<\/p>\s*<\/th>/i;
  const match = htmlString.match(regex);

  if (match && match[1]) {
    return match[1].trim();
  } else {
    return 'No <th> element found.';
  }
}

// New helper function to extract universities
function extractUniversities(html, provinceCode = "MB") {
  // Find the select element with id="p_selInstitution"
  const selectRegex = /<select[^>]*id="p_selInstitution"[^>]*>([\s\S]*?)<\/select>/i;
  const selectMatch = html.match(selectRegex);
  
  if (!selectMatch) {
    return [];
  }
  
  const selectContent = selectMatch[1];
  const optionRegex = /<OPTION VALUE="([^"]*)">([^<]*)<\/OPTION>/g;
  
  const universities = [];
  let match;
  while ((match = optionRegex.exec(selectContent)) !== null) {
    universities.push(`${match[2]} (${provinceCode})`);  // Append the province code
  }
  
  return universities;
}

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

// Canadian province/territory codes
const canadianProvinceCodes = [
  'MB', // Manitoba
  'AB', // Alberta
  'BC', // British Columbia
  'NB', // New Brunswick
  'NL', // Newfoundland and Labrador
  'NT', // Northwest Territories
  'NS', // Nova Scotia
  'NU', // Nunavut
  'ON', // Ontario
  'PE', // Prince Edward Island
  'QC', // Quebec
  'SK', // Saskatchewan
  'YT'  // Yukon Territory
];

function makeRequestToServer(data, courseName, provinceCode) {
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
        // Extract universities from the HTML
        const universities = extractUniversities(result, provinceCode);
        console.log("Universities found:", universities);
        resolve(universities);
      });
    });
    req.on('error', (error) => {
      console.log('Error with request:', error.message);
      console.log('Retrying in 5 seconds...');
      setTimeout(() => {
        makeRequestToServer(data, courseName)
          .then(resolve)
          .catch(reject);
      }, 5000);
    });

    req.write(data.toString());
    req.end();
  });
}

async function sendRequestWithRandomUserAgent(
  universityCode,
  department,
  courseCode,
  provinceCode = 'MB'
) {

  const urlencoded = new URLSearchParams();
  urlencoded.append('rpt_type', 'current');
  urlencoded.append('p_selProvState', provinceCode);

  await makeRequestToServer(urlencoded, courseCode, provinceCode);
}

async function readAndPrintLines(fileName, department="STAT", courseCode="STAT 2000") {
  const fileStream = fs.createReadStream(fileName);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    await sendRequestWithRandomUserAgent(line, department, courseCode);
  }

  console.log('Finished reading the file.');
  rl.close();
}

// Function to search all Canadian provinces
async function searchAllProvinces(department="STAT", courseCode="STAT 2000") {
  console.log(`Searching all Canadian provinces for ${courseCode}`);
  
  for (const provinceCode of canadianProvinceCodes) {
    console.log(`Searching province: ${provinceCode}`);
    await sendRequestWithRandomUserAgent('', department, courseCode, provinceCode);
  }
  
  console.log('Finished searching all provinces.');
}

// Comment out the single province search
// sendRequestWithRandomUserAgent('CMB022', 'STAT', 'STAT 2000');

// Search all provinces
searchAllProvinces('STAT', 'STAT 2000');