import { ethers } from 'ethers';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { untrustedData } = req.body;
    const userAddress = untrustedData?.address;

    if (!userAddress) {
      return res.status(400).json({ error: 'Address not provided' });
    }

    // Contract details
    const CONTRACT_ADDRESS = '0xfe0b0148A535ab66F83e19756A20A0b9fCAF1305';
    const MINT_PRICE = ethers.utils.parseEther('0.00012');
    const MINT_AMOUNT = 1; // Default 1 mint

    // Encode the mint function call
    const contractInterface = new ethers.utils.Interface([
      'function mint(uint256 mintCount) external payable'
    ]);
    
    const data = contractInterface.encodeFunctionData('mint', [MINT_AMOUNT]);

    // Return transaction data
    return res.status(200).json({
      chainId: `eip155:8453`, // Base Mainnet
      method: 'eth_sendTransaction',
      params: {
        abi: [],
        to: CONTRACT_ADDRESS,
        data: data,
        value: MINT_PRICE.toString(),
      },
    });

  } catch (error) {
    console.error('Error generating transaction:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}