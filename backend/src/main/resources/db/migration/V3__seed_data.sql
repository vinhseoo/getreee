-- =============================================================================
-- V3__seed_data.sql
-- Gà Tre — Production-quality seed data
-- Images: hosted on Cloudinary (cloud: dgklwx7ch, uploaded from Pexels CC0)
-- Passwords: BCrypt strength-10 hashes
--   ADMIN → Admin@GaTre2024
--   USER  → User@GaTre2024
-- =============================================================================
-- NOTE: No explicit BEGIN/COMMIT — Flyway manages the transaction.

-- ─────────────────────────────────────────────────────────────────────────────
-- USERS
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO users (email, name, avatar_url, role, provider, provider_id, password_hash, is_active, created_at, updated_at) VALUES

-- Admin (LOCAL)
('admin@gatre.vn',
 'Nguyễn Văn Quản Trị',
 'https://res.cloudinary.com/dgklwx7ch/image/upload/v1776617693/products/ga-tre-trang-tuyet/main.jpg',
 'ADMIN', 'LOCAL', NULL,
 '$2a$10$07lsnebBi2uzSXSC.E7sH.rYQxFCAtRECGPd1hZaF5GhF1.myf6gq',
 TRUE,
 NOW() - INTERVAL '120 days', NOW() - INTERVAL '2 days'),

-- Regular users — GOOGLE
('nguyen.minh.thanh@gmail.com',
 'Nguyễn Minh Thành',
 'https://lh3.googleusercontent.com/a/ACg8ocJr_A1tgHnNc4bPZ9kT1MxQnHp0KpA6Xv2WLdQ9YTz=s96-c',
 'USER', 'GOOGLE', '109234567890123456781',
 NULL,
 TRUE,
 NOW() - INTERVAL '75 days', NOW() - INTERVAL '3 days'),

('pham.thu.huong@gmail.com',
 'Phạm Thị Thu Hương',
 'https://lh3.googleusercontent.com/a/ACg8ocJb_B2uHoOod5dQZ0kU2NyRoIp1MqB7Yw3XMeR0ZUz=s96-c',
 'USER', 'GOOGLE', '109234567890123456782',
 NULL,
 TRUE,
 NOW() - INTERVAL '60 days', NOW() - INTERVAL '4 days'),

-- Regular users — LOCAL (password: User@GaTre2024)
('le.duc.cuong@gmail.com',
 'Lê Đức Cường',
 NULL,
 'USER', 'LOCAL', NULL,
 '$2a$10$GTvRDBWelZ7HUs/EZuWfreegwfTuryaWc3LV5t42DbMI1jCgcTPSC',
 TRUE,
 NOW() - INTERVAL '45 days', NOW() - INTERVAL '7 days'),

('hoang.thi.lan@gmail.com',
 'Hoàng Thị Lan',
 'https://lh3.googleusercontent.com/a/ACg8ocJc_C3vIpPpe6eRZ1kV3OzSpJq2NrC8Zx4YNfS1aVz=s96-c',
 'USER', 'GOOGLE', '109234567890123456784',
 NULL,
 TRUE,
 NOW() - INTERVAL '30 days', NOW() - INTERVAL '1 day'),

('tran.van.binh@gmail.com',
 'Trần Văn Bình',
 NULL,
 'USER', 'LOCAL', NULL,
 '$2a$10$GTvRDBWelZ7HUs/EZuWfreegwfTuryaWc3LV5t42DbMI1jCgcTPSC',
 TRUE,
 NOW() - INTERVAL '22 days', NOW() - INTERVAL '2 days'),

-- Inactive user (to test admin UI)
('vu.tien.khanh@gmail.com',
 'Vũ Tiến Khánh',
 'https://lh3.googleusercontent.com/a/ACg8ocJd_D4wJqQqf7fSZ2kW4PaSqKr3OsD9ay5ZOgT2bWz=s96-c',
 'USER', 'GOOGLE', '109234567890123456786',
 NULL,
 FALSE,
 NOW() - INTERVAL '18 days', NOW() - INTERVAL '18 days');


-- ─────────────────────────────────────────────────────────────────────────────
-- CATEGORIES
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO categories (name, slug, description, created_at, updated_at) VALUES

('Gà Tre Lông Đỏ',
 'ga-tre-long-do',
 'Dòng gà tre nổi bật với bộ lông đỏ tươi hoặc đỏ tía đặc trưng. Được ưa chuộng bởi màu sắc rực rỡ và vẻ oai phong.',
 NOW() - INTERVAL '100 days', NOW() - INTERVAL '100 days'),

('Gà Tre Lông Trắng',
 'ga-tre-long-trang',
 'Giống gà tre lông trắng tinh khiết, thường được dùng làm cảnh hoặc nhân giống. Có nhiều sắc thái từ trắng tuyết đến trắng ngà.',
 NOW() - INTERVAL '100 days', NOW() - INTERVAL '100 days'),

('Gà Tre Lông Vàng',
 'ga-tre-long-vang',
 'Dòng gà tre lông vàng óng ánh hiếm và quý. Được nhiều người chơi gà cảnh săn đón nhờ vẻ đẹp sang trọng.',
 NOW() - INTERVAL '100 days', NOW() - INTERVAL '100 days'),

('Gà Tre Lông Đen',
 'ga-tre-long-den',
 'Gà tre lông đen tuyền hoặc đen ánh xanh. Dòng gà được đánh giá cao về thể lực và vẻ bí ẩn cuốn hút.',
 NOW() - INTERVAL '100 days', NOW() - INTERVAL '100 days'),

('Gà Tre Thuần Chủng',
 'ga-tre-thuan-chung',
 'Các dòng gà tre thuần chủng cao cấp từ các vùng nổi tiếng như Cao Lãnh, Bình Định, Bến Tre. Phù hợp cho nhân giống và sưu tập.',
 NOW() - INTERVAL '100 days', NOW() - INTERVAL '100 days'),

('Gà Tre Dáng Thế',
 'ga-tre-dang-the',
 'Gà tre được tuyển chọn kỹ lưỡng theo tiêu chí dáng thế: đứng thẳng, cân đối, oai vệ. Thích hợp trưng bày và thi triển lãm.',
 NOW() - INTERVAL '100 days', NOW() - INTERVAL '100 days');


-- ─────────────────────────────────────────────────────────────────────────────
-- PRODUCTS
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Gà Tre Lông Đỏ ──────────────────────────────────────────────────────────
INSERT INTO products
    (category_id, created_by, name, slug, description,
     price_from, price_to, feather_color, weight_grams, age_months, status,
     created_at, updated_at)
VALUES
(
  (SELECT id FROM categories WHERE slug = 'ga-tre-long-do'),
  (SELECT id FROM users WHERE email = 'admin@gatre.vn'),
  'Gà Tre Đỏ Tía Nam Định',
  'ga-tre-do-tia-nam-dinh',
  'Con trống đỏ tía dòng Nam Định chính gốc, thuần chủng 100%. Nuôi 12 tháng tuổi, trọng lượng 620g. Bộ lông đỏ tía rực rỡ, đuôi dài cân đối, cựa nhanh nhạy. Gà khỏe mạnh, ăn tốt, thích hợp nuôi cảnh hoặc nhân giống. Có thể xem tận nơi tại TP.HCM.',
  2500000, 3200000, 'Đỏ tía', 620, 12, 'AVAILABLE',
  NOW() - INTERVAL '55 days', NOW() - INTERVAL '2 days'
),
(
  (SELECT id FROM categories WHERE slug = 'ga-tre-long-do'),
  (SELECT id FROM users WHERE email = 'admin@gatre.vn'),
  'Gà Tre Đỏ Cựa Sắc',
  'ga-tre-do-cua-sac',
  'Con trống đỏ tươi 18 tháng tuổi nổi bật với đôi cựa sắc bén tự nhiên. Trọng lượng 580g, thể hình chắc chắn cân đối. Dòng gà nuôi thuần từ nhỏ, tính hiền, dễ chăm sóc. Phù hợp nuôi trưng bày hoặc thi triển lãm gà cảnh.',
  3000000, 4500000, 'Đỏ tươi', 580, 18, 'AVAILABLE',
  NOW() - INTERVAL '48 days', NOW() - INTERVAL '3 days'
),
(
  (SELECT id FROM categories WHERE slug = 'ga-tre-long-do'),
  (SELECT id FROM users WHERE email = 'admin@gatre.vn'),
  'Gà Tre Đỏ Thuần Nam',
  'ga-tre-do-thuan-nam',
  'Gà tre đỏ nhạt 8 tháng tuổi đang trong giai đoạn phát triển đẹp nhất. Trọng lượng 540g, lông đỏ mượt đều. Xuất xứ miền Nam, dòng máu ổn định qua nhiều thế hệ.',
  1800000, 2500000, 'Đỏ nhạt', 540, 8, 'SOLD',
  NOW() - INTERVAL '62 days', NOW() - INTERVAL '10 days'
),

-- ── Gà Tre Lông Trắng ───────────────────────────────────────────────────────
(
  (SELECT id FROM categories WHERE slug = 'ga-tre-long-trang'),
  (SELECT id FROM users WHERE email = 'admin@gatre.vn'),
  'Gà Tre Trắng Tuyết',
  'ga-tre-trang-tuyet',
  'Con mái lông trắng tuyết hiếm gặp, 10 tháng tuổi. Trọng lượng 480g, lông trắng đều không tạp sắc. Dáng thon gọn, linh hoạt. Thích hợp nuôi cặp cùng trống để nhân giống dòng trắng thuần.',
  1500000, 2000000, 'Trắng tuyết', 480, 10, 'AVAILABLE',
  NOW() - INTERVAL '40 days', NOW() - INTERVAL '1 day'
),
(
  (SELECT id FROM categories WHERE slug = 'ga-tre-long-trang'),
  (SELECT id FROM users WHERE email = 'admin@gatre.vn'),
  'Gà Tre Trắng Ngọc Châu',
  'ga-tre-trang-ngoc-chau',
  'Con trống trắng ngà đặc biệt 14 tháng tuổi, nổi bật với bộ lông óng ánh như ngọc. Trọng lượng 520g. Đây là dòng trắng ngà hiếm, được nhiều người chơi gà cảnh săn tìm. Kèm giấy nguồn gốc xuất xứ.',
  2200000, 3000000, 'Trắng ngà', 520, 14, 'AVAILABLE',
  NOW() - INTERVAL '35 days', NOW() - INTERVAL '2 days'
),
(
  (SELECT id FROM categories WHERE slug = 'ga-tre-long-trang'),
  (SELECT id FROM users WHERE email = 'admin@gatre.vn'),
  'Gà Tre Trắng Dáng Tiên',
  'ga-tre-trang-dang-tien',
  'Gà mái trắng sữa 6 tháng tuổi, còn non nhưng dáng thế rất đẹp. Trọng lượng 390g. Nuôi thêm vài tháng sẽ lên dáng hoàn chỉnh. Thích hợp cho người mới chơi muốn nuôi từ nhỏ.',
  1200000, 1800000, 'Trắng sữa', 390, 6, 'AVAILABLE',
  NOW() - INTERVAL '28 days', NOW() - INTERVAL '3 days'
),

-- ── Gà Tre Lông Vàng ────────────────────────────────────────────────────────
(
  (SELECT id FROM categories WHERE slug = 'ga-tre-long-vang'),
  (SELECT id FROM users WHERE email = 'admin@gatre.vn'),
  'Gà Tre Vàng Kim',
  'ga-tre-vang-kim',
  'Con trống vàng kim quý hiếm, 20 tháng tuổi — đỉnh cao vẻ đẹp. Trọng lượng 650g, bộ lông vàng óng ánh dưới nắng như vàng ròng. Dáng oai vệ, đầu cao, mào đỏ thắm. Xuất xứ Long An, dòng thuần chủng được gìn giữ qua nhiều thế hệ. Hiếm có khó tìm.',
  4000000, 6000000, 'Vàng kim', 650, 20, 'AVAILABLE',
  NOW() - INTERVAL '50 days', NOW() - INTERVAL '1 day'
),
(
  (SELECT id FROM categories WHERE slug = 'ga-tre-long-vang'),
  (SELECT id FROM users WHERE email = 'admin@gatre.vn'),
  'Gà Tre Vàng Óng',
  'ga-tre-vang-ong',
  'Trống vàng óng 15 tháng tuổi, lông vàng đậm đều đặn từ cổ đến đuôi. Trọng lượng 560g. Dáng thể chắc khỏe, phong thái tự tin. Phù hợp nuôi trưng hoặc ghép cặp nhân giống dòng vàng.',
  2800000, 4000000, 'Vàng óng', 560, 15, 'AVAILABLE',
  NOW() - INTERVAL '38 days', NOW() - INTERVAL '4 days'
),
(
  (SELECT id FROM categories WHERE slug = 'ga-tre-long-vang'),
  (SELECT id FROM users WHERE email = 'admin@gatre.vn'),
  'Gà Tre Vàng Nhạt',
  'ga-tre-vang-nhat',
  'Cặp gà tre vàng nhạt 7 tháng tuổi (1 trống 1 mái). Trọng lượng trống 430g, mái 350g. Còn nhỏ nhưng giống đẹp, tiềm năng phát triển tốt. Bán cặp, không bán lẻ.',
  1500000, 2000000, 'Vàng nhạt', 430, 7, 'SOLD',
  NOW() - INTERVAL '55 days', NOW() - INTERVAL '12 days'
),

-- ── Gà Tre Lông Đen ─────────────────────────────────────────────────────────
(
  (SELECT id FROM categories WHERE slug = 'ga-tre-long-den'),
  (SELECT id FROM users WHERE email = 'admin@gatre.vn'),
  'Gà Tre Đen Tuyền Hội An',
  'ga-tre-den-tuyen-hoi-an',
  'Con trống đen tuyền chính gốc Hội An, 16 tháng tuổi. Trọng lượng 600g. Lông đen tuyền bóng mượt không tạp sắc, ánh xanh nhẹ khi ra nắng. Dòng gà đen Hội An nổi tiếng về thể lực và vẻ đẹp huyền bí. Rất hiếm gặp trên thị trường.',
  3500000, 5000000, 'Đen tuyền', 600, 16, 'AVAILABLE',
  NOW() - INTERVAL '43 days', NOW() - INTERVAL '2 days'
),
(
  (SELECT id FROM categories WHERE slug = 'ga-tre-long-den'),
  (SELECT id FROM users WHERE email = 'admin@gatre.vn'),
  'Gà Tre Đen Ánh Xanh',
  'ga-tre-den-anh-xanh',
  'Trống đen ánh xanh lam đặc biệt, 12 tháng tuổi. Trọng lượng 570g. Dưới ánh sáng tự nhiên bộ lông ánh lên màu xanh thép rất lạ mắt. Đây là đặc điểm di truyền quý hiếm trong dòng gà tre đen.',
  3000000, 4000000, 'Đen ánh xanh', 570, 12, 'AVAILABLE',
  NOW() - INTERVAL '32 days', NOW() - INTERVAL '3 days'
),
(
  (SELECT id FROM categories WHERE slug = 'ga-tre-long-den'),
  (SELECT id FROM users WHERE email = 'admin@gatre.vn'),
  'Gà Tre Đen Lông Mềm',
  'ga-tre-den-long-mem',
  'Gà mái đen lông mềm mịn 4 tháng tuổi — gà con dễ thương. Trọng lượng 350g. Tính tình hiền lành, dễ thuần dưỡng. Thích hợp cho người mới bắt đầu chơi gà tre hoặc nuôi cảnh.',
  900000, 1400000, 'Đen mượt', 350, 4, 'AVAILABLE',
  NOW() - INTERVAL '20 days', NOW() - INTERVAL '1 day'
),

-- ── Gà Tre Thuần Chủng ──────────────────────────────────────────────────────
(
  (SELECT id FROM categories WHERE slug = 'ga-tre-thuan-chung'),
  (SELECT id FROM users WHERE email = 'admin@gatre.vn'),
  'Gà Tre Thuần Chủng Cao Lãnh',
  'ga-tre-thuan-chung-cao-lanh',
  'Con trống thuần chủng Cao Lãnh (Đồng Tháp), 24 tháng tuổi — trưởng thành hoàn toàn. Trọng lượng 700g, là con đầu đàn. Dòng gà Cao Lãnh nổi tiếng khắp Nam Bộ về sự bền bỉ và di truyền ổn định. Có đầy đủ hồ sơ nguồn gốc giống 3 đời. Cơ hội sở hữu một cá thể xuất sắc.',
  6000000, 8000000, 'Đỏ tía', 700, 24, 'AVAILABLE',
  NOW() - INTERVAL '58 days', NOW() - INTERVAL '1 day'
),
(
  (SELECT id FROM categories WHERE slug = 'ga-tre-thuan-chung'),
  (SELECT id FROM users WHERE email = 'admin@gatre.vn'),
  'Gà Tre Thuần Chủng Bình Định',
  'ga-tre-thuan-chung-binh-dinh',
  'Dòng thuần chủng Bình Định nổi tiếng miền Trung, 22 tháng tuổi. Trọng lượng 680g. Lông vàng đỏ hài hòa, thể hình vuông vắn cân đối. Giống này được nuôi giữ bởi các gia đình nuôi gà lâu đời tại Bình Định.',
  5500000, 7500000, 'Vàng đỏ', 680, 22, 'AVAILABLE',
  NOW() - INTERVAL '51 days', NOW() - INTERVAL '2 days'
),
(
  (SELECT id FROM categories WHERE slug = 'ga-tre-thuan-chung'),
  (SELECT id FROM users WHERE email = 'admin@gatre.vn'),
  'Gà Tre Thuần Chủng Bến Tre',
  'ga-tre-thuan-chung-ben-tre',
  'Cặp thuần chủng Bến Tre (1 trống 1 mái) 18 tháng tuổi. Trọng lượng trống 660g. Lông vàng kim đặc trưng dòng Bến Tre. Bán cặp để nhân giống — đây là cơ hội lý tưởng để bắt đầu giữ dòng thuần chủng chất lượng cao.',
  4500000, 6500000, 'Vàng kim', 660, 18, 'AVAILABLE',
  NOW() - INTERVAL '44 days', NOW() - INTERVAL '3 days'
),
(
  (SELECT id FROM categories WHERE slug = 'ga-tre-thuan-chung'),
  (SELECT id FROM users WHERE email = 'admin@gatre.vn'),
  'Gà Tre Thuần Chủng Tiền Giang',
  'ga-tre-thuan-chung-tien-giang',
  'Giống thuần chủng Tiền Giang đỉnh cao, 24 tháng tuổi, đạt 720g — con lớn nhất trong lô. Lông đỏ đen pha trộn hài hòa rất đặc biệt. Đây là con dự phòng cho triển lãm quốc gia, hiện tạm ẩn để hoàn thiện hồ sơ.',
  7000000, 9500000, 'Đỏ đen', 720, 24, 'HIDDEN',
  NOW() - INTERVAL '67 days', NOW() - INTERVAL '5 days'
),

-- ── Gà Tre Dáng Thế ─────────────────────────────────────────────────────────
(
  (SELECT id FROM categories WHERE slug = 'ga-tre-dang-the'),
  (SELECT id FROM users WHERE email = 'admin@gatre.vn'),
  'Gà Tre Dáng Thế Thượng Đẳng',
  'ga-tre-dang-the-thuong-dang',
  'Con trống dáng thế thượng đẳng, 14 tháng tuổi. Trọng lượng 530g. Khi đứng: đầu cao, ngực nở, đuôi cong vút — đây là dáng thế được các chuyên gia đánh giá cao nhất. Lông đỏ tươi đều đặn. Đã tham gia triển lãm tỉnh, xếp hạng Top 5.',
  3500000, 5000000, 'Đỏ tươi', 530, 14, 'AVAILABLE',
  NOW() - INTERVAL '36 days', NOW() - INTERVAL '1 day'
),
(
  (SELECT id FROM categories WHERE slug = 'ga-tre-dang-the'),
  (SELECT id FROM users WHERE email = 'admin@gatre.vn'),
  'Gà Tre Dáng Thế Đứng Ngồi',
  'ga-tre-dang-the-dung-ngoi',
  'Cặp gà tre 12 tháng tuổi với dáng thế rất đặc biệt: đứng thẳng tắp như cột, cổ dài thanh tú. Trọng lượng trống 490g. Lông trắng vàng nhạt pha hài hòa. Nuôi trong môi trường yên tĩnh, rất thân thiện với người.',
  2500000, 3500000, 'Trắng vàng', 490, 12, 'AVAILABLE',
  NOW() - INTERVAL '27 days', NOW() - INTERVAL '2 days'
),
(
  (SELECT id FROM categories WHERE slug = 'ga-tre-dang-the'),
  (SELECT id FROM users WHERE email = 'admin@gatre.vn'),
  'Gà Tre Dáng Thế Chiến Thần',
  'ga-tre-dang-the-chien-than',
  'Con trống dáng thế "chiến thần" 20 tháng tuổi — oai phong bậc nhất. Trọng lượng 610g. Lông đen đỏ pha nổi bật, đuôi xoè rộng như quạt. Thể hiện rõ khí chất của dòng gà chiến đấu được lai tạo với gà cảnh để có vẻ đẹp và thần thái đặc biệt.',
  5000000, 7000000, 'Đen đỏ', 610, 20, 'AVAILABLE',
  NOW() - INTERVAL '46 days', NOW() - INTERVAL '3 days'
),
(
  (SELECT id FROM categories WHERE slug = 'ga-tre-dang-the'),
  (SELECT id FROM users WHERE email = 'admin@gatre.vn'),
  'Gà Tre Dáng Thế Hội Tụ',
  'ga-tre-dang-the-hoi-tu',
  'Bộ tứ gà tre dáng thế hoàn hảo (2 trống 2 mái) 18 tháng tuổi. Trọng lượng trống trung bình 640g. Lông vàng nâu pha đẹp mắt. Bộ tứ này được tuyển chọn kỹ từ 20 cá thể, chỉ giữ lại 4 con đẹp nhất. Bán trọn bộ hoặc thương lượng từng con.',
  4200000, 6000000, 'Vàng nâu', 640, 18, 'AVAILABLE',
  NOW() - INTERVAL '30 days', NOW() - INTERVAL '1 day'
);


-- ─────────────────────────────────────────────────────────────────────────────
-- PRODUCT MEDIA  (all URLs from Cloudinary — cloud: dgklwx7ch)
-- ─────────────────────────────────────────────────────────────────────────────

-- ga-tre-do-tia-nam-dinh
INSERT INTO product_media (product_id, media_url, media_type, is_primary, cloudinary_public_id, display_order, created_at, updated_at) VALUES
((SELECT id FROM products WHERE slug='ga-tre-do-tia-nam-dinh'), 'https://res.cloudinary.com/dgklwx7ch/image/upload/v1776617837/products/ga-tre-do-tia-nam-dinh/main.jpg', 'IMAGE', TRUE,  'products/ga-tre-do-tia-nam-dinh/main', 0, NOW() - INTERVAL '55 days', NOW() - INTERVAL '55 days'),
((SELECT id FROM products WHERE slug='ga-tre-do-tia-nam-dinh'), 'https://res.cloudinary.com/dgklwx7ch/image/upload/v1776617687/products/ga-tre-do-tia-nam-dinh/01.jpg',   'IMAGE', FALSE, 'products/ga-tre-do-tia-nam-dinh/01',   1, NOW() - INTERVAL '55 days', NOW() - INTERVAL '55 days');

-- ga-tre-do-cua-sac
INSERT INTO product_media (product_id, media_url, media_type, is_primary, cloudinary_public_id, display_order, created_at, updated_at) VALUES
((SELECT id FROM products WHERE slug='ga-tre-do-cua-sac'), 'https://res.cloudinary.com/dgklwx7ch/image/upload/v1776617689/products/ga-tre-do-cua-sac/main.jpg', 'IMAGE', TRUE,  'products/ga-tre-do-cua-sac/main', 0, NOW() - INTERVAL '48 days', NOW() - INTERVAL '48 days'),
((SELECT id FROM products WHERE slug='ga-tre-do-cua-sac'), 'https://res.cloudinary.com/dgklwx7ch/image/upload/v1776617846/products/ga-tre-do-cua-sac/01.jpg',   'IMAGE', FALSE, 'products/ga-tre-do-cua-sac/01',   1, NOW() - INTERVAL '48 days', NOW() - INTERVAL '48 days');

-- ga-tre-do-thuan-nam
INSERT INTO product_media (product_id, media_url, media_type, is_primary, cloudinary_public_id, display_order, created_at, updated_at) VALUES
((SELECT id FROM products WHERE slug='ga-tre-do-thuan-nam'), 'https://res.cloudinary.com/dgklwx7ch/image/upload/v1776617838/products/ga-tre-do-thuan-nam/main.jpg', 'IMAGE', TRUE,  'products/ga-tre-do-thuan-nam/main', 0, NOW() - INTERVAL '62 days', NOW() - INTERVAL '62 days'),
((SELECT id FROM products WHERE slug='ga-tre-do-thuan-nam'), 'https://res.cloudinary.com/dgklwx7ch/image/upload/v1776617692/products/ga-tre-do-thuan-nam/01.jpg',   'IMAGE', FALSE, 'products/ga-tre-do-thuan-nam/01',   1, NOW() - INTERVAL '62 days', NOW() - INTERVAL '62 days');

-- ga-tre-trang-tuyet
INSERT INTO product_media (product_id, media_url, media_type, is_primary, cloudinary_public_id, display_order, created_at, updated_at) VALUES
((SELECT id FROM products WHERE slug='ga-tre-trang-tuyet'), 'https://res.cloudinary.com/dgklwx7ch/image/upload/v1776617693/products/ga-tre-trang-tuyet/main.jpg', 'IMAGE', TRUE,  'products/ga-tre-trang-tuyet/main', 0, NOW() - INTERVAL '40 days', NOW() - INTERVAL '40 days'),
((SELECT id FROM products WHERE slug='ga-tre-trang-tuyet'), 'https://res.cloudinary.com/dgklwx7ch/image/upload/v1776617694/products/ga-tre-trang-tuyet/01.jpg',   'IMAGE', FALSE, 'products/ga-tre-trang-tuyet/01',   1, NOW() - INTERVAL '40 days', NOW() - INTERVAL '40 days');

-- ga-tre-trang-ngoc-chau
INSERT INTO product_media (product_id, media_url, media_type, is_primary, cloudinary_public_id, display_order, created_at, updated_at) VALUES
((SELECT id FROM products WHERE slug='ga-tre-trang-ngoc-chau'), 'https://res.cloudinary.com/dgklwx7ch/image/upload/v1776617696/products/ga-tre-trang-ngoc-chau/main.jpg', 'IMAGE', TRUE,  'products/ga-tre-trang-ngoc-chau/main', 0, NOW() - INTERVAL '35 days', NOW() - INTERVAL '35 days'),
((SELECT id FROM products WHERE slug='ga-tre-trang-ngoc-chau'), 'https://res.cloudinary.com/dgklwx7ch/image/upload/v1776617697/products/ga-tre-trang-ngoc-chau/01.jpg',   'IMAGE', FALSE, 'products/ga-tre-trang-ngoc-chau/01',   1, NOW() - INTERVAL '35 days', NOW() - INTERVAL '35 days'),
((SELECT id FROM products WHERE slug='ga-tre-trang-ngoc-chau'), 'https://res.cloudinary.com/dgklwx7ch/image/upload/v1776617699/products/ga-tre-trang-ngoc-chau/02.jpg',   'IMAGE', FALSE, 'products/ga-tre-trang-ngoc-chau/02',   2, NOW() - INTERVAL '35 days', NOW() - INTERVAL '35 days');

-- ga-tre-trang-dang-tien
INSERT INTO product_media (product_id, media_url, media_type, is_primary, cloudinary_public_id, display_order, created_at, updated_at) VALUES
((SELECT id FROM products WHERE slug='ga-tre-trang-dang-tien'), 'https://res.cloudinary.com/dgklwx7ch/image/upload/v1776617700/products/ga-tre-trang-dang-tien/main.jpg', 'IMAGE', TRUE,  'products/ga-tre-trang-dang-tien/main', 0, NOW() - INTERVAL '28 days', NOW() - INTERVAL '28 days'),
((SELECT id FROM products WHERE slug='ga-tre-trang-dang-tien'), 'https://res.cloudinary.com/dgklwx7ch/image/upload/v1776617702/products/ga-tre-trang-dang-tien/01.jpg',   'IMAGE', FALSE, 'products/ga-tre-trang-dang-tien/01',   1, NOW() - INTERVAL '28 days', NOW() - INTERVAL '28 days');

-- ga-tre-vang-kim
INSERT INTO product_media (product_id, media_url, media_type, is_primary, cloudinary_public_id, display_order, created_at, updated_at) VALUES
((SELECT id FROM products WHERE slug='ga-tre-vang-kim'), 'https://res.cloudinary.com/dgklwx7ch/image/upload/v1776617703/products/ga-tre-vang-kim/main.jpg', 'IMAGE', TRUE,  'products/ga-tre-vang-kim/main', 0, NOW() - INTERVAL '50 days', NOW() - INTERVAL '50 days'),
((SELECT id FROM products WHERE slug='ga-tre-vang-kim'), 'https://res.cloudinary.com/dgklwx7ch/image/upload/v1776617705/products/ga-tre-vang-kim/01.jpg',   'IMAGE', FALSE, 'products/ga-tre-vang-kim/01',   1, NOW() - INTERVAL '50 days', NOW() - INTERVAL '50 days'),
((SELECT id FROM products WHERE slug='ga-tre-vang-kim'), 'https://res.cloudinary.com/dgklwx7ch/image/upload/v1776617707/products/ga-tre-vang-kim/02.jpg',   'IMAGE', FALSE, 'products/ga-tre-vang-kim/02',   2, NOW() - INTERVAL '50 days', NOW() - INTERVAL '50 days');

-- ga-tre-vang-ong
INSERT INTO product_media (product_id, media_url, media_type, is_primary, cloudinary_public_id, display_order, created_at, updated_at) VALUES
((SELECT id FROM products WHERE slug='ga-tre-vang-ong'), 'https://res.cloudinary.com/dgklwx7ch/image/upload/v1776617709/products/ga-tre-vang-ong/main.jpg', 'IMAGE', TRUE,  'products/ga-tre-vang-ong/main', 0, NOW() - INTERVAL '38 days', NOW() - INTERVAL '38 days'),
((SELECT id FROM products WHERE slug='ga-tre-vang-ong'), 'https://res.cloudinary.com/dgklwx7ch/image/upload/v1776617711/products/ga-tre-vang-ong/01.jpg',   'IMAGE', FALSE, 'products/ga-tre-vang-ong/01',   1, NOW() - INTERVAL '38 days', NOW() - INTERVAL '38 days');

-- ga-tre-vang-nhat
INSERT INTO product_media (product_id, media_url, media_type, is_primary, cloudinary_public_id, display_order, created_at, updated_at) VALUES
((SELECT id FROM products WHERE slug='ga-tre-vang-nhat'), 'https://res.cloudinary.com/dgklwx7ch/image/upload/v1776617712/products/ga-tre-vang-nhat/main.jpg', 'IMAGE', TRUE,  'products/ga-tre-vang-nhat/main', 0, NOW() - INTERVAL '55 days', NOW() - INTERVAL '55 days'),
((SELECT id FROM products WHERE slug='ga-tre-vang-nhat'), 'https://res.cloudinary.com/dgklwx7ch/image/upload/v1776617714/products/ga-tre-vang-nhat/01.jpg',   'IMAGE', FALSE, 'products/ga-tre-vang-nhat/01',   1, NOW() - INTERVAL '55 days', NOW() - INTERVAL '55 days');

-- ga-tre-den-tuyen-hoi-an
INSERT INTO product_media (product_id, media_url, media_type, is_primary, cloudinary_public_id, display_order, created_at, updated_at) VALUES
((SELECT id FROM products WHERE slug='ga-tre-den-tuyen-hoi-an'), 'https://res.cloudinary.com/dgklwx7ch/image/upload/v1776617839/products/ga-tre-den-tuyen-hoi-an/main.jpg', 'IMAGE', TRUE,  'products/ga-tre-den-tuyen-hoi-an/main', 0, NOW() - INTERVAL '43 days', NOW() - INTERVAL '43 days'),
((SELECT id FROM products WHERE slug='ga-tre-den-tuyen-hoi-an'), 'https://res.cloudinary.com/dgklwx7ch/image/upload/v1776617717/products/ga-tre-den-tuyen-hoi-an/01.jpg',   'IMAGE', FALSE, 'products/ga-tre-den-tuyen-hoi-an/01',   1, NOW() - INTERVAL '43 days', NOW() - INTERVAL '43 days');

-- ga-tre-den-anh-xanh
INSERT INTO product_media (product_id, media_url, media_type, is_primary, cloudinary_public_id, display_order, created_at, updated_at) VALUES
((SELECT id FROM products WHERE slug='ga-tre-den-anh-xanh'), 'https://res.cloudinary.com/dgklwx7ch/image/upload/v1776617719/products/ga-tre-den-anh-xanh/main.jpg', 'IMAGE', TRUE,  'products/ga-tre-den-anh-xanh/main', 0, NOW() - INTERVAL '32 days', NOW() - INTERVAL '32 days'),
((SELECT id FROM products WHERE slug='ga-tre-den-anh-xanh'), 'https://res.cloudinary.com/dgklwx7ch/image/upload/v1776617848/products/ga-tre-den-anh-xanh/01.jpg',   'IMAGE', FALSE, 'products/ga-tre-den-anh-xanh/01',   1, NOW() - INTERVAL '32 days', NOW() - INTERVAL '32 days');

-- ga-tre-den-long-mem
INSERT INTO product_media (product_id, media_url, media_type, is_primary, cloudinary_public_id, display_order, created_at, updated_at) VALUES
((SELECT id FROM products WHERE slug='ga-tre-den-long-mem'), 'https://res.cloudinary.com/dgklwx7ch/image/upload/v1776617841/products/ga-tre-den-long-mem/main.jpg', 'IMAGE', TRUE,  'products/ga-tre-den-long-mem/main', 0, NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),
((SELECT id FROM products WHERE slug='ga-tre-den-long-mem'), 'https://res.cloudinary.com/dgklwx7ch/image/upload/v1776617722/products/ga-tre-den-long-mem/01.jpg',   'IMAGE', FALSE, 'products/ga-tre-den-long-mem/01',   1, NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days');

-- ga-tre-thuan-chung-cao-lanh
INSERT INTO product_media (product_id, media_url, media_type, is_primary, cloudinary_public_id, display_order, created_at, updated_at) VALUES
((SELECT id FROM products WHERE slug='ga-tre-thuan-chung-cao-lanh'), 'https://res.cloudinary.com/dgklwx7ch/image/upload/v1776617842/products/ga-tre-thuan-chung-cao-lanh/main.jpg', 'IMAGE', TRUE,  'products/ga-tre-thuan-chung-cao-lanh/main', 0, NOW() - INTERVAL '58 days', NOW() - INTERVAL '58 days'),
((SELECT id FROM products WHERE slug='ga-tre-thuan-chung-cao-lanh'), 'https://res.cloudinary.com/dgklwx7ch/image/upload/v1776617724/products/ga-tre-thuan-chung-cao-lanh/01.jpg',   'IMAGE', FALSE, 'products/ga-tre-thuan-chung-cao-lanh/01',   1, NOW() - INTERVAL '58 days', NOW() - INTERVAL '58 days'),
((SELECT id FROM products WHERE slug='ga-tre-thuan-chung-cao-lanh'), 'https://res.cloudinary.com/dgklwx7ch/image/upload/v1776617725/products/ga-tre-thuan-chung-cao-lanh/02.jpg',   'IMAGE', FALSE, 'products/ga-tre-thuan-chung-cao-lanh/02',   2, NOW() - INTERVAL '58 days', NOW() - INTERVAL '58 days');

-- ga-tre-thuan-chung-binh-dinh
INSERT INTO product_media (product_id, media_url, media_type, is_primary, cloudinary_public_id, display_order, created_at, updated_at) VALUES
((SELECT id FROM products WHERE slug='ga-tre-thuan-chung-binh-dinh'), 'https://res.cloudinary.com/dgklwx7ch/image/upload/v1776617726/products/ga-tre-thuan-chung-binh-dinh/main.jpg', 'IMAGE', TRUE,  'products/ga-tre-thuan-chung-binh-dinh/main', 0, NOW() - INTERVAL '51 days', NOW() - INTERVAL '51 days'),
((SELECT id FROM products WHERE slug='ga-tre-thuan-chung-binh-dinh'), 'https://res.cloudinary.com/dgklwx7ch/image/upload/v1776617850/products/ga-tre-thuan-chung-binh-dinh/01.jpg',   'IMAGE', FALSE, 'products/ga-tre-thuan-chung-binh-dinh/01',   1, NOW() - INTERVAL '51 days', NOW() - INTERVAL '51 days');

-- ga-tre-thuan-chung-ben-tre
INSERT INTO product_media (product_id, media_url, media_type, is_primary, cloudinary_public_id, display_order, created_at, updated_at) VALUES
((SELECT id FROM products WHERE slug='ga-tre-thuan-chung-ben-tre'), 'https://res.cloudinary.com/dgklwx7ch/image/upload/v1776617729/products/ga-tre-thuan-chung-ben-tre/main.jpg', 'IMAGE', TRUE,  'products/ga-tre-thuan-chung-ben-tre/main', 0, NOW() - INTERVAL '44 days', NOW() - INTERVAL '44 days'),
((SELECT id FROM products WHERE slug='ga-tre-thuan-chung-ben-tre'), 'https://res.cloudinary.com/dgklwx7ch/image/upload/v1776617732/products/ga-tre-thuan-chung-ben-tre/02.jpg',   'IMAGE', FALSE, 'products/ga-tre-thuan-chung-ben-tre/02',   1, NOW() - INTERVAL '44 days', NOW() - INTERVAL '44 days');

-- ga-tre-thuan-chung-tien-giang
INSERT INTO product_media (product_id, media_url, media_type, is_primary, cloudinary_public_id, display_order, created_at, updated_at) VALUES
((SELECT id FROM products WHERE slug='ga-tre-thuan-chung-tien-giang'), 'https://res.cloudinary.com/dgklwx7ch/image/upload/v1776617843/products/ga-tre-thuan-chung-tien-giang/main.jpg', 'IMAGE', TRUE,  'products/ga-tre-thuan-chung-tien-giang/main', 0, NOW() - INTERVAL '67 days', NOW() - INTERVAL '67 days'),
((SELECT id FROM products WHERE slug='ga-tre-thuan-chung-tien-giang'), 'https://res.cloudinary.com/dgklwx7ch/image/upload/v1776617734/products/ga-tre-thuan-chung-tien-giang/01.jpg',   'IMAGE', FALSE, 'products/ga-tre-thuan-chung-tien-giang/01',   1, NOW() - INTERVAL '67 days', NOW() - INTERVAL '67 days');

-- ga-tre-dang-the-thuong-dang
INSERT INTO product_media (product_id, media_url, media_type, is_primary, cloudinary_public_id, display_order, created_at, updated_at) VALUES
((SELECT id FROM products WHERE slug='ga-tre-dang-the-thuong-dang'), 'https://res.cloudinary.com/dgklwx7ch/image/upload/v1776617736/products/ga-tre-dang-the-thuong-dang/main.jpg', 'IMAGE', TRUE,  'products/ga-tre-dang-the-thuong-dang/main', 0, NOW() - INTERVAL '36 days', NOW() - INTERVAL '36 days'),
((SELECT id FROM products WHERE slug='ga-tre-dang-the-thuong-dang'), 'https://res.cloudinary.com/dgklwx7ch/image/upload/v1776617737/products/ga-tre-dang-the-thuong-dang/01.jpg',   'IMAGE', FALSE, 'products/ga-tre-dang-the-thuong-dang/01',   1, NOW() - INTERVAL '36 days', NOW() - INTERVAL '36 days');

-- ga-tre-dang-the-dung-ngoi
INSERT INTO product_media (product_id, media_url, media_type, is_primary, cloudinary_public_id, display_order, created_at, updated_at) VALUES
((SELECT id FROM products WHERE slug='ga-tre-dang-the-dung-ngoi'), 'https://res.cloudinary.com/dgklwx7ch/image/upload/v1776617738/products/ga-tre-dang-the-dung-ngoi/main.jpg', 'IMAGE', TRUE,  'products/ga-tre-dang-the-dung-ngoi/main', 0, NOW() - INTERVAL '27 days', NOW() - INTERVAL '27 days'),
((SELECT id FROM products WHERE slug='ga-tre-dang-the-dung-ngoi'), 'https://res.cloudinary.com/dgklwx7ch/image/upload/v1776617851/products/ga-tre-dang-the-dung-ngoi/01.jpg',   'IMAGE', FALSE, 'products/ga-tre-dang-the-dung-ngoi/01',   1, NOW() - INTERVAL '27 days', NOW() - INTERVAL '27 days');

-- ga-tre-dang-the-chien-than
INSERT INTO product_media (product_id, media_url, media_type, is_primary, cloudinary_public_id, display_order, created_at, updated_at) VALUES
((SELECT id FROM products WHERE slug='ga-tre-dang-the-chien-than'), 'https://res.cloudinary.com/dgklwx7ch/image/upload/v1776617845/products/ga-tre-dang-the-chien-than/main.jpg', 'IMAGE', TRUE,  'products/ga-tre-dang-the-chien-than/main', 0, NOW() - INTERVAL '46 days', NOW() - INTERVAL '46 days'),
((SELECT id FROM products WHERE slug='ga-tre-dang-the-chien-than'), 'https://res.cloudinary.com/dgklwx7ch/image/upload/v1776617742/products/ga-tre-dang-the-chien-than/02.jpg',   'IMAGE', FALSE, 'products/ga-tre-dang-the-chien-than/02',   1, NOW() - INTERVAL '46 days', NOW() - INTERVAL '46 days');

-- ga-tre-dang-the-hoi-tu
INSERT INTO product_media (product_id, media_url, media_type, is_primary, cloudinary_public_id, display_order, created_at, updated_at) VALUES
((SELECT id FROM products WHERE slug='ga-tre-dang-the-hoi-tu'), 'https://res.cloudinary.com/dgklwx7ch/image/upload/v1776617743/products/ga-tre-dang-the-hoi-tu/main.jpg', 'IMAGE', TRUE,  'products/ga-tre-dang-the-hoi-tu/main', 0, NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days'),
((SELECT id FROM products WHERE slug='ga-tre-dang-the-hoi-tu'), 'https://res.cloudinary.com/dgklwx7ch/image/upload/v1776617745/products/ga-tre-dang-the-hoi-tu/01.jpg',   'IMAGE', FALSE, 'products/ga-tre-dang-the-hoi-tu/01',   1, NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days'),
((SELECT id FROM products WHERE slug='ga-tre-dang-the-hoi-tu'), 'https://res.cloudinary.com/dgklwx7ch/image/upload/v1776617746/products/ga-tre-dang-the-hoi-tu/02.jpg',   'IMAGE', FALSE, 'products/ga-tre-dang-the-hoi-tu/02',   2, NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days');


-- ─────────────────────────────────────────────────────────────────────────────
-- CONVERSATIONS (one per user; admin is implicit)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO conversations (user_id, last_message_at, created_at, updated_at) VALUES
((SELECT id FROM users WHERE email='nguyen.minh.thanh@gmail.com'), NOW() - INTERVAL '1 day 3 hours',  NOW() - INTERVAL '25 days', NOW() - INTERVAL '1 day 3 hours'),
((SELECT id FROM users WHERE email='pham.thu.huong@gmail.com'),    NOW() - INTERVAL '2 days 1 hour',  NOW() - INTERVAL '18 days', NOW() - INTERVAL '2 days 1 hour'),
((SELECT id FROM users WHERE email='le.duc.cuong@gmail.com'),      NOW() - INTERVAL '4 hours',        NOW() - INTERVAL '10 days', NOW() - INTERVAL '4 hours'),
((SELECT id FROM users WHERE email='hoang.thi.lan@gmail.com'),     NOW() - INTERVAL '5 days 2 hours', NOW() - INTERVAL '14 days', NOW() - INTERVAL '5 days 2 hours');


-- ─────────────────────────────────────────────────────────────────────────────
-- CHAT MESSAGES
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Conversation 1: Nguyễn Minh Thành hỏi về Gà Tre Vàng Kim ────────────────
INSERT INTO chat_messages (conversation_id, sender_id, product_id, content, is_read, created_at, updated_at) VALUES

((SELECT id FROM conversations WHERE user_id=(SELECT id FROM users WHERE email='nguyen.minh.thanh@gmail.com')),
 (SELECT id FROM users WHERE email='nguyen.minh.thanh@gmail.com'),
 NULL,
 'Anh ơi cho em hỏi về con gà vàng kim đang rao ạ. Con này thuần chủng không anh? Em đang tìm giống tốt để nhân.',
 TRUE,
 NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days'),

((SELECT id FROM conversations WHERE user_id=(SELECT id FROM users WHERE email='nguyen.minh.thanh@gmail.com')),
 (SELECT id FROM users WHERE email='admin@gatre.vn'),
 NULL,
 'Dạ đúng rồi anh ơi. Con này giống thuần chủng Long An được nuôi 20 tháng, trọng lượng 650g, lông vàng óng rất đẹp. Dòng máu ổn định qua 5 thế hệ, không lai tạp.',
 TRUE,
 NOW() - INTERVAL '25 days' + INTERVAL '15 minutes', NOW() - INTERVAL '25 days' + INTERVAL '15 minutes'),

((SELECT id FROM conversations WHERE user_id=(SELECT id FROM users WHERE email='nguyen.minh.thanh@gmail.com')),
 (SELECT id FROM users WHERE email='nguyen.minh.thanh@gmail.com'),
 (SELECT id FROM products WHERE slug='ga-tre-vang-kim'),
 'Anh xem con này đây ạ. Đây có phải con em đang hỏi không? Giá bao nhiêu vậy anh?',
 TRUE,
 NOW() - INTERVAL '24 days 22 hours', NOW() - INTERVAL '24 days 22 hours'),

((SELECT id FROM conversations WHERE user_id=(SELECT id FROM users WHERE email='nguyen.minh.thanh@gmail.com')),
 (SELECT id FROM users WHERE email='admin@gatre.vn'),
 NULL,
 'Đúng con đó rồi anh. Về giá thì mình thương lượng được, tùy số lượng và yêu cầu. Anh có thể cho em số điện thoại để trao đổi chi tiết hơn không? Em có thể gửi thêm video cho anh xem.',
 TRUE,
 NOW() - INTERVAL '24 days 21 hours', NOW() - INTERVAL '24 days 21 hours'),

((SELECT id FROM conversations WHERE user_id=(SELECT id FROM users WHERE email='nguyen.minh.thanh@gmail.com')),
 (SELECT id FROM users WHERE email='nguyen.minh.thanh@gmail.com'),
 NULL,
 'Số em là 0912 345 678 anh nhé. Em ở Bình Dương, anh có ship không? Và có mái cùng dòng để ghép cặp không anh?',
 TRUE,
 NOW() - INTERVAL '24 days 20 hours', NOW() - INTERVAL '24 days 20 hours'),

((SELECT id FROM conversations WHERE user_id=(SELECT id FROM users WHERE email='nguyen.minh.thanh@gmail.com')),
 (SELECT id FROM users WHERE email='admin@gatre.vn'),
 (SELECT id FROM products WHERE slug='ga-tre-thuan-chung-ben-tre'),
 'Dạ bên em có ship Bình Dương, phí 150k anh ơi. Và đây là cặp mái cùng dòng đang có, anh tham khảo thêm ạ.',
 TRUE,
 NOW() - INTERVAL '24 days 19 hours', NOW() - INTERVAL '24 days 19 hours'),

((SELECT id FROM conversations WHERE user_id=(SELECT id FROM users WHERE email='nguyen.minh.thanh@gmail.com')),
 (SELECT id FROM users WHERE email='nguyen.minh.thanh@gmail.com'),
 NULL,
 'OK anh, em sẽ gọi lại vào chiều mai để chốt. Cảm ơn anh nhiều!',
 FALSE,
 NOW() - INTERVAL '1 day 3 hours', NOW() - INTERVAL '1 day 3 hours'),

-- ── Conversation 2: Phạm Thị Thu Hương hỏi về giá gà đỏ ─────────────────────
((SELECT id FROM conversations WHERE user_id=(SELECT id FROM users WHERE email='pham.thu.huong@gmail.com')),
 (SELECT id FROM users WHERE email='pham.thu.huong@gmail.com'),
 NULL,
 'Anh ơi con gà đỏ tía Nam Định giá bao nhiêu vậy ạ? Chị thấy đẹp lắm muốn mua làm cảnh.',
 TRUE,
 NOW() - INTERVAL '18 days', NOW() - INTERVAL '18 days'),

((SELECT id FROM conversations WHERE user_id=(SELECT id FROM users WHERE email='pham.thu.huong@gmail.com')),
 (SELECT id FROM users WHERE email='admin@gatre.vn'),
 NULL,
 'Dạ chào chị, con đó đẹp lắm ạ. Về giá thì tùy thuộc vào hình thức và yêu cầu chị mình thương lượng được. Chị có muốn em gửi thêm ảnh và video không ạ?',
 TRUE,
 NOW() - INTERVAL '17 days 23 hours', NOW() - INTERVAL '17 days 23 hours'),

((SELECT id FROM conversations WHERE user_id=(SELECT id FROM users WHERE email='pham.thu.huong@gmail.com')),
 (SELECT id FROM users WHERE email='pham.thu.huong@gmail.com'),
 (SELECT id FROM products WHERE slug='ga-tre-do-tia-nam-dinh'),
 'Anh xem con này đây nhé. Em muốn mua con này. Chị ở Đà Nẵng có ship ra được không anh?',
 TRUE,
 NOW() - INTERVAL '17 days 22 hours', NOW() - INTERVAL '17 days 22 hours'),

((SELECT id FROM conversations WHERE user_id=(SELECT id FROM users WHERE email='pham.thu.huong@gmail.com')),
 (SELECT id FROM users WHERE email='admin@gatre.vn'),
 NULL,
 'Dạ được chị ơi, bên em có kinh nghiệm vận chuyển toàn quốc. Gà được đóng gói cẩn thận, đảm bảo sức khỏe khi đến nơi. Phí ship ra Đà Nẵng khoảng 200-250k tùy hãng vận chuyển chị chọn.',
 TRUE,
 NOW() - INTERVAL '17 days 21 hours', NOW() - INTERVAL '17 days 21 hours'),

((SELECT id FROM conversations WHERE user_id=(SELECT id FROM users WHERE email='pham.thu.huong@gmail.com')),
 (SELECT id FROM users WHERE email='pham.thu.huong@gmail.com'),
 NULL,
 'OK anh, vậy cho chị đặt cọc trước 500k được không? Khi nào ship thì thanh toán phần còn lại.',
 FALSE,
 NOW() - INTERVAL '2 days 1 hour', NOW() - INTERVAL '2 days 1 hour'),

-- ── Conversation 3: Lê Đức Cường hỏi thuần chủng để nhân giống ──────────────
((SELECT id FROM conversations WHERE user_id=(SELECT id FROM users WHERE email='le.duc.cuong@gmail.com')),
 (SELECT id FROM users WHERE email='le.duc.cuong@gmail.com'),
 NULL,
 'Anh ơi em muốn mua cặp gà thuần chủng để nhân giống, có bán cặp không ạ? Em cần cả trống lẫn mái cùng dòng máu.',
 TRUE,
 NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),

((SELECT id FROM conversations WHERE user_id=(SELECT id FROM users WHERE email='le.duc.cuong@gmail.com')),
 (SELECT id FROM users WHERE email='admin@gatre.vn'),
 NULL,
 'Dạ có anh ơi. Bên em đang có cặp thuần chủng Cao Lãnh và Bến Tre đều có cả trống lẫn mái. Anh muốn xem dòng nào trước ạ?',
 TRUE,
 NOW() - INTERVAL '9 days 23 hours', NOW() - INTERVAL '9 days 23 hours'),

((SELECT id FROM conversations WHERE user_id=(SELECT id FROM users WHERE email='le.duc.cuong@gmail.com')),
 (SELECT id FROM users WHERE email='le.duc.cuong@gmail.com'),
 (SELECT id FROM products WHERE slug='ga-tre-thuan-chung-cao-lanh'),
 'Anh gửi con này xem, con Cao Lãnh này đã 24 tháng rồi. Có mái cùng dòng không anh? Tốt nhất là cùng bố mẹ.',
 TRUE,
 NOW() - INTERVAL '9 days 20 hours', NOW() - INTERVAL '9 days 20 hours'),

((SELECT id FROM conversations WHERE user_id=(SELECT id FROM users WHERE email='le.duc.cuong@gmail.com')),
 (SELECT id FROM users WHERE email='admin@gatre.vn'),
 NULL,
 'Dạ con trống Cao Lãnh đó đang có. Mái cùng bố mẹ thì em cần kiểm tra lại anh ơi, vì có thể đã bán. Nhưng em có mái cùng dòng máu Cao Lãnh khác, chất lượng tương đương. Anh có muốn xem ảnh mái không ạ?',
 TRUE,
 NOW() - INTERVAL '9 days 18 hours', NOW() - INTERVAL '9 days 18 hours'),

((SELECT id FROM conversations WHERE user_id=(SELECT id FROM users WHERE email='le.duc.cuong@gmail.com')),
 (SELECT id FROM users WHERE email='le.duc.cuong@gmail.com'),
 NULL,
 'OK anh gửi thêm ảnh mái đi. Nếu đẹp em lấy luôn cặp, trả tiền mặt khi nhận.',
 FALSE,
 NOW() - INTERVAL '4 hours', NOW() - INTERVAL '4 hours'),

-- ── Conversation 4: Hoàng Thị Lan hỏi gà con ────────────────────────────────
((SELECT id FROM conversations WHERE user_id=(SELECT id FROM users WHERE email='hoang.thi.lan@gmail.com')),
 (SELECT id FROM users WHERE email='hoang.thi.lan@gmail.com'),
 NULL,
 'Shop bán gà con không ạ? Chị muốn nuôi từ nhỏ cho quen tay, lần đầu chơi gà tre nên chưa biết nhiều.',
 TRUE,
 NOW() - INTERVAL '14 days', NOW() - INTERVAL '14 days'),

((SELECT id FROM conversations WHERE user_id=(SELECT id FROM users WHERE email='hoang.thi.lan@gmail.com')),
 (SELECT id FROM users WHERE email='admin@gatre.vn'),
 NULL,
 'Dạ chào chị, bên em có gà từ 4 tháng tuổi trở lên ạ. Lần đầu nuôi em khuyên chị nên lấy con từ 4-6 tháng, dễ chăm hơn gà sơ sinh mà vẫn còn nhỏ để thuần hoá.',
 TRUE,
 NOW() - INTERVAL '13 days 23 hours', NOW() - INTERVAL '13 days 23 hours'),

((SELECT id FROM conversations WHERE user_id=(SELECT id FROM users WHERE email='hoang.thi.lan@gmail.com')),
 (SELECT id FROM users WHERE email='admin@gatre.vn'),
 (SELECT id FROM products WHERE slug='ga-tre-den-long-mem'),
 'Hiện tại có con này đang rất phù hợp cho người mới chị ơi — mái đen 4 tháng, tính hiền, lông mềm mịn. Chị xem thử ạ!',
 TRUE,
 NOW() - INTERVAL '13 days 22 hours', NOW() - INTERVAL '13 days 22 hours'),

((SELECT id FROM conversations WHERE user_id=(SELECT id FROM users WHERE email='hoang.thi.lan@gmail.com')),
 (SELECT id FROM users WHERE email='hoang.thi.lan@gmail.com'),
 NULL,
 'Ồ dễ thương quá anh ơi! Nuôi trong chung cư được không? Chị sợ nó kêu to hàng xóm phàn nàn.',
 TRUE,
 NOW() - INTERVAL '13 days 20 hours', NOW() - INTERVAL '13 days 20 hours'),

((SELECT id FROM conversations WHERE user_id=(SELECT id FROM users WHERE email='hoang.thi.lan@gmail.com')),
 (SELECT id FROM users WHERE email='admin@gatre.vn'),
 NULL,
 'Dạ gà mái thì không gáy chị ơi, chỉ có trống mới gáy thôi. Mái chỉ kêu cục cục nhẹ thôi, nuôi chung cư hoàn toàn được ạ. Chị muốn lấy con này không?',
 TRUE,
 NOW() - INTERVAL '13 days 18 hours', NOW() - INTERVAL '13 days 18 hours'),

((SELECT id FROM conversations WHERE user_id=(SELECT id FROM users WHERE email='hoang.thi.lan@gmail.com')),
 (SELECT id FROM users WHERE email='hoang.thi.lan@gmail.com'),
 NULL,
 'Vậy chị lấy rồi. Anh cho chị địa chỉ để chị đến xem trực tiếp trước rồi mới chốt nhé. Chị ở Q.7 TP.HCM.',
 FALSE,
 NOW() - INTERVAL '5 days 2 hours', NOW() - INTERVAL '5 days 2 hours');

