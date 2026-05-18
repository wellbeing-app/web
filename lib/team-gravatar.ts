import 'server-only';

import { createHash } from 'node:crypto';
import type {
  TeamGravatarApiError,
  TeamGravatarContactInfo,
  TeamGravatarCryptoWalletAddress,
  TeamGravatarGalleryImage,
  TeamGravatarInterest,
  TeamGravatarLanguage,
  TeamGravatarLink,
  TeamGravatarPayments,
  TeamGravatarApiResponse,
  TeamGravatarProfile,
  TeamGravatarSectionVisibility,
  TeamGravatarVerifiedAccount,
} from '@/lib/team-gravatar-types';

const GRAVATAR_API_BASE_URL = 'https://api.gravatar.com/v3';
const GRAVATAR_AVATAR_SIZE = 256;

const teamMemberEmails = {
  anna: 'anna.zezulka@proton.me',
} as const;

interface GravatarProfileResponse {
  user_id?: unknown;
  user_login?: unknown;
  hash?: unknown;
  first_name?: unknown;
  last_name?: unknown;
  display_name?: unknown;
  profile_url?: unknown;
  avatar_url?: unknown;
  avatar_alt_text?: unknown;
  location?: unknown;
  description?: unknown;
  job_title?: unknown;
  company?: unknown;
  pronunciation?: unknown;
  pronouns?: unknown;
  timezone?: unknown;
  is_organization?: unknown;
  header_image?: unknown;
  background_color?: unknown;
  hide_default_header_image?: unknown;
  links?: unknown;
  interests?: unknown;
  payments?: unknown;
  contact_info?: unknown;
  languages?: unknown;
  verified_accounts?: unknown;
  gallery?: unknown;
  number_verified_accounts?: unknown;
  last_profile_edit?: unknown;
  registration_date?: unknown;
  section_visibility?: unknown;
}

class GravatarProfileError extends Error {
  constructor(
    message: string,
    readonly id: string,
    readonly status?: number
  ) {
    super(message);
    this.name = 'GravatarProfileError';
  }
}

export function createGravatarHash(email: string) {
  return createHash('sha256').update(email.trim().toLowerCase()).digest('hex');
}

function decodeHtmlEntities(value: string) {
  const entities: Record<string, string> = {
    amp: '&',
    apos: "'",
    gt: '>',
    lt: '<',
    quot: '"',
  };

  return value.replace(/&(#\d+|#x[\da-f]+|amp|apos|gt|lt|quot);/gi, (match, entity: string) => {
    if (entity[0] === '#') {
      const codePoint =
        entity[1]?.toLowerCase() === 'x'
          ? Number.parseInt(entity.slice(2), 16)
          : Number.parseInt(entity.slice(1), 10);
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : match;
    }

    return entities[entity.toLowerCase()] ?? match;
  });
}

function stringValue(value: unknown) {
  if (typeof value !== 'string') return undefined;
  const text = decodeHtmlEntities(value).trim();
  return text.length > 0 ? text : undefined;
}

function booleanValue(value: unknown) {
  return typeof value === 'boolean' ? value : undefined;
}

function numberValue(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function objectValue(value: unknown) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function arrayValue(value: unknown) {
  return Array.isArray(value) ? value : [];
}

function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

function httpUrlValue(value: unknown) {
  const rawUrl = stringValue(value);
  if (!rawUrl) return undefined;

  try {
    const url = new URL(rawUrl);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return undefined;
    url.hash = '';
    return url.toString();
  } catch {
    return undefined;
  }
}

function gravatarAvatarUrl(hash: string) {
  return `https://0.gravatar.com/avatar/${hash}?s=${GRAVATAR_AVATAR_SIZE}`;
}

function sanitizeGravatarAvatarUrl(value: unknown, fallbackHash: string) {
  const rawUrl = stringValue(value);
  if (!rawUrl) return gravatarAvatarUrl(fallbackHash);

  try {
    const url = new URL(rawUrl);
    if (
      url.protocol !== 'https:' ||
      !url.hostname.endsWith('.gravatar.com') ||
      !url.pathname.startsWith('/avatar/')
    ) {
      return gravatarAvatarUrl(fallbackHash);
    }

    url.search = `?s=${GRAVATAR_AVATAR_SIZE}`;
    url.hash = '';
    return url.toString();
  } catch {
    return gravatarAvatarUrl(fallbackHash);
  }
}

function getLinks(value: unknown): TeamGravatarLink[] {
  return arrayValue(value)
    .map((item): TeamGravatarLink | undefined => {
      const link = objectValue(item);
      if (!link) return undefined;
      const url = httpUrlValue(link.url);
      if (!url) return undefined;
      const label = stringValue(link.label);
      return {
        ...(label ? { label } : {}),
        url,
      };
    })
    .filter(isDefined);
}

function getInterests(value: unknown): TeamGravatarInterest[] {
  return arrayValue(value)
    .map((item): TeamGravatarInterest | undefined => {
      const interest = objectValue(item);
      const name = interest ? stringValue(interest.name) : undefined;
      if (!interest || !name) return undefined;
      const id = stringValue(interest.id);
      const slug = stringValue(interest.slug);
      return {
        ...(id ? { id } : {}),
        name,
        ...(slug ? { slug } : {}),
      };
    })
    .filter(isDefined);
}

function getLanguages(value: unknown): TeamGravatarLanguage[] {
  return arrayValue(value)
    .map((item): TeamGravatarLanguage | undefined => {
      const language = objectValue(item);
      const name = language ? stringValue(language.name) : undefined;
      if (!language || !name) return undefined;
      const code = stringValue(language.code);
      const isPrimary = booleanValue(language.is_primary);
      const order = numberValue(language.order);
      return {
        ...(code ? { code } : {}),
        name,
        ...(typeof isPrimary === 'boolean' ? { isPrimary } : {}),
        ...(typeof order === 'number' ? { order } : {}),
      };
    })
    .filter(isDefined)
    .sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER));
}

function getVerifiedAccounts(value: unknown): TeamGravatarVerifiedAccount[] {
  return arrayValue(value)
    .map((item): TeamGravatarVerifiedAccount | undefined => {
      const account = objectValue(item);
      if (!account) return undefined;
      const serviceLabel = stringValue(account.service_label);
      const url = httpUrlValue(account.url);
      if (!serviceLabel && !url) return undefined;
      const serviceType = stringValue(account.service_type);
      const serviceIcon = httpUrlValue(account.service_icon);
      const isHidden = booleanValue(account.is_hidden);
      return {
        ...(serviceType ? { serviceType } : {}),
        ...(serviceLabel ? { serviceLabel } : {}),
        ...(serviceIcon ? { serviceIcon } : {}),
        ...(url ? { url } : {}),
        ...(typeof isHidden === 'boolean' ? { isHidden } : {}),
      };
    })
    .filter(isDefined);
}

function getGallery(value: unknown): TeamGravatarGalleryImage[] {
  return arrayValue(value)
    .map((item): TeamGravatarGalleryImage | undefined => {
      const image = objectValue(item);
      const url = image ? httpUrlValue(image.url) : undefined;
      if (!image || !url) return undefined;
      const altText = stringValue(image.alt_text);
      return {
        url,
        ...(altText ? { altText } : {}),
      };
    })
    .filter(isDefined);
}

function getCryptoWallets(value: unknown): TeamGravatarCryptoWalletAddress[] {
  return arrayValue(value)
    .map((item): TeamGravatarCryptoWalletAddress | undefined => {
      const wallet = objectValue(item);
      if (!wallet) return undefined;
      const label = stringValue(wallet.label);
      const address = stringValue(wallet.address);
      if (!label || !address) return undefined;
      return { label, address };
    })
    .filter(isDefined);
}

function getPayments(value: unknown): TeamGravatarPayments | undefined {
  const payments = objectValue(value);
  if (!payments) return undefined;

  const links = getLinks(payments.links);
  const cryptoWallets = getCryptoWallets(payments.crypto_wallets);
  if (links.length === 0 && cryptoWallets.length === 0) return undefined;

  return { links, cryptoWallets };
}

function getContactInfo(value: unknown): TeamGravatarContactInfo | undefined {
  const contactInfo = objectValue(value);
  if (!contactInfo) return undefined;

  const homePhone = stringValue(contactInfo.home_phone);
  const workPhone = stringValue(contactInfo.work_phone);
  const cellPhone = stringValue(contactInfo.cell_phone);
  const email = stringValue(contactInfo.email);
  const contactForm = httpUrlValue(contactInfo.contact_form);
  const calendar = httpUrlValue(contactInfo.calendar);

  if (!homePhone && !workPhone && !cellPhone && !email && !contactForm && !calendar) {
    return undefined;
  }

  return {
    ...(homePhone ? { homePhone } : {}),
    ...(workPhone ? { workPhone } : {}),
    ...(cellPhone ? { cellPhone } : {}),
    ...(email ? { email } : {}),
    ...(contactForm ? { contactForm } : {}),
    ...(calendar ? { calendar } : {}),
  };
}

function getSectionVisibility(value: unknown): TeamGravatarSectionVisibility | undefined {
  const visibility = objectValue(value);
  if (!visibility) return undefined;

  const sectionVisibility: TeamGravatarSectionVisibility = {};
  const fieldMap: Array<[keyof TeamGravatarSectionVisibility, string]> = [
    ['hiddenContactInfo', 'hidden_contact_info'],
    ['hiddenFeeds', 'hidden_feeds'],
    ['hiddenLinks', 'hidden_links'],
    ['hiddenInterests', 'hidden_interests'],
    ['hiddenWallet', 'hidden_wallet'],
    ['hiddenPhotos', 'hidden_photos'],
    ['hiddenVerifiedAccounts', 'hidden_verified_accounts'],
  ];

  for (const [targetKey, sourceKey] of fieldMap) {
    const value = booleanValue(visibility[sourceKey]);
    if (typeof value === 'boolean') sectionVisibility[targetKey] = value;
  }

  return Object.keys(sectionVisibility).length > 0 ? sectionVisibility : undefined;
}

async function fetchTeamMemberProfile(
  id: keyof typeof teamMemberEmails,
  email: string,
  apiKey: string
): Promise<TeamGravatarProfile | null> {
  const hash = createGravatarHash(email);
  const response = await fetch(`${GRAVATAR_API_BASE_URL}/profiles/${hash}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    next: { revalidate: 60 * 60 * 6 },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new GravatarProfileError(
      `Gravatar returned ${response.status} for ${id}`,
      id,
      response.status
    );
  }

  const profile = (await response.json()) as GravatarProfileResponse;
  const resolvedHash = stringValue(profile.hash) ?? hash;

  return {
    id,
    userId: numberValue(profile.user_id),
    userLogin: stringValue(profile.user_login),
    hash: resolvedHash,
    firstName: stringValue(profile.first_name),
    lastName: stringValue(profile.last_name),
    displayName: stringValue(profile.display_name),
    profileUrl: stringValue(profile.profile_url),
    avatarUrl: sanitizeGravatarAvatarUrl(profile.avatar_url, resolvedHash),
    avatarAltText: stringValue(profile.avatar_alt_text),
    location: stringValue(profile.location),
    description: stringValue(profile.description),
    jobTitle: stringValue(profile.job_title),
    company: stringValue(profile.company),
    pronunciation: stringValue(profile.pronunciation),
    pronouns: stringValue(profile.pronouns),
    timezone: stringValue(profile.timezone),
    isOrganization: booleanValue(profile.is_organization),
    headerImage: httpUrlValue(profile.header_image),
    backgroundColor: stringValue(profile.background_color),
    hideDefaultHeaderImage: booleanValue(profile.hide_default_header_image),
    links: getLinks(profile.links),
    interests: getInterests(profile.interests),
    languages: getLanguages(profile.languages),
    verifiedAccounts: getVerifiedAccounts(profile.verified_accounts),
    gallery: getGallery(profile.gallery),
    payments: getPayments(profile.payments),
    contactInfo: getContactInfo(profile.contact_info),
    numberVerifiedAccounts: numberValue(profile.number_verified_accounts),
    lastProfileEdit: stringValue(profile.last_profile_edit),
    registrationDate: stringValue(profile.registration_date),
    sectionVisibility: getSectionVisibility(profile.section_visibility),
  };
}

export async function getTeamGravatarProfiles(
  apiKey: string
): Promise<TeamGravatarApiResponse> {
  const entries = Object.entries(teamMemberEmails) as Array<
    [keyof typeof teamMemberEmails, string]
  >;

  const results = await Promise.allSettled(
    entries.map(([id, email]) => fetchTeamMemberProfile(id, email, apiKey))
  );

  const profiles: Record<string, TeamGravatarProfile> = {};
  const errors: TeamGravatarApiError[] = [];

  results.forEach((result, index) => {
    const id = entries[index][0];
    if (result.status === 'fulfilled') {
      if (result.value) profiles[id] = result.value;
      else errors.push({ id, status: 404, message: 'Gravatar profile not found' });
      return;
    }

    const reason = result.reason;
    errors.push({
      id,
      status: reason instanceof GravatarProfileError ? reason.status : undefined,
      message: reason instanceof Error ? reason.message : 'Gravatar profile lookup failed',
    });
  });

  return errors.length > 0 ? { profiles, errors } : { profiles };
}
