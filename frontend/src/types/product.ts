export type ProductStatus = 'AVAILABLE' | 'SOLD' | 'HIDDEN'

export interface PublicCategory {
  id: number
  name: string
  slug: string
  description: string | null
}

export interface AdminCategory {
  id: number
  name: string
  slug: string
  description: string | null
  createdAt: string
  updatedAt: string
  productCount: number
}

export interface ProductMedia {
  id: number
  mediaUrl: string
  mediaType: 'IMAGE' | 'VIDEO'
  primary: boolean
  displayOrder: number
}

export interface AdminProductMedia extends ProductMedia {
  cloudinaryPublicId: string
}

/**
 * Public product — price fields intentionally absent.
 * Never add priceFrom / priceTo here.
 */
export interface PublicProduct {
  id: number
  productCode: string | null
  name: string
  slug: string
  description: string | null
  featherColor: string | null
  weightGrams: number | null
  ageMonths: number | null
  vaccinationStatus: string | null
  characterTraits: string | null
  status: ProductStatus
  category: PublicCategory
  primaryMediaUrl: string | null
  media: ProductMedia[] | null
  viewCount: number
}

/**
 * Admin product — includes price fields.
 * MUST NOT be used in any public-facing component.
 */
export interface AdminProduct {
  id: number
  productCode: string | null
  name: string
  slug: string
  description: string | null
  priceFrom: number | null   // ADMIN ONLY
  priceTo: number | null     // ADMIN ONLY
  featherColor: string | null
  weightGrams: number | null
  ageMonths: number | null
  vaccinationStatus: string | null
  characterTraits: string | null
  status: ProductStatus
  category: PublicCategory
  primaryMediaUrl: string | null
  media: AdminProductMedia[] | null
  viewCount: number
  createdAt: string
  updatedAt: string
}