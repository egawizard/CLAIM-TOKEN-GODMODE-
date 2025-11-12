/**
 * Farcaster Frame Backend Logic for $GODMODE Token Mint
 * * NOTE: This is a conceptual example using Express.js and Viem.
 * You must install dependencies (express, viem, @farcaster/frames.js) 
 * and configure environment variables (like ALCHEMY_API_KEY) to run this live.
 * * Contract: 0xfe0b0148A535ab66F83e19756A20A0b9fCAF1305 (Base Mainnet)
 */
import express from 'express';
import { getFrameHtml, FrameActionData, FrameButton } from '@farcaster/frames.js';
import { createPublicClient, http, parseAbi, formatEther } from 'viem';
import { base } from 'viem/chains';

const app = express();
const port = process.env.PORT || 3000;

// --- CONFIGURATION ---
const CONTRACT_ADDRESS = '0xfe0b0148A535ab66F83e19756A20A0b9fCAF1305';
const MINT_PRICE_ETH = 0.00012; // 0.00012 ETH per mint
const TOTAL_MINTS_AVAILABLE = 20000;
const MAX_MINTS_PER_USER = 50;
const TOKENS_PER_MINT = 45000;
const CHAIN_ID = base.id; // 8453

// Define the contract ABI subset needed for view functions and the mint transaction
const GODMODE_ABI = parseAbi([
    'function totalMintCount() view returns (uint256)',
    'function userMintCount(address) view returns (uint256)',
    'function mint(uint256 mintCount) payable',
    'function remainingMints() view returns (uint256)'
]);

// Initialize Viem Public Client for Base Mainnet
// IMPORTANT: Replace 'YOUR_ALCHEMY_API_KEY' with a real RPC endpoint or key.
const publicClient = createPublicClient({
    chain: base,
    transport: http(`https://base-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY`),
});

// Middleware to parse JSON bodies
app.use(express.json());

// Helper function to create the Mint Progress Bar image (Luxurious Style)
function createProgressBarSVG(current, total, mintsLeft) {
    const percentage = (current / total) * 100;
    const barWidth = 500;
    const filledWidth = (barWidth * percentage) / 100;

    return `
        <svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
            <style>
                .title { font: bold 28px sans-serif; fill: #FFFFFF; }
                .subtitle { font: 16px sans-serif; fill: #FFD700; }
                .stat { font: 20px sans-serif; fill: #FFFFFF; }
            </style>
            <!-- Background (Deep Navy/Black) -->
            <rect width="100%" height="100%" fill="#0D0D1A"/>
            
            <!-- Title -->
            <text x="300" y="50" text-anchor="middle" class="title">💎 CLAIM $GODMODE TOKEN 💎</text>
            <text x="300" y="85" text-anchor="middle" class="subtitle">FREE MINT for Farcaster Users (Limit 50x per wallet)</text>

            <!-- Progress Bar Frame -->
            <rect x="50" y="150" width="${barWidth}" height="30" rx="15" fill="#333366" stroke="#FFD700" stroke-width="2"/>
            
            <!-- Progress Bar Fill (Gold/Gradient look) -->
            <rect x="50" y="150" width="${filledWidth}" height="30" rx="15" fill="#FFD700">
                <animate attributeName="width" from="0" to="${filledWidth}" dur="1s" fill="freeze"/>
            </rect>

            <!-- Progress Text -->
            <text x="300" y="172" text-anchor="middle" class="stat" fill="#0D0D1A">
                ${current.toLocaleString()}/${total.toLocaleString()} Mints (${percentage.toFixed(1)}%)
            </text>

            <!-- Status Text -->
            <text x="300" y="250" text-anchor="middle" class="stat">
                Total Mints Remaining: ${mintsLeft.toLocaleString()}
            </text>

            <!-- Mint Info -->
            <text x="300" y="300" text-anchor="middle" class="subtitle">
                Mint Fee: ${MINT_PRICE_ETH} ETH (Free Mint Label) | You get ${TOKENS_PER_MINT.toLocaleString()} $GODMODE
            </text>
        </svg>
    `;
}

// --- FRAME ENDPOINTS ---

/**
 * 1. Initial Frame (GET /)
 * Displays the current state and the Mint button.
 */
app.get('/', async (req, res) => {
    try {
        const totalMintCount = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: GODMODE_ABI,
            functionName: 'totalMintCount',
        });
        
        const currentMints = Number(totalMintCount);
        const remainingMints = TOTAL_MINTS_AVAILABLE - currentMints;

        const svg = createProgressBarSVG(currentMints, TOTAL_MINTS_AVAILABLE, remainingMints);
        const svgBase64 = Buffer.from(svg).toString('base64');
        const imageUrl = `data:image/svg+xml;base64,${svgBase64}`;
        
        const mintButton = {
            label: `FREE MINT 1x (${TOKENS_PER_MINT.toLocaleString()} $GODMODE)`,
            action: 'tx', // Set action to 'tx' for transaction frame
            target: '/api/tx-data?mintCount=1' // Target for generating TX data
        };

        const websiteButton = {
            label: 'View Project Details',
            action: 'link',
            target: 'https://claim-token-godmode.vercel.app/' // External website link
        };

        const frameHtml = getFrameHtml({
            version: 'vNext',
            image: imageUrl,
            postUrl: '/api/tx-success', // Post-tx success handler
            buttons: [
                mintButton,
                websiteButton
            ],
            // Farcaster handles wallet connection implicitly for 'tx' actions
        });

        res.status(200).send(frameHtml);
    } catch (error) {
        console.error("Error generating initial frame:", error);
        // Fallback frame on error
        const errorSvg = createProgressBarSVG(0, TOTAL_MINTS_AVAILABLE, TOTAL_MINTS_AVAILABLE);
        const errorSvgBase64 = Buffer.from(errorSvg).toString('base64');
        const errorImageUrl = `data:image/svg+xml;base64,${errorSvgBase64}`;
        
        res.status(200).send(getFrameHtml({
            version: 'vNext',
            image: errorImageUrl,
            buttons: [{ label: 'Error Loading State. Try Refreshing', action: 'post' }],
            postUrl: '/'
        }));
    }
});

/**
 * 2. Transaction Data Endpoint (GET /api/tx-data)
 * Generates the transaction payload for the Farcaster wallet.
 */
app.get('/api/tx-data', (req, res) => {
    const mintCount = parseInt(req.query.mintCount || '1');

    if (mintCount < 1 || mintCount > MAX_MINTS_PER_USER) {
        return res.status(400).send({ message: 'Invalid mint count.' });
    }

    const value = BigInt(Math.round(MINT_PRICE_ETH * mintCount * 1e18)); // Calculate total ETH value

    // Encode the function call (mint(uint256))
    const calldata = publicClient.writeContract.get///({
        abi: GODMODE_ABI,
        functionName: 'mint',
        args: [BigInt(mintCount)],
        address: CONTRACT_ADDRESS,
        value: value,
    });
    
    // Response payload for Farcaster client to initiate the transaction
    res.status(200).send({
        chainId: `eip155:${CHAIN_ID}`, // Base Mainnet chain ID
        method: 'eth_sendTransaction',
        params: {
            abi: JSON.stringify(GODMODE_ABI.find(i => i.name === 'mint')),
            to: CONTRACT_ADDRESS,
            data: calldata,
            value: formatEther(value),
        },
    });
});


/**
 * 3. Transaction Success Autocast Endpoint (POST /api/tx-success)
 * Handles the success response and provides a button to autocast the success message.
 */
app.post('/api/tx-success', async (req, res) => {
    try {
        const frameData = req.body;
        // The transaction hash is usually available in the frame data but we'll use a generic success message
        
        const successMessage = `
            <svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#0D0D1A"/>
                <text x="300" y="100" text-anchor="middle" style="font: bold 32px sans-serif; fill: #FFD700;">✅ MINT SUCCESSFUL! ✅</text>
                <text x="300" y="150" text-anchor="middle" style="font: 24px sans-serif; fill: #FFFFFF;">
                    You have claimed ${TOKENS_PER_MINT.toLocaleString()} $GODMODE Tokens.
                </text>
                <text x="300" y="200" text-anchor="middle" style="font: 20px sans-serif; fill: #AAAAAA;">
                    Thank you for joining the $GODMODE community!
                </text>
                <text x="300" y="300" text-anchor="middle" style="font: 20px sans-serif; fill: #FFFFFF;">
                    Click below to share your success on Farcaster!
                </text>
            </svg>
        `;

        const svgBase64 = Buffer.from(successMessage).toString('base64');
        const imageUrl = `data:image/svg+xml;base64,${svgBase64}`;
        
        const autocastText = `Just claimed my FREE ${TOKENS_PER_MINT.toLocaleString()} $GODMODE Tokens on Base via a Farcaster Frame! 💎 Join the $GODMODE army here: ${req.headers.host}`;

        const frameHtml = getFrameHtml({
            version: 'vNext',
            image: imageUrl,
            buttons: [
                {
                    label: '✨ Autocast My Success!',
                    action: 'link',
                    target: `https://warpcast.com/~/compose?text=${encodeURIComponent(autocastText)}&embeds[]=${encodeURIComponent(req.headers.host)}`
                },
                {
                    label: 'Go Back',
                    action: 'post',
                    target: '/'
                }
            ],
            postUrl: '/', // Final post state doesn't need to post further
        });

        res.status(200).send(frameHtml);
    } catch (error) {
        console.error("Error handling transaction success:", error);
        res.status(500).send("An internal error occurred.");
    }
});


app.listen(port, () => {
    console.log(`Farcaster Frame server listening on port ${port}`);
});