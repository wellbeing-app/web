'use client';

import React, { useState, useCallback } from 'react';
import {
  BadgeCheck,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ExternalLink,
  Languages,
  Link as LinkIcon,
  MapPin,
  type LucideIcon,
  UserRound,
} from 'lucide-react';
import { useDictionary } from '@/components/providers/dictionary-provider';
import { OrgChart } from '@/components/org-chart';
import type { Dictionary } from '@/lib/dictionary';
import { team, flattenPeople } from '@/lib/team';
import { useTeamGravatarProfiles } from '@/lib/use-team-gravatar-profiles';
import type { TeamGravatarProfile } from '@/lib/team-gravatar-types';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

type TeamProfileLabels = Dictionary['team']['profile'];

function getProfileName(fallbackName: string, profile?: TeamGravatarProfile) {
  const fullName = [profile?.firstName, profile?.lastName].filter(Boolean).join(' ');
  return profile?.displayName ?? (fullName || fallbackName);
}

function getLanguages(profile: TeamGravatarProfile) {
  return profile.languages
    .map((language) => language.name)
    .filter(Boolean)
    .join(', ');
}

function getProfileDates(profile: TeamGravatarProfile, labels: TeamProfileLabels) {
  const formatDate = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return [
    profile.registrationDate
      ? `${labels.registered} ${formatDate(profile.registrationDate)}`
      : undefined,
    profile.lastProfileEdit ? `${labels.updated} ${formatDate(profile.lastProfileEdit)}` : undefined,
  ].filter(Boolean);
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value?: string;
}) {
  if (!value) return null;

  return (
    <div className="flex items-start gap-2 text-xs text-muted-foreground @lg/card:text-sm">
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-(--warmth-600)" aria-hidden />
      <dt className="sr-only">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function LinkedChip({
  href,
  children,
}: {
  href?: string;
  children: React.ReactNode;
}) {
  const className =
    'inline-flex max-w-full items-center gap-1 rounded-full border border-border/60 bg-secondary/30 px-2.5 py-1 text-xs leading-none text-secondary-foreground/85';

  if (!href) {
    return <span className={className}>{children}</span>;
  }

  const isExternal = href.startsWith('http://') || href.startsWith('https://');

  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className={className}
    >
      <span className="truncate">{children}</span>
      {isExternal && <ExternalLink className="h-3 w-3 shrink-0" aria-hidden />}
    </a>
  );
}

function ProfileChipGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-[0.68rem] font-semibold uppercase text-muted-foreground">{label}</p>
      <div className="flex flex-wrap justify-start gap-1.5">{children}</div>
    </div>
  );
}

function GravatarProfileDetails({
  labels,
  profile,
  showProfileLink = true,
}: {
  labels: TeamProfileLabels;
  profile: TeamGravatarProfile;
  showProfileLink?: boolean;
}) {
  const workLine = [profile.jobTitle, profile.company].filter(Boolean).join(' · ');
  const languageLine = getLanguages(profile);
  const dateItems = getProfileDates(profile, labels);

  return (
    <div className="w-full space-y-3 text-left">
      {profile.description && (
        <p className="text-pretty text-xs leading-relaxed text-muted-foreground @lg/card:text-sm">
          {profile.description}
        </p>
      )}

      <dl className="grid gap-1.5 text-left">
        <InfoRow icon={Briefcase} label={labels.work} value={workLine} />
        <InfoRow icon={MapPin} label={labels.location} value={profile.location} />
        <InfoRow icon={UserRound} label={labels.pronunciation} value={profile.pronunciation} />
        <InfoRow icon={UserRound} label={labels.pronouns} value={profile.pronouns} />
        <InfoRow icon={Languages} label={labels.languages} value={languageLine} />
        <InfoRow icon={Clock3} label={labels.timezone} value={profile.timezone} />
      </dl>

      {profile.verifiedAccounts.length > 0 && (
        <ProfileChipGroup label={labels.verified}>
          {profile.verifiedAccounts.map((account, index) => (
            <LinkedChip
              key={`${account.serviceType ?? account.serviceLabel ?? index}-${index}`}
              href={account.url}
            >
              <BadgeCheck className="h-3 w-3 shrink-0" aria-hidden />
              {account.serviceLabel ?? account.serviceType ?? account.url}
            </LinkedChip>
          ))}
        </ProfileChipGroup>
      )}

      {profile.links.length > 0 && (
        <ProfileChipGroup label={labels.links}>
          {profile.links.map((link) => (
            <LinkedChip key={link.url} href={link.url}>
              <LinkIcon className="h-3 w-3 shrink-0" aria-hidden />
              {link.label ?? link.url}
            </LinkedChip>
          ))}
        </ProfileChipGroup>
      )}

      {profile.interests.length > 0 && (
        <ProfileChipGroup label={labels.interests}>
          {profile.interests.map((interest) => (
            <LinkedChip key={interest.slug ?? interest.id ?? interest.name}>{interest.name}</LinkedChip>
          ))}
        </ProfileChipGroup>
      )}

      {profile.gallery.length > 0 && (
        <ProfileChipGroup label={labels.gallery}>
          {profile.gallery.map((image, index) => (
            <LinkedChip key={image.url} href={image.url}>
              {image.altText ?? `Image ${index + 1}`}
            </LinkedChip>
          ))}
        </ProfileChipGroup>
      )}

      {profile.contactInfo && (
        <ProfileChipGroup label={labels.contact}>
          {profile.contactInfo.email && (
            <LinkedChip href={`mailto:${profile.contactInfo.email}`}>
              {labels.email}: {profile.contactInfo.email}
            </LinkedChip>
          )}
          {profile.contactInfo.cellPhone && (
            <LinkedChip href={`tel:${profile.contactInfo.cellPhone}`}>
              {labels.phone}: {profile.contactInfo.cellPhone}
            </LinkedChip>
          )}
          {profile.contactInfo.workPhone && (
            <LinkedChip href={`tel:${profile.contactInfo.workPhone}`}>
              {labels.phone}: {profile.contactInfo.workPhone}
            </LinkedChip>
          )}
          {profile.contactInfo.homePhone && (
            <LinkedChip href={`tel:${profile.contactInfo.homePhone}`}>
              {labels.phone}: {profile.contactInfo.homePhone}
            </LinkedChip>
          )}
          {profile.contactInfo.contactForm && (
            <LinkedChip href={profile.contactInfo.contactForm}>{labels.contactForm}</LinkedChip>
          )}
          {profile.contactInfo.calendar && (
            <LinkedChip href={profile.contactInfo.calendar}>{labels.calendar}</LinkedChip>
          )}
        </ProfileChipGroup>
      )}

      {profile.payments && (
        <ProfileChipGroup label={labels.payments}>
          {profile.payments.links.map((link) => (
            <LinkedChip key={link.url} href={link.url}>
              {link.label ?? link.url}
            </LinkedChip>
          ))}
          {profile.payments.cryptoWallets.map((wallet) => (
            <LinkedChip key={`${wallet.label}-${wallet.address}`}>
              {wallet.label}: {wallet.address}
            </LinkedChip>
          ))}
        </ProfileChipGroup>
      )}

      {dateItems.length > 0 && (
        <p className="text-left text-[0.68rem] leading-relaxed text-muted-foreground/80">
          {dateItems.join(' · ')}
        </p>
      )}

      {showProfileLink && profile.profileUrl && (
        <a
          href={profile.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium leading-none text-primary-foreground"
        >
          {labels.gravatar}
          <ExternalLink className="h-3 w-3" aria-hidden />
        </a>
      )}
    </div>
  );
}

export function Team({ showChart = false }: { showChart?: boolean }) {
  const dict = useDictionary();
  const people = flattenPeople(team);
  const gravatarProfiles = useTeamGravatarProfiles();

  const [currentIndex, setCurrentActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95,
    }),
  };

  const paginate = useCallback(
    (newDirection: number) => {
      setDirection(newDirection);
      setCurrentActiveIndex(
        (prevIndex) => (prevIndex + newDirection + people.length) % people.length
      );
    },
    [people.length]
  );

  if (showChart) {
    return <OrgChart />;
  }

  const currentMember = people[currentIndex];
  const currentProfile = gravatarProfiles[currentMember.id];
  const avatarSrc = currentProfile?.avatarUrl ?? currentMember.image;
  const avatarAlt = currentProfile?.avatarAltText ?? currentMember.name;
  const profileName = getProfileName(currentMember.name, currentProfile);
  const fallbackRole = dict.team.roles[currentMember.id];
  const profileLabels = dict.team.profile;
  const showFallbackName = Boolean(
    currentProfile?.displayName && currentProfile.displayName !== currentMember.name
  );
  const initials = currentMember.name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  return (
    <div className="relative mx-auto flex w-full max-w-4xl animate-fade-in flex-col items-center space-y-4 md:space-y-5">
      <div className="space-y-1 text-center">
        <h2 className="text-(length:--text-2xl-fluid) @lg/card:text-(length:--text-3xl-fluid) font-semibold tracking-tight">
          {dict.team.title}
        </h2>
      </div>

      <div className="relative flex min-h-[300px] w-full items-center justify-center md:min-h-[380px]">
        {/* Navigation Buttons */}
        <button
          onClick={() => paginate(-1)}
          className="absolute left-0 z-20 p-2 rounded-full glass border border-border/50 hover:bg-secondary/40 transition-colors hidden sm:block"
          aria-label="Previous member"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="relative flex w-full justify-center overflow-visible px-9 py-3 sm:px-12">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentMember.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.3 },
                scale: { duration: 0.3 },
              }}
              className="grid w-full max-w-[44rem] grid-cols-1 gap-4 rounded-(--radius-card) border border-border/50 bg-(--glass-bg) p-4 text-left shadow-(--shadow-card) @lg/card:grid-cols-[13rem_minmax(0,1fr)] @lg/card:gap-6 @lg/card:p-5"
            >
              <div className="flex flex-col items-center text-center @lg/card:items-start @lg/card:text-left">
                {avatarSrc ? (
                  <div className="relative h-24 w-24 overflow-hidden rounded-full bg-white shadow-sm ring-4 ring-(--warmth-100)/80 ring-offset-4 ring-offset-card @lg/card:h-28 @lg/card:w-28">
                    <Image
                      src={avatarSrc}
                      alt={avatarAlt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 96px, 112px"
                    />
                  </div>
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-(--warmth-100) text-xl font-bold text-(--warmth-700) shadow-inner @lg/card:h-28 @lg/card:w-28 @lg/card:text-2xl">
                    {initials}
                  </div>
                )}

                <div className="mt-4 space-y-1">
                  <h3 className="text-lg font-bold leading-tight text-foreground @lg/card:text-xl">
                    {profileName}
                  </h3>
                  {showFallbackName && (
                    <p className="text-xs text-muted-foreground">{currentMember.name}</p>
                  )}
                  <p className="text-xs font-medium text-(--warmth-700) @lg/card:text-sm">
                    {fallbackRole}
                  </p>
                </div>

                {currentProfile?.profileUrl && (
                  <a
                    href={currentProfile.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium leading-none text-primary-foreground"
                  >
                    {profileLabels.gravatar}
                    <ExternalLink className="h-3 w-3" aria-hidden />
                  </a>
                )}
              </div>

              <div className="min-w-0">
                {currentProfile && (
                  <GravatarProfileDetails
                    labels={profileLabels}
                    profile={currentProfile}
                    showProfileLink={false}
                  />
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          onClick={() => paginate(1)}
          className="absolute right-0 z-20 p-2 rounded-full glass border border-border/50 hover:bg-secondary/40 transition-colors hidden sm:block"
          aria-label="Next member"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Dots Indicator — Matching the site's vertical/horizontal pill navigation style */}
      <div className="flex items-center gap-2 p-1.5 rounded-full glass border border-border/40 shadow-sm">
        {people.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentActiveIndex(index);
            }}
            className={`
              h-2 rounded-full transition-all duration-(--duration-soft) ease-(--ease-out-soft) cursor-pointer
              ${
                index === currentIndex
                  ? 'w-6 bg-(--warmth-500)'
                  : 'w-2 bg-foreground/20 hover:bg-(--warmth-500)/60'
              }
            `}
            aria-label={`Go to member ${index + 1}`}
            aria-current={index === currentIndex ? 'true' : undefined}
          />
        ))}
      </div>
    </div>
  );
}
