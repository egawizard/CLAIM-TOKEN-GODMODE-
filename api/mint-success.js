export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { untrustedData } = req.body;
    const txHash = untrustedData?.transactionId;

    // Generate success frame
    const successImage = `https://claim-token-godmode.vercel.app/success-image.png`;
    
    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${successImage}" />
          <meta property="fc:frame:button:1" content="✅ Mint Successful!" />
          <meta property="fc:frame:button:2" content="🔄 Mint Again" />
          <meta property="fc:frame:button:2:action" content="post" />
          <meta property="fc:frame:button:2:target" content="https://claim-token-godmode.vercel.app" />
          <meta property="fc:frame:button:3" content="📊 View on BaseScan" />
          <meta property="fc:frame:button:3:action" content="link" />
          <meta property="fc:frame:button:3:target" content="https://basescan.org/tx/${txHash}" />
          <meta property="fc:frame:button:4" content="🎉 Share Cast" />
          <meta property="fc:frame:button:4:action" content="link" />
          <meta property="fc:frame:button:4:target" content="https://warpcast.com/~/compose?text=${encodeURIComponent('Just minted 45,000 $GODMODE tokens! 🚀 Join the revolution: https://claim-token-godmode.vercel.app #GODMODE')}" />
        </head>
        <body>
          <h1>Mint Successful!</h1>
        </body>
      </html>
    `);

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}