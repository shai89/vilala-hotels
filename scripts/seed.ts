import { PrismaClient } from '../src/generated/prisma';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

const prisma = new PrismaClient();

interface OwnerCSV {
  business_name: string;
  contact_phone: string;
  contact_email: string;
  address: string;
  city: string;
  region: string;
  description: string;
  website: string;
  is_verified: string;
  profile_image: string;
  id: string;
  created_date: string;
  updated_date: string;
  created_by_id: string;
  created_by: string;
  is_sample: string;
}

interface CabinCSV {
  name: string;
  slug: string;
  description: string;
  owner_id: string;
  address: string;
  city: string;
  region: string;
  coordinates: string;
  amenities: string;
  images: string;
  rules: string;
  check_in_time: string;
  check_out_time: string;
  status: string;
  priority: string;
  seo_title: string;
  seo_description: string;
  featured: string;
  id: string;
  created_date: string;
  updated_date: string;
  created_by_id: string;
  created_by: string;
  is_sample: string;
}

interface RoomCSV {
  name: string;
  cabin_id: string;
  description: string;
  size_sqm: string;
  max_guests: string;
  price_per_night: string;
  weekend_price: string;
  holiday_price: string;
  bed_configuration: string;
  amenities: string;
  images: string;
  is_available: string;
  minimum_stay: string;
  id: string;
  created_date: string;
  updated_date: string;
  created_by_id: string;
  created_by: string;
  is_sample: string;
}

interface BlogPostCSV {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string;
  author_id: string;
  author_name: string;
  category: string;
  tags: string;
  status: string;
  published_date: string;
  seo_title: string;
  seo_description: string;
  reading_time: string;
  view_count: string;
  id: string;
  created_date: string;
  updated_date: string;
  created_by_id: string;
  created_by: string;
  is_sample: string;
}

function parseJsonSafely(str: string): any {
  try {
    if (!str || str === 'null' || str === 'undefined') return null;
    return JSON.parse(str);
  } catch {
    return null;
  }
}

function readCSV<T>(filePath: string): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const results: T[] = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

async function seedOwners() {
  console.log('🌱 Seeding owners...');
  
  const ownersData = await readCSV<OwnerCSV>(
    path.join(__dirname, '../../mock/db/Owner_export.csv')
  );

  for (const owner of ownersData) {
    await prisma.owner.upsert({
      where: { id: owner.id },
      update: {},
      create: {
        id: owner.id,
        businessName: owner.business_name,
        contactPhone: owner.contact_phone || null,
        contactEmail: owner.contact_email,
        address: owner.address || null,
        city: owner.city,
        region: owner.region,
        description: owner.description || null,
        website: owner.website === 'null' ? null : owner.website,
        isVerified: owner.is_verified === 'true',
        profileImage: owner.profile_image === 'null' ? null : owner.profile_image,
        createdDate: new Date(owner.created_date),
        updatedDate: new Date(owner.updated_date),
        createdById: owner.created_by_id,
        createdBy: owner.created_by,
        isSample: owner.is_sample === 'true'
      }
    });
  }

  console.log(`✅ Seeded ${ownersData.length} owners`);
}

async function seedCabins() {
  console.log('🌱 Seeding cabins...');
  
  const cabinsData = await readCSV<CabinCSV>(
    path.join(__dirname, '../../mock/db/Cabin_export.csv')
  );

  // Get all owners to map owner_id
  const owners = await prisma.owner.findMany();
  const ownerMapping: { [key: string]: string } = {};
  owners.forEach((owner, index) => {
    ownerMapping[(index + 1).toString()] = owner.id;
  });

  for (const cabin of cabinsData) {
    const coordinates = parseJsonSafely(cabin.coordinates);
    const amenities = parseJsonSafely(cabin.amenities) || [];
    const images = parseJsonSafely(cabin.images) || [];

    // Map owner_id to actual owner ID
    const actualOwnerId = ownerMapping[cabin.owner_id] || owners[0]?.id;
    
    if (!actualOwnerId) {
      console.log(`⚠️  Skipping cabin ${cabin.name} - no owner found`);
      continue;
    }

    await prisma.cabin.upsert({
      where: { id: cabin.id },
      update: {},
      create: {
        id: cabin.id,
        name: cabin.name,
        slug: cabin.slug,
        description: cabin.description || null,
        ownerId: actualOwnerId,
        address: cabin.address || null,
        city: cabin.city,
        region: cabin.region,
        coordinates: coordinates,
        amenities: JSON.stringify(amenities),
        images: JSON.stringify(images),
        rules: cabin.rules || null,
        checkInTime: cabin.check_in_time,
        checkOutTime: cabin.check_out_time,
        status: cabin.status,
        priority: parseInt(cabin.priority) || 0,
        seoTitle: cabin.seo_title === 'null' ? null : cabin.seo_title,
        seoDescription: cabin.seo_description === 'null' ? null : cabin.seo_description,
        featured: cabin.featured === 'true',
        createdDate: new Date(cabin.created_date),
        updatedDate: new Date(cabin.updated_date),
        createdById: cabin.created_by_id,
        createdBy: cabin.created_by,
        isSample: cabin.is_sample === 'true'
      }
    });
  }

  console.log(`✅ Seeded ${cabinsData.length} cabins`);
}

async function seedRooms() {
  console.log('🌱 Seeding rooms...');
  
  const roomsData = await readCSV<RoomCSV>(
    path.join(__dirname, '../../mock/db/Room_export.csv')
  );

  // Get all cabins to map cabin_id
  const cabins = await prisma.cabin.findMany();
  const cabinMapping: { [key: string]: string } = {};
  cabins.forEach((cabin, index) => {
    cabinMapping[(index + 1).toString()] = cabin.id;
  });

  for (const room of roomsData) {
    const bedConfiguration = parseJsonSafely(room.bed_configuration) || {};
    const amenities = parseJsonSafely(room.amenities) || [];
    const images = parseJsonSafely(room.images) || [];

    // Map cabin_id to actual cabin ID
    const actualCabinId = cabinMapping[room.cabin_id] || cabins[0]?.id;
    
    if (!actualCabinId) {
      console.log(`⚠️  Skipping room ${room.name} - no cabin found`);
      continue;
    }

    await prisma.room.upsert({
      where: { id: room.id },
      update: {},
      create: {
        id: room.id,
        name: room.name,
        cabinId: actualCabinId,
        description: room.description || null,
        sizeSqm: parseInt(room.size_sqm) || 0,
        maxGuests: parseInt(room.max_guests) || 1,
        pricePerNight: parseFloat(room.price_per_night) || 0,
        weekendPrice: parseFloat(room.weekend_price) || 0,
        holidayPrice: parseFloat(room.holiday_price) || 0,
        bedConfiguration: bedConfiguration,
        amenities: JSON.stringify(amenities),
        images: JSON.stringify(images),
        isAvailable: room.is_available === 'true',
        minimumStay: parseInt(room.minimum_stay) || 1,
        createdDate: new Date(room.created_date),
        updatedDate: new Date(room.updated_date),
        createdById: room.created_by_id,
        createdBy: room.created_by,
        isSample: room.is_sample === 'true'
      }
    });
  }

  console.log(`✅ Seeded ${roomsData.length} rooms`);
}

async function seedBlogPosts() {
  console.log('🌱 Seeding blog posts...');
  
  // Get or create admin user for articles
  const adminUser = await prisma.user.upsert({
    where: { email: 'shaiabbizi@gmail.com' },
    update: {},
    create: {
      email: 'shaiabbizi@gmail.com',
      name: 'Shai Abbizi',
      role: 'admin'
    }
  });
  
  const blogData = await readCSV<BlogPostCSV>(
    path.join(__dirname, '../../mock/db/BlogPost_export.csv')
  );

  for (const post of blogData) {
    const tags = parseJsonSafely(post.tags) || [];

    await prisma.article.upsert({
      where: { id: post.id },
      update: {},
      create: {
        id: post.id,
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt || null,
        featuredImage: post.featured_image || null,
        authorId: adminUser.id, // Use actual admin user ID
        tags: JSON.stringify(tags),
        published: post.status === 'published',
        publishedAt: post.published_date ? new Date(post.published_date) : null,
        createdAt: new Date(post.created_date),
        updatedAt: new Date(post.updated_date)
      }
    });
  }

  console.log(`✅ Seeded ${blogData.length} blog posts`);
}

async function seedAppSettings() {
  console.log('🌱 Seeding app settings...');
  
  const settings = [
    { key: 'site_name', value: 'Vilala', description: 'Site name' },
    { key: 'site_description', value: 'פלטפורמת צימרים מובילה בישראל', description: 'Site description' },
    { key: 'contact_email', value: 'info@vilala.co.il', description: 'Contact email' },
    { key: 'contact_phone', value: '050-1234567', description: 'Contact phone' },
    { key: 'hero_title', value: 'ברוכים הבאים לוילה', description: 'Hero section title' },
    { key: 'hero_subtitle', value: 'מצאו את הצימר המושלם לחופשה הבאה שלכם', description: 'Hero section subtitle' }
  ];

  for (const setting of settings) {
    await prisma.appSettings.upsert({
      where: { key: setting.key },
      update: {},
      create: {
        key: setting.key,
        value: setting.value,
        description: setting.description
      }
    });
  }

  console.log('✅ Seeded app settings');
}

async function main() {
  try {
    console.log('🚀 Starting database seeding...');

    // Clear existing data
    console.log('🧹 Cleaning existing data...');
    await prisma.room.deleteMany();
    await prisma.cabin.deleteMany();
    await prisma.owner.deleteMany();
    await prisma.article.deleteMany();
    await prisma.appSettings.deleteMany();

    // Seed in order (owners first, then cabins, then rooms)
    await seedOwners();
    await seedCabins();
    await seedRooms();
    await seedBlogPosts();
    await seedAppSettings();

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });