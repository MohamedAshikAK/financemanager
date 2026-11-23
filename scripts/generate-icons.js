/**
 * Generate PNG icons from SVG for iOS PWA support
 * Run: node scripts/generate-icons.js
 */

const fs = require('fs');
const path = require('path');

// Simple SVG icon content (blue wallet icon)
const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#3b82f6" rx="100"/>
  <path fill="#ffffff" d="M128 160h256c17.7 0 32 14.3 32 32v128c0 17.7-14.3 32-32 32H128c-17.7 0-32-14.3-32-32V192c0-17.7 14.3-32 32-32zm32 64h192v64H160v-64z"/>
  <circle cx="384" cy="160" r="48" fill="#ffffff"/>
</svg>
`;

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Save SVG
fs.writeFileSync(path.join(publicDir, 'icon-192.svg'), svgContent);
fs.writeFileSync(path.join(publicDir, 'icon-512.svg'), svgContent);

console.log('✅ SVG icons created in public/ directory');
console.log('⚠️  For iOS PWA, you need PNG icons.');
console.log('');
console.log('To create PNG icons:');
console.log('1. Go to https://cloudconvert.com/svg-to-png');
console.log('2. Upload public/icon-192.svg');
console.log('3. Download as icon-192.png (192x192)');
console.log('4. Upload public/icon-512.svg');
console.log('5. Download as icon-512.png (512x512)');
console.log('6. Also create: icon-152.png, icon-167.png, icon-180.png');
console.log('7. Place all PNG files in the public/ directory');
console.log('');
console.log('After adding PNG icons, run: npm run build');
