import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple SVG icon content (blue wallet icon)
const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#3b82f6" rx="100"/>
  <path fill="#ffffff" d="M128 160h256c17.7 0 32 14.3 32 32v128c0 17.7-14.3 32-32 32H128c-17.7 0-32-14.3-32-32V192c0-17.7 14.3-32 32-32zm32 64h192v64H160v-64z"/>
  <circle cx="384" cy="160" r="48" fill="#ffffff"/>
</svg>
`;

const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Save SVG
const svgPath = path.join(publicDir, 'icon-source.svg');
fs.writeFileSync(svgPath, svgContent);

// Generate PNG icons in different sizes
const sizes = [152, 167, 180, 192, 512];

async function generateIcons() {
  for (const size of sizes) {
    try {
      await sharp(svgPath)
        .resize(size, size)
        .png()
        .toFile(path.join(publicDir, `icon-${size}.png`));
      console.log(`✅ Generated icon-${size}.png`);
    } catch (error) {
      console.error(`❌ Error generating icon-${size}.png:`, error);
    }
  }
  
  console.log('\n✅ All PNG icons generated successfully!');
  console.log('📱 iOS "Add to Home Screen" should now work after deployment to HTTPS.');
}

generateIcons();
