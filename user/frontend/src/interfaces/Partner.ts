export interface PartnerProfile {
  name: string;
  surname: string;
  storeName: string;
  isVerified: boolean;
  vat: string;
  doy: string;
  email: string;
  emailVerified: boolean;
  phone: string;
  siteUrl: string;
  siteUrlVerified: boolean;
  imageUrl: string | null | undefined;
  pendingImageUrl: string | null | undefined;
}

export interface PartnerBrief {
  storeName: string;
  siteUrl: string | null;
  image: string | undefined | null;
}
