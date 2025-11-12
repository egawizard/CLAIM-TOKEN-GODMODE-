// Netlify Function for Farcaster Frame
// Path: netlify/functions/frame.js

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'text/html',
    'Cache-Control': 'public, max-age=0, must-revalidate'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const frameHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CLAIM TOKEN $GODMODE - FREE MINT</title>
  
  <meta property="fc:frame" content="vNext" />
  <meta property="fc:frame:image" content="https://claim-token-godmode.netlify.app/og.png" />
  <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
  <meta property="fc:frame:button:1" content="🚀 Mint Now" />
  <meta property="fc:frame:button:1:action" content="link" />
  <meta property="fc:frame:button:1:target" content="https://claim-token-godmode.netlify.app/app.html" />
  <meta property="fc:frame:button:2" content="📊 Contract" />
  <meta property="fc:frame:button:2:action" content="link" />
  <meta property="fc:frame:button:2:target" content="https://basescan.org/address/0xfe0b0148A535ab66F83e19756A20A0b9fCAF1305" />
  <meta property="fc:frame:post_url" content="https://claim-token-godmode.netlify.app/.netlify/functions/frame" />
  
  <meta property="og:title" content="CLAIM TOKEN $GODMODE - FREE MINT" />
  <meta property="og:description" content="Mint $GODMODE tokens on Base Mainnet! 1B supply, 50x max per user!" />
  <meta property="og:image" content="https://claim-token-godmode.netlify.app/og.png" />
  <meta property="og:url" content="https://claim-token-godmode.netlify.app" />
</head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);min-height:100vh;display:flex;align-items:center;justify-content:center;color:white;">
  <div style="text-align:center;padding:40px;max-width:600px;">
    <h1 style="font-size:72px;margin-bottom:20px;background:linear-gradient(135deg,#ffd700,#ffed4e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:900;">$GODMODE</h1>
    <p style="font-size:24px;margin-bottom:20px;">FREE MINT ON BASE MAINNET</p>
    <p style="font-size:18px;opacity:0.9;margin-bottom:30px;">1B Supply • 50x Max • 45K Per Mint</p>
    <a href="https://claim-token-godmode.netlify.app/app.html" style="display:inline-block;padding:20px 60px;background:linear-gradient(135deg,#ffd700,#ffed4e);color:#000;text-decoration:none;border-radius:16px;font-size:24px;font-weight:900;">🚀 LAUNCH MINT</a>
  </div>
</body>
</html>`;

  return {
    statusCode: 200,
    headers,
    body: frameHtml
  };
};
