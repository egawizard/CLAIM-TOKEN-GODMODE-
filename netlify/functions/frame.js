// Netlify Function for Farcaster Frame - WORKING FORMAT
// Save as: netlify/functions/frame.js

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'text/html; charset=utf-8'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // CRITICAL: Frame meta tags harus dalam format HTML yang sangat spesifik
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>CLAIM TOKEN $GODMODE - FREE MINT</title>
  
  <meta name="fc:frame" content="vNext">
  <meta name="fc:frame:image" content="https://claim-token-godmode.netlify.app/og.png">
  <meta name="fc:frame:button:1" content="Mint Now">
  <meta name="fc:frame:button:1:action" content="link">
  <meta name="fc:frame:button:1:target" content="https://claim-token-godmode.netlify.app/app.html">
  
  <meta property="og:title" content="CLAIM TOKEN $GODMODE - FREE MINT">
  <meta property="og:image" content="https://claim-token-godmode.netlify.app/og.png">
</head>
<body>
  <h1>$GODMODE - FREE MINT</h1>
  <p>Click the button above to start minting!</p>
</body>
</html>`;

  return {
    statusCode: 200,
    headers,
    body: html
  };
};
