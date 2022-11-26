export interface PartnerBrief {
  id: string;
  name: string;
  surname: string;
  storeName: string;
  image: string | undefined | null;
}

export interface PartnerDetails {
  id: string;
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
}
