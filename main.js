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

const urlencoded = new URLSearchParams();
urlencoded.append('rpt_type', 'current');
urlencoded.append('p_selProvState', 'ALL');

const requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: urlencoded,
  redirect: 'follow',
};

fetch(
  'https://aurora.umanitoba.ca/ssb/ksstransequiv.p_trans_eq_main',
  requestOptions
)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
