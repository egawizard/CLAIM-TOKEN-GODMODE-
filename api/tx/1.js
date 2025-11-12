import { ethers } from "ethers";

export default async function handler(req, res) {
  const { amount } = req.query;
  const mintCount = parseInt(amount || "1", 10);

  const CONTRACT_ADDRESS = "0xfe0b0148A535ab66F83e19756A20A0b9fCAF1305";
  const ABI = ["function mint(uint256 mintCount) payable"];
  const iface = new ethers.Interface(ABI);

  const MINT_PRICE_ETH = 0.00012;
  const value = ethers.parseEther((MINT_PRICE_ETH * mintCount).toString());
  const data = iface.encodeFunctionData("mint", [mintCount]);

  // Balas payload transaksi untuk Farcaster Frame
  res.status(200).json({
    chainId: "eip155:8453", // Base Mainnet
    method: "eth_sendTransaction",
    params: {
      to: CONTRACT_ADDRESS,
      data: data,
      value: "0x" + value.toString(16)
    }
  });
}
