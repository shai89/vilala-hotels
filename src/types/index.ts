export interface ImageObject {
  url: string;
  alt: string;
  is_cover: boolean;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface BedConfiguration {
  double_beds: number;
  single_beds: number;
  sofa_beds: number;
}

export interface SearchFilters {
  location?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  priceMin?: number;
  priceMax?: number;
  amenities?: string[];
  region?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: 'price_asc' | 'price_desc' | 'rating' | 'newest';
}

export interface ApiResponse<T> {
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string;
}

export interface Cabin {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  address?: string | null;
  city: string | null;
  region: string | null;
  coordinates?: Coordinates | null;
  amenities: string[];
  images: ImageObject[];
  rules?: string | null;
  checkInTime: string | null;
  checkOutTime: string | null;
  status?: string;
  featured: boolean;
  rating: number;
  maxGuests: number;
  rooms?: {
    id: string;
    name: string;
    description?: string | null;
    maxGuests: number;
    pricePerNight: number;
    weekendPrice?: number | null;
    holidayPrice?: number | null;
    amenities: string[];
    images?: ImageObject[];
    isAvailable?: boolean;
    minimumStay?: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featuredImage: string | null;
  published: boolean;
  publishedAt: string | null;
  tags: string[];
  author?: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface CabinWithRooms extends Cabin {
  owner: {
    id: string;
    businessName: string | null;
    contactPhone: string | null;
    contactEmail: string;
  };
  reviews: {
    id: string;
    rating: number;
    title: string | null;
    content: string | null;
    guestName: string;
    stayDate: Date;
    isApproved: boolean;
  }[];
  _count: {
    reviews: number;
  };
  avgRating: number;
}