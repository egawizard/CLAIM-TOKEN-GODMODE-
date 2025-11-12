export default function handler(req, res) {
  res.status(200).json({
    image: 'https://claim-token-godmode.vercel.app/success.png',
    buttons: [
      {
        label: 'Share on Warpcast 🎉',
        action: 'link',
        target: 'https://warpcast.com/~/compose?text=Just%20minted%20%24GODMODE!%20%F0%9F%9A%80%0A%0AClaim:%20https://claim-token-godmode.vercel.app/'
      },
      {
        label: 'View Transaction',
        action: 'link',
        target: 'https://basescan.org'
      },
      {
        label: 'Mint Again',
        action: 'post',
        target: 'https://claim-token-godmode.vercel.app'
      }
    ]
  });
}