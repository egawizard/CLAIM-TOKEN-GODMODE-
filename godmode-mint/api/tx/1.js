export default function handler(req, res) {
  const CONTRACT = '0xfe0b0148A535ab66F83e19756A20A0b9fCAF1305';
  const mintCount = 1;
  
  res.status(200).json({
    chainId: 'eip155:8453',
    method: 'eth_sendTransaction',
    params: {
      abi: [{
        inputs: [{ name: 'mintCount', type: 'uint256' }],
        name: 'mint',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
      }],
      to: CONTRACT,
      data: '0xa0712d68' + (1).toString(16).padStart(64, '0'),
      value: '0x' + Math.floor(0.00012 * 1e18).toString(16)
    }
  });
}