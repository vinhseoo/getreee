/**
 * cloudinary-seed.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Uploads product images to Cloudinary and generates bcrypt hashes for seed
 * passwords. Run once before applying V3__seed_data.sql.
 *
 * Usage:
 *   cd scripts && npm install && node cloudinary-seed.mjs
 *
 * Output:
 *   scripts/seed-results.json  ← public_ids + secure_urls + password hashes
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { v2 as cloudinary } from 'cloudinary';
import bcrypt from 'bcryptjs';
import fs from 'fs';

// ── Cloudinary config (from application.yml defaults) ───────────────────────
cloudinary.config({
  cloud_name: 'dgklwx7ch',
  api_key:    '587385195839761',
  api_secret: 'FFS2iTJqQyVVl6lC0i7e7IJmFWo',
  secure:     true,
});

// ── Source images (Pexels – free for commercial use, CC0 license) ────────────
// Each key maps to a Pexels photo URL (800px wide).
const SRC = {
  red1:    'https://images.pexels.com/photos/305083/pexels-photo-305083.jpeg?auto=compress&cs=tinysrgb&w=800',
  red2:    'https://images.pexels.com/photos/1300358/pexels-photo-1300358.jpeg?auto=compress&cs=tinysrgb&w=800',
  white1:  'https://images.pexels.com/photos/2255459/pexels-photo-2255459.jpeg?auto=compress&cs=tinysrgb&w=800',
  white2:  'https://images.pexels.com/photos/3628100/pexels-photo-3628100.jpeg?auto=compress&cs=tinysrgb&w=800',
  yellow1: 'https://images.pexels.com/photos/157465/pexels-photo-157465.jpeg?auto=compress&cs=tinysrgb&w=800',
  yellow2: 'https://images.pexels.com/photos/5698855/pexels-photo-5698855.jpeg?auto=compress&cs=tinysrgb&w=800',
  dark1:   'https://images.pexels.com/photos/2582409/pexels-photo-2582409.jpeg?auto=compress&cs=tinysrgb&w=800',
  dark2:   'https://images.pexels.com/photos/1300360/pexels-photo-1300360.jpeg?auto=compress&cs=tinysrgb&w=800',
};

// ── Upload manifest ──────────────────────────────────────────────────────────
// Format: { slug, frames: [srcKey, srcKey, ...] }
// First frame = primary (is_primary = TRUE, display_order = 0).
const PRODUCTS = [
  // Gà Tre Lông Đỏ
  { slug: 'ga-tre-do-tia-nam-dinh',      frames: ['red1',    'red2',    'red1']    },
  { slug: 'ga-tre-do-cua-sac',            frames: ['red2',    'red1']               },
  { slug: 'ga-tre-do-thuan-nam',          frames: ['red1',    'red2']               },
  // Gà Tre Lông Trắng
  { slug: 'ga-tre-trang-tuyet',           frames: ['white1',  'white2']             },
  { slug: 'ga-tre-trang-ngoc-chau',       frames: ['white2',  'white1',  'white2']  },
  { slug: 'ga-tre-trang-dang-tien',       frames: ['white1',  'white2']             },
  // Gà Tre Lông Vàng
  { slug: 'ga-tre-vang-kim',              frames: ['yellow1', 'yellow2', 'yellow1'] },
  { slug: 'ga-tre-vang-ong',              frames: ['yellow2', 'yellow1']            },
  { slug: 'ga-tre-vang-nhat',             frames: ['yellow1', 'yellow2']            },
  // Gà Tre Lông Đen
  { slug: 'ga-tre-den-tuyen-hoi-an',      frames: ['dark1',   'dark2',   'dark1']   },
  { slug: 'ga-tre-den-anh-xanh',          frames: ['dark2',   'dark1']              },
  { slug: 'ga-tre-den-long-mem',          frames: ['dark1',   'dark2']              },
  // Gà Tre Thuần Chủng
  { slug: 'ga-tre-thuan-chung-cao-lanh',  frames: ['red1',    'yellow1', 'red2']    },
  { slug: 'ga-tre-thuan-chung-binh-dinh', frames: ['yellow1', 'red1']               },
  { slug: 'ga-tre-thuan-chung-ben-tre',   frames: ['yellow2', 'red1',    'yellow1'] },
  { slug: 'ga-tre-thuan-chung-tien-giang',frames: ['red1',    'yellow1', 'dark1']   },
  // Gà Tre Dáng Thế
  { slug: 'ga-tre-dang-the-thuong-dang',  frames: ['red2',    'white2']             },
  { slug: 'ga-tre-dang-the-dung-ngoi',    frames: ['white2',  'red1']               },
  { slug: 'ga-tre-dang-the-chien-than',   frames: ['dark1',   'red1',    'yellow1'] },
  { slug: 'ga-tre-dang-the-hoi-tu',       frames: ['yellow2', 'white1',  'dark2']   },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function publicIdFor(slug, index) {
  return `products/${slug}/${index === 0 ? 'main' : String(index).padStart(2, '0')}`;
}

async function uploadOne(srcUrl, publicId) {
  try {
    const result = await cloudinary.uploader.upload(srcUrl, {
      public_id:     publicId,
      overwrite:     true,
      resource_type: 'image',
      quality:       'auto',
      fetch_format:  'auto',
    });
    console.log(`  ✓  ${publicId}`);
    return { publicId: result.public_id, url: result.secure_url };
  } catch (err) {
    console.error(`  ✗  ${publicId} — ${err.message}`);
    return null;
  }
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const images = {};

  console.log('\n📸  Uploading product images to Cloudinary…\n');
  for (const product of PRODUCTS) {
    console.log(`[${product.slug}]`);
    images[product.slug] = [];

    for (let i = 0; i < product.frames.length; i++) {
      const srcKey  = product.frames[i];
      const publicId = publicIdFor(product.slug, i);
      const result  = await uploadOne(SRC[srcKey], publicId);

      if (result) {
        images[product.slug].push({
          publicId:     result.publicId,
          url:          result.url,
          isPrimary:    i === 0,
          displayOrder: i,
        });
      }
      await sleep(250); // be polite to Cloudinary rate limits
    }
  }

  // ── Password hashes (bcrypt strength 10 — matches Spring's default) ────────
  console.log('\n🔐  Generating bcrypt hashes…');
  const PASSWORDS = {
    'Admin@GaTre2024': null,
    'User@GaTre2024':  null,
  };
  for (const plain of Object.keys(PASSWORDS)) {
    PASSWORDS[plain] = await bcrypt.hash(plain, 10);
    console.log(`  ✓  ${plain}`);
  }

  // ── Save results ─────────────────────────────────────────────────────────
  const output = { images, passwords: PASSWORDS };
  fs.writeFileSync('seed-results.json', JSON.stringify(output, null, 2));

  console.log('\n✅  Done! Results saved to scripts/seed-results.json');
  console.log('\nSeed passwords:');
  for (const [plain, hash] of Object.entries(PASSWORDS)) {
    console.log(`  ${plain}`);
    console.log(`  └─ ${hash}`);
  }
}

main().catch(err => {
  console.error('\n❌ Fatal error:', err);
  process.exit(1);
});
