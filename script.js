const TOKEN_ADDRESS = "0xfe0b0148A535ab66F83e19756A20A0b9fCAF1305";
const ABI = [
  "function mint(address to, uint256 amount) public",
  "function balanceOf(address owner) view returns (uint256)"
];

const connectBtn = document.getElementById('connectButton');
const mintBtn = document.getElementById('mintButton');
const statusEl = document.getElementById('status');

let provider, signer, contract;

async function connectWallet() {
  if (!window.ethereum) {
    statusEl.textContent = "No wallet detected. Open in Warpcast or Metamask.";
    return;
  }
  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    const addr = await signer.getAddress();
    statusEl.textContent = `Connected: ${addr.slice(0, 6)}...${addr.slice(-4)}`;
    connectBtn.disabled = true;
    mintBtn.disabled = false;

    contract = new ethers.Contract(TOKEN_ADDRESS, ABI, signer);
  } catch (err) {
    statusEl.textContent = "Wallet connection failed.";
  }
}

async function mintToken() {
  try {
    statusEl.textContent = "Minting in progress...";
    const tx = await contract.mint(await signer.getAddress(), 1n);
    await tx.wait();
    statusEl.textContent = "✅ Mint success!";

    // optional: autocast share (for Warpcast native)
    if (window.farcaster && window.farcaster.castAction) {
      await window.farcaster.castAction({
        text: "I just minted $GODMODE on Base — free for Farcaster users 🚀",
        embeds: ["https://claim-token-godmode.vercel.app/"]
      });
    }
  } catch (err) {
    statusEl.textContent = "❌ Mint failed.";
    console.error(err);
  }
}

connectBtn.onclick = connectWallet;
mintBtn.onclick = mintToken;
