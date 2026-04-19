/**
 * cloudinary-patch.mjs
 * Uploads primary images for products that were missing them after the first run.
 * (Pexels 305083 and 2582409 were blocked by their hotlink protection)
 */

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: 'dgklwx7ch',
  api_key:    '587385195839761',
  api_secret: 'FFS2iTJqQyVVl6lC0i7e7IJmFWo',
  secure:     true,
});

// Working fallback URLs (already confirmed accessible)
const FALLBACK = {
  red:    'https://images.pexels.com/photos/1300358/pexels-photo-1300358.jpeg?auto=compress&cs=tinysrgb&w=800',  // red2
  dark:   'https://images.pexels.com/photos/1300360/pexels-photo-1300360.jpeg?auto=compress&cs=tinysrgb&w=800',  // dark2
  yellow: 'https://images.pexels.com/photos/157465/pexels-photo-157465.jpeg?auto=compress&cs=tinysrgb&w=800',    // yellow1
  yellow2:'https://images.pexels.com/photos/5698855/pexels-photo-5698855.jpeg?auto=compress&cs=tinysrgb&w=800',  // yellow2
};

// Products that are missing their primary (index 0 / 'main') image
const PATCHES = [
  { publicId: 'products/ga-tre-do-tia-nam-dinh/main',       src: FALLBACK.red    },
  { publicId: 'products/ga-tre-do-thuan-nam/main',           src: FALLBACK.red    },
  { publicId: 'products/ga-tre-den-tuyen-hoi-an/main',       src: FALLBACK.dark   },
  { publicId: 'products/ga-tre-den-long-mem/main',           src: FALLBACK.dark   },
  { publicId: 'products/ga-tre-thuan-chung-cao-lanh/main',   src: FALLBACK.yellow },
  { publicId: 'products/ga-tre-thuan-chung-tien-giang/main', src: FALLBACK.yellow2},
  { publicId: 'products/ga-tre-dang-the-chien-than/main',    src: FALLBACK.dark   },
  // Also add /01 for single-image products
  { publicId: 'products/ga-tre-do-cua-sac/01',               src: FALLBACK.red    },
  { publicId: 'products/ga-tre-den-anh-xanh/01',             src: FALLBACK.dark   },
  { publicId: 'products/ga-tre-thuan-chung-binh-dinh/01',    src: FALLBACK.yellow },
  { publicId: 'products/ga-tre-dang-the-dung-ngoi/01',       src: FALLBACK.dark   },
];

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const results = JSON.parse(fs.readFileSync('seed-results.json', 'utf-8'));

  console.log('\n🔁  Patching missing images…\n');
  for (const patch of PATCHES) {
    try {
      const result = await cloudinary.uploader.upload(patch.src, {
        public_id:     patch.publicId,
        overwrite:     true,
        resource_type: 'image',
        quality:       'auto',
        fetch_format:  'auto',
      });

      // Update seed-results.json
      const slug = patch.publicId.split('/')[1];
      const filename = patch.publicId.split('/').pop(); // 'main', '01', etc.
      const isPrimary = filename === 'main';
      const displayOrder = isPrimary ? 0 : parseInt(filename, 10);

      if (!results.images[slug]) results.images[slug] = [];

      // Remove any duplicate entry for same publicId
      results.images[slug] = results.images[slug].filter(
        img => img.publicId !== result.public_id
      );

      // Insert primary at front, others at end
      const entry = {
        publicId:     result.public_id,
        url:          result.secure_url,
        isPrimary,
        displayOrder,
      };
      if (isPrimary) {
        results.images[slug].unshift(entry);
        // Fix displayOrder for existing entries (they shift by 1 if needed)
        results.images[slug].forEach((img, idx) => {
          if (idx > 0) img.displayOrder = idx;
          img.isPrimary = idx === 0;
        });
      } else {
        results.images[slug].push(entry);
      }

      console.log(`  ✓  ${result.public_id}`);
    } catch (err) {
      console.error(`  ✗  ${patch.publicId} — ${err.message}`);
    }
    await sleep(250);
  }

  fs.writeFileSync('seed-results.json', JSON.stringify(results, null, 2));
  console.log('\n✅  Patch complete. seed-results.json updated.');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
