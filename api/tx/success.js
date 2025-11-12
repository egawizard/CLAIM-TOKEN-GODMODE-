export default async function handler(req, res) {
  res.status(200).json({
    fcFrame: {
      image: "https://claim-token-godmode.vercel.app/success.png", // ubah sesuai image kamu
      post_url: "https://claim-token-godmode.vercel.app/",
      buttons: [
        {
          label: "Cast Your Mint 🎉",
          action: "link",
          target: "https://warpcast.com/~/compose?text=I%20just%20minted%20$GODMODE%20on%20Base!%20%23farcaster%20%23base"
        }
      ]
    }
  });
}
