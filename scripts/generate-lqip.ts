import sharp from 'sharp';

async function generateLqip(imageUrl: string) {
    try {
        const response = await fetch(imageUrl);
        const buffer = await response.arrayBuffer();

        const data = await sharp(Buffer.from(buffer))
            .resize(10) // Resize to 10px width
            .webp({ quality: 20 })
            .toBuffer();

        const base64 = `data:image/webp;base64,${data.toString('base64')}`;
        console.log('LQIP Base64:', base64);
        return base64;
    } catch (error) {
        console.error('Error generating LQIP:', error);
    }
}

// Example usage:
// Run with: npx tsx scripts/generate-lqip.ts
const textImageUrl = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop';
generateLqip(textImageUrl);
