import { ethers } from 'ethers';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Connect to Base mainnet
    const provider = new ethers.providers.JsonRpcProvider('https://mainnet.base.org');
    const CONTRACT_ADDRESS = '0xfe0b0148A535ab66F83e19756A20A0b9fCAF1305';
    
    const contractABI = [
      'function totalMintCount() external view returns (uint256)',
      'function remainingMints() external view returns (uint256)',
    ];

    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);
    
    const totalMints = await contract.totalMintCount();
    const remaining = await contract.remainingMints();
    
    const percentComplete = ((20000 - remaining.toNumber()) / 20000 * 100).toFixed(1);

    // Generate stats image (you can use a service like Vercel OG Image)
    const statsImage = `https://claim-token-godmode.vercel.app/og-stats.png?mints=${totalMints}&remaining=${remaining}`;

    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${statsImage}" />
          <meta property="fc:frame:button:1" content="🎁 Mint Now (${remaining} left)" />
          <meta property="fc:frame:button:1:action" content="post" />
          <meta property="fc:frame:button:1:target" content="https://claim-token-godmode.vercel.app" />
          <meta property="fc:frame:button:2" content="🔄 Refresh Stats" />
          <meta property="fc:frame:button:2:action" content="post" />
        </head>
        <body>
          <h1>GODMODE Stats</h1>
          <p>Total Mints: ${totalMints} / 20,000</p>
          <p>Remaining: ${remaining}</p>
          <p>Progress: ${percentComplete}%</p>
        </body>
      </html>
    `);

  } catch (error) {
    console.error('Error fetching stats:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}