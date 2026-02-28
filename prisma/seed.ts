import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const sampleProducts = [
  {
    name: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with active noise cancellation, 30-hour battery life, and premium sound quality. Perfect for music lovers and professionals.',
    price: 299.99,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    stock: 50,
  },
  {
    name: 'Smart Watch Pro',
    description: 'Advanced smartwatch with health monitoring, GPS tracking, and seamless smartphone integration. Water-resistant and stylish design.',
    price: 399.99,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
    stock: 30,
  },
  {
    name: 'Ergonomic Office Chair',
    description: 'Premium ergonomic office chair with lumbar support, adjustable armrests, and breathable mesh back. Designed for all-day comfort.',
    price: 549.99,
    imageUrl: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500&h=500&fit=crop',
    stock: 25,
  },
  {
    name: 'Mechanical Keyboard RGB',
    description: 'Professional mechanical keyboard with customizable RGB lighting, Cherry MX switches, and programmable macros. Built for gamers and typists.',
    price: 159.99,
    imageUrl: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&h=500&fit=crop',
    stock: 75,
  },
  {
    name: 'Ultra-Wide Monitor 34"',
    description: 'Stunning 34-inch ultrawide curved monitor with 4K resolution, HDR support, and 144Hz refresh rate. Perfect for productivity and gaming.',
    price: 799.99,
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=500&fit=crop',
    stock: 15,
  },
  {
    name: 'Portable Bluetooth Speaker',
    description: 'Compact and powerful Bluetooth speaker with 360-degree sound, waterproof design, and 20-hour battery life. Take your music anywhere.',
    price: 79.99,
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop',
    stock: 100,
  },
  {
    name: 'Professional Camera Backpack',
    description: 'Durable camera backpack with customizable compartments, weather-resistant material, and laptop sleeve. Ideal for photographers on the go.',
    price: 129.99,
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
    stock: 40,
  },
  {
    name: 'Wireless Charging Pad',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices. Sleek design with LED indicator and overcharge protection.',
    price: 39.99,
    imageUrl: 'https://images.unsplash.com/photo-1591815302525-756a9bcc3425?w=500&h=500&fit=crop',
    stock: 150,
  },
  {
    name: 'Standing Desk Converter',
    description: 'Transform any desk into a standing desk with this adjustable converter. Features smooth height adjustment and spacious workspace.',
    price: 279.99,
    imageUrl: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500&h=500&fit=crop',
    stock: 20,
  },
  {
    name: 'Noise-Canceling Earbuds',
    description: 'True wireless earbuds with active noise cancellation, transparency mode, and premium sound. Comfortable fit for all-day wear.',
    price: 199.99,
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=500&fit=crop',
    stock: 60,
  },
  {
    name: 'Smart Home Hub',
    description: 'Central smart home hub that connects and controls all your smart devices. Voice assistant compatible with easy setup.',
    price: 149.99,
    imageUrl: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=500&h=500&fit=crop',
    stock: 35,
  },
  {
    name: 'Premium Laptop Stand',
    description: 'Aluminum laptop stand with adjustable height and angle. Improves ergonomics and cooling for your laptop.',
    price: 69.99,
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop',
    stock: 80,
  },
  {
    name: 'Webcam 4K Pro',
    description: 'Professional 4K webcam with auto-focus, low-light correction, and built-in microphone. Perfect for video calls and streaming.',
    price: 179.99,
    imageUrl: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=500&h=500&fit=crop',
    stock: 45,
  },
  {
    name: 'USB-C Docking Station',
    description: 'Universal USB-C docking station with multiple ports including HDMI, USB-A, Ethernet, and SD card reader. One cable connection.',
    price: 199.99,
    imageUrl: 'https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=500&h=500&fit=crop',
    stock: 55,
  },
  {
    name: 'Gaming Mouse Wireless',
    description: 'High-precision wireless gaming mouse with customizable DPI, programmable buttons, and RGB lighting. Ultra-low latency.',
    price: 89.99,
    imageUrl: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=500&fit=crop',
    stock: 90,
  },
  {
    name: 'Desk Organizer Set',
    description: 'Modern desk organizer set with pen holder, phone stand, and cable management. Keep your workspace clean and organized.',
    price: 49.99,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop',
    stock: 120,
  },
  {
    name: 'LED Desk Lamp Smart',
    description: 'Smart LED desk lamp with adjustable brightness and color temperature. App-controlled with schedule and timer features.',
    price: 79.99,
    imageUrl: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=500&h=500&fit=crop',
    stock: 70,
  },
  {
    name: 'External SSD 1TB',
    description: 'Portable external SSD with 1TB capacity and lightning-fast transfer speeds. Compact, durable, and shock-resistant.',
    price: 129.99,
    imageUrl: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&h=500&fit=crop',
    stock: 65,
  },
  {
    name: 'Tablet Stand Adjustable',
    description: 'Heavy-duty tablet stand with 360-degree rotation and adjustable height. Compatible with all tablet sizes.',
    price: 44.99,
    imageUrl: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&h=500&fit=crop',
    stock: 85,
  },
  {
    name: 'Premium Mouse Pad XL',
    description: 'Extra-large premium mouse pad with smooth surface, non-slip base, and stitched edges. Perfect for gaming and work.',
    price: 29.99,
    imageUrl: 'https://images.unsplash.com/photo-1616353071855-2c045c4458ae?w=500&h=500&fit=crop',
    stock: 200,
  },
];

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clean existing data
  console.log('🧹 Cleaning existing data...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  console.log('👤 Creating admin user...');
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@test.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log(`✅ Admin created: ${admin.email}`);

  // Create sample user
  console.log('👤 Creating sample user...');
  const userPassword = await bcrypt.hash('user123', 12);
  
  const user = await prisma.user.create({
    data: {
      name: 'Test User',
      email: 'user@test.com',
      password: userPassword,
      role: 'USER',
    },
  });
  console.log(`✅ User created: ${user.email}`);

  // Create products
  console.log('📦 Creating products...');
  for (const product of sampleProducts) {
    await prisma.product.create({
      data: product,
    });
  }
  console.log(`✅ Created ${sampleProducts.length} products`);

  console.log('');
  console.log('🎉 Seeding completed successfully!');
  console.log('');
  console.log('📝 Test Accounts:');
  console.log('   Admin: admin@test.com / admin123');
  console.log('   User:  user@test.com / user123');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
