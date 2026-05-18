export interface TeamGravatarLink {
  label?: string;
  url: string;
}

export interface TeamGravatarInterest {
  id?: string;
  name: string;
  slug?: string;
}

export interface TeamGravatarLanguage {
  code?: string;
  name: string;
  isPrimary?: boolean;
  order?: number;
}

export interface TeamGravatarVerifiedAccount {
  serviceType?: string;
  serviceLabel?: string;
  serviceIcon?: string;
  url?: string;
  isHidden?: boolean;
}

export interface TeamGravatarGalleryImage {
  url: string;
  altText?: string;
}

export interface TeamGravatarCryptoWalletAddress {
  label: string;
  address: string;
}

export interface TeamGravatarPayments {
  links: TeamGravatarLink[];
  cryptoWallets: TeamGravatarCryptoWalletAddress[];
}

export interface TeamGravatarContactInfo {
  homePhone?: string;
  workPhone?: string;
  cellPhone?: string;
  email?: string;
  contactForm?: string;
  calendar?: string;
}

export interface TeamGravatarSectionVisibility {
  hiddenContactInfo?: boolean;
  hiddenFeeds?: boolean;
  hiddenLinks?: boolean;
  hiddenInterests?: boolean;
  hiddenWallet?: boolean;
  hiddenPhotos?: boolean;
  hiddenVerifiedAccounts?: boolean;
}

export interface TeamGravatarProfile {
  id: string;
  userId?: number;
  userLogin?: string;
  hash: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatarUrl?: string;
  avatarAltText?: string;
  profileUrl?: string;
  location?: string;
  description?: string;
  jobTitle?: string;
  company?: string;
  pronunciation?: string;
  pronouns?: string;
  timezone?: string;
  isOrganization?: boolean;
  headerImage?: string;
  backgroundColor?: string;
  hideDefaultHeaderImage?: boolean;
  links: TeamGravatarLink[];
  interests: TeamGravatarInterest[];
  languages: TeamGravatarLanguage[];
  verifiedAccounts: TeamGravatarVerifiedAccount[];
  gallery: TeamGravatarGalleryImage[];
  payments?: TeamGravatarPayments;
  contactInfo?: TeamGravatarContactInfo;
  numberVerifiedAccounts?: number;
  lastProfileEdit?: string;
  registrationDate?: string;
  sectionVisibility?: TeamGravatarSectionVisibility;
}

export interface TeamGravatarApiError {
  id: string;
  status?: number;
  message: string;
}

export interface TeamGravatarApiResponse {
  profiles: Record<string, TeamGravatarProfile>;
  errors?: TeamGravatarApiError[];
}
