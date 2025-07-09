import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

interface OwnerData {
  id: string;
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
  created_date: string;
  updated_date: string;
  created_by_id: string;
  created_by: string;
  is_sample: string;
}

interface CabinData {
  id: string;
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
  created_date: string;
  updated_date: string;
  created_by_id: string;
  created_by: string;
  is_sample: string;
}

interface RoomData {
  id: string;
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
  created_date: string;
  updated_date: string;
  created_by_id: string;
  created_by: string;
  is_sample: string;
}

interface BlogPostData {
  id: string;
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
    const fullPath = path.join(process.cwd(), filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.warn(`CSV file not found: ${fullPath}`);
      resolve([]);
      return;
    }

    fs.createReadStream(fullPath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => {
        console.error(`Error reading CSV file ${fullPath}:`, error);
        reject(error);
      });
  });
}

export async function getCabinsFromCSV() {
  const cabinsData = await readCSV<CabinData>('mock/db/Cabin_export.csv');
  const roomsData = await readCSV<RoomData>('mock/db/Room_export.csv');
  const ownersData = await readCSV<OwnerData>('mock/db/Owner_export.csv');

  return cabinsData.map(cabin => {
    const coordinates = parseJsonSafely(cabin.coordinates);
    const amenities = parseJsonSafely(cabin.amenities) || [];
    const images = parseJsonSafely(cabin.images) || [];
    const owner = ownersData.find(o => o.id === cabin.owner_id);
    const rooms = roomsData.filter(room => room.cabin_id === cabin.id).map(room => ({
      id: room.id,
      name: room.name,
      pricePerNight: parseFloat(room.price_per_night) || 0,
      maxGuests: parseInt(room.max_guests) || 1,
      sizeSqm: parseInt(room.size_sqm) || 0,
      amenities: parseJsonSafely(room.amenities) || [],
      images: parseJsonSafely(room.images) || []
    }));

    return {
      id: cabin.id,
      name: cabin.name,
      slug: cabin.slug,
      description: cabin.description,
      city: cabin.city,
      region: cabin.region,
      coordinates,
      amenities,
      images,
      checkInTime: cabin.check_in_time,
      checkOutTime: cabin.check_out_time,
      status: cabin.status,
      priority: parseInt(cabin.priority) || 0,
      featured: cabin.featured === 'true',
      owner: owner ? {
        firstName: owner.business_name.split(' ')[0] || 'בעל הצימר',
        lastName: owner.business_name.split(' ').slice(1).join(' ') || '',
        businessName: owner.business_name,
        email: owner.contact_email,
        phone: owner.contact_phone
      } : null,
      rooms,
      _count: {
        reviews: 0
      },
      reviews: []
    };
  });
}

export async function getBlogPostsFromCSV() {
  const blogData = await readCSV<BlogPostData>('mock/db/BlogPost_export.csv');

  return blogData.map(post => {
    const tags = parseJsonSafely(post.tags) || [];

    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      featuredImage: post.featured_image,
      authorName: post.author_name,
      category: post.category,
      tags,
      status: post.status,
      publishedDate: post.published_date,
      readingTime: parseInt(post.reading_time) || 5,
      viewCount: parseInt(post.view_count) || 0
    };
  });
}

export async function getCabinBySlug(slug: string) {
  const cabins = await getCabinsFromCSV();
  return cabins.find(cabin => cabin.slug === slug);
}

export async function getBlogPostBySlug(slug: string) {
  const posts = await getBlogPostsFromCSV();
  return posts.find(post => post.slug === slug);
}