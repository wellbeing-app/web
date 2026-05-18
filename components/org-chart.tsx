'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, Variants } from 'framer-motion';
import { team, type TeamNode } from '@/lib/team';
import { useDictionary } from '@/components/providers/dictionary-provider';
import { useIsDesktop } from '@/lib/use-is-desktop';
import {
  useTeamGravatarProfiles,
  type TeamGravatarProfileMap,
} from '@/lib/use-team-gravatar-profiles';
import type { TeamGravatarProfile } from '@/lib/team-gravatar-types';
import Image from 'next/image';

interface ConnectionLine {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const nodeVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
};

type RegisterRef = (id: string) => (el: HTMLElement | null) => void;

function getProfileName(fallbackName: string, profile?: TeamGravatarProfile) {
  const fullName = [profile?.firstName, profile?.lastName].filter(Boolean).join(' ');
  return profile?.displayName ?? (fullName || fallbackName);
}

function getProfileRole(fallbackRole: string | undefined, profile?: TeamGravatarProfile) {
  return [profile?.jobTitle, profile?.company].filter(Boolean).join(' · ') || fallbackRole;
}

function getProfileMeta(profile?: TeamGravatarProfile) {
  return [profile?.location, profile?.pronouns].filter(Boolean).join(' · ');
}

export function OrgChart() {
  const isDesktop = useIsDesktop();
  const gravatarProfiles = useTeamGravatarProfiles();
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Map<string, HTMLElement>>(new Map());
  const [lines, setLines] = useState<ConnectionLine[]>([]);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const registerRef: RegisterRef = useCallback(
    (id) => (el) => {
      if (el) nodeRefs.current.set(id, el);
      else nodeRefs.current.delete(id);
    },
    []
  );

  const recalculate = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const next: ConnectionLine[] = [];

    // offsetLeft/offsetTop ignore CSS transforms, so measurements are stable
    // even while Framer Motion is animating the cards into place.
    const offsetRelativeTo = (el: HTMLElement) => {
      let x = 0;
      let y = 0;
      let current: HTMLElement | null = el;
      while (current && current !== container) {
        x += current.offsetLeft;
        y += current.offsetTop;
        current = current.offsetParent as HTMLElement | null;
      }
      return { x, y, width: el.offsetWidth, height: el.offsetHeight };
    };

    const walk = (node: TeamNode) => {
      const children = node.kind === 'group' ? node.children : (node.children ?? []);
      if (children.length === 0) return;
      const parentEl = nodeRefs.current.get(node.id);
      if (!parentEl) return;
      const p = offsetRelativeTo(parentEl);
      const px = p.x + p.width / 2;
      const py = p.y + p.height;

      for (const child of children) {
        const childEl = nodeRefs.current.get(child.id);
        if (childEl) {
          const c = offsetRelativeTo(childEl);
          next.push({
            id: `${node.id}->${child.id}`,
            x1: px,
            y1: py,
            x2: c.x + c.width / 2,
            y2: c.y,
          });
        }
        walk(child);
      }
    };

    walk(team);
    setLines(next);
    setContainerSize({ width: container.scrollWidth, height: container.scrollHeight });
  }, []);

  // Measure after paint so lines render at their final positions without blocking initial paint.
  useEffect(() => {
    if (!isDesktop) return;
    const timer = setTimeout(() => {
      recalculate();
    }, 100);
    return () => clearTimeout(timer);
  }, [recalculate, isDesktop]);

  useEffect(() => {
    if (!isDesktop) return;
    window.addEventListener('resize', recalculate);

    const ro =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => recalculate()) : null;
    if (ro && containerRef.current) ro.observe(containerRef.current);

    return () => {
      window.removeEventListener('resize', recalculate);
      ro?.disconnect();
    };
  }, [recalculate, isDesktop]);

  if (!isDesktop) {
    return <MobileOrgList node={team} gravatarProfiles={gravatarProfiles} />;
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full flex justify-center py-12 md:overflow-x-auto [mask-image:linear-gradient(to_right,transparent_0,#000_3rem,#000_calc(100%-3rem),transparent_100%)]"
    >
      <svg
        className="absolute inset-0 pointer-events-none"
        width={containerSize.width || '100%'}
        height={containerSize.height || '100%'}
        aria-hidden="true"
      >
        {lines.map((line) => (
          <motion.line
            key={line.id}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="var(--warmth-300)"
            strokeWidth={2.5}
            strokeOpacity={0.7}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25, ease: 'easeInOut' }}
          />
        ))}
      </svg>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10"
      >
        <TreeView node={team} registerRef={registerRef} gravatarProfiles={gravatarProfiles} />
      </motion.div>
    </div>
  );
}

function MobileOrgList({
  node,
  gravatarProfiles,
}: {
  node: TeamNode;
  gravatarProfiles: TeamGravatarProfileMap;
}) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full flex flex-col items-stretch gap-8 py-8"
    >
      {node.kind === 'person' ? (
        <MobilePersonRow node={node} featured gravatarProfiles={gravatarProfiles} />
      ) : null}
      {node.kind === 'person' && node.children && node.children.length > 0 ? (
        <div className="flex flex-col gap-6">
          {node.children.map((child) => (
            <MobileSubtree key={child.id} node={child} gravatarProfiles={gravatarProfiles} />
          ))}
        </div>
      ) : null}
      {node.kind === 'group' ? (
        <MobileSubtree node={node} gravatarProfiles={gravatarProfiles} />
      ) : null}
    </motion.div>
  );
}

function MobileSubtree({
  node,
  gravatarProfiles,
}: {
  node: TeamNode;
  gravatarProfiles: TeamGravatarProfileMap;
}) {
  const dict = useDictionary();
  if (node.kind === 'group') {
    const label = dict.team.groups[node.id] ?? node.id;
    return (
      <motion.div variants={nodeVariants} className="flex flex-col gap-3">
        <div className="self-start px-4 py-1.5 rounded-full bg-muted/60 border border-dashed border-border text-muted-foreground text-xs font-semibold uppercase tracking-[0.14em]">
          {label}
        </div>
        <ul className="flex flex-col gap-2 pl-4 border-l border-dashed border-border">
          {node.children.map((child) => (
            <li key={child.id}>
              {child.kind === 'person' ? (
                <MobilePersonRow node={child} gravatarProfiles={gravatarProfiles} />
              ) : (
                <MobileSubtree node={child} gravatarProfiles={gravatarProfiles} />
              )}
            </li>
          ))}
        </ul>
      </motion.div>
    );
  }

  const children = node.children ?? [];
  return (
    <motion.div variants={nodeVariants} className="flex flex-col gap-3">
      <MobilePersonRow node={node} gravatarProfiles={gravatarProfiles} />
      {children.length > 0 && (
        <ul className="flex flex-col gap-2 pl-4 border-l border-dashed border-border">
          {children.map((child) => (
            <li key={child.id}>
              {child.kind === 'person' ? (
                <MobilePersonRow node={child} gravatarProfiles={gravatarProfiles} />
              ) : (
                <MobileSubtree node={child} gravatarProfiles={gravatarProfiles} />
              )}
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}

function MobilePersonRow({
  node,
  gravatarProfiles,
  featured = false,
}: {
  node: Extract<TeamNode, { kind: 'person' }>;
  gravatarProfiles: TeamGravatarProfileMap;
  featured?: boolean;
}) {
  const dict = useDictionary();
  const role = dict.team.roles[node.id];
  const profile = gravatarProfiles[node.id];
  const avatarSrc = profile?.avatarUrl ?? node.image;
  const avatarAlt = profile?.avatarAltText ?? node.name;
  const profileName = getProfileName(node.name, profile);
  const profileRole = getProfileRole(role, profile);
  const profileMeta = getProfileMeta(profile);
  const initials = node.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  return (
    <motion.div
      variants={nodeVariants}
      className={
        featured
          ? 'w-full flex flex-col items-center gap-2 bg-(--glass-bg) border border-border/50 rounded-(--radius-card) p-6 shadow-(--shadow-card) text-center'
          : 'w-full flex items-center gap-3 bg-(--glass-bg) border border-border/50 rounded-(--radius-card-inner) p-3 shadow-(--shadow-card)'
      }
    >
      <div
        className={
          featured
            ? `w-16 h-16 rounded-full ${avatarSrc ? 'bg-white' : 'bg-(--warmth-100)'} text-(--warmth-700) flex items-center justify-center overflow-hidden ring-2 ring-(--warmth-100)/80 ring-offset-2 ring-offset-card`
            : `w-10 h-10 shrink-0 rounded-full ${avatarSrc ? 'bg-white' : 'bg-(--warmth-100)'} text-(--warmth-700) flex items-center justify-center overflow-hidden`
        }
      >
        {avatarSrc ? (
          <Image
            src={avatarSrc}
            alt={avatarAlt}
            width={featured ? 64 : 40}
            height={featured ? 64 : 40}
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="text-muted-foreground font-bold">{initials}</span>
        )}
      </div>
      <div className={featured ? 'flex flex-col items-center' : 'flex flex-col min-w-0'}>
        <span className="font-semibold text-foreground leading-tight truncate">{profileName}</span>
        {profileRole && (
          <span
            className={
              featured ? 'text-muted-foreground text-sm mt-1' : 'text-muted-foreground text-xs'
            }
          >
            {profileRole}
          </span>
        )}
        {profileMeta && (
          <span
            className={
              featured ? 'text-muted-foreground text-xs' : 'text-muted-foreground text-[0.68rem]'
            }
          >
            {profileMeta}
          </span>
        )}
      </div>
    </motion.div>
  );
}

function TreeView({
  node,
  registerRef,
  gravatarProfiles,
}: {
  node: TeamNode;
  registerRef: RegisterRef;
  gravatarProfiles: TeamGravatarProfileMap;
}) {
  const children = node.kind === 'group' ? node.children : (node.children ?? []);

  return (
    <div className="flex flex-col items-center">
      {node.kind === 'person' ? (
        <PersonCard node={node} setRef={registerRef(node.id)} gravatarProfiles={gravatarProfiles} />
      ) : (
        <GroupLabel node={node} setRef={registerRef(node.id)} />
      )}

      {children.length > 0 && (
        <div className="mt-12 flex gap-6 md:gap-10 items-start">
          {children.map((child) => (
            <TreeView
              key={child.id}
              node={child}
              registerRef={registerRef}
              gravatarProfiles={gravatarProfiles}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PersonCard({
  node,
  setRef,
  gravatarProfiles,
}: {
  node: Extract<TeamNode, { kind: 'person' }>;
  setRef: (el: HTMLElement | null) => void;
  gravatarProfiles: TeamGravatarProfileMap;
}) {
  const dict = useDictionary();
  const role = dict.team.roles[node.id];
  const profile = gravatarProfiles[node.id];
  const avatarSrc = profile?.avatarUrl ?? node.image;
  const avatarAlt = profile?.avatarAltText ?? node.name;
  const profileName = getProfileName(node.name, profile);
  const profileRole = getProfileRole(role, profile);
  const profileMeta = getProfileMeta(profile);
  const initials = node.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  return (
    <motion.div
      ref={setRef}
      variants={nodeVariants}
      className="w-52 md:w-56 bg-(--glass-bg) rounded-(--radius-card-inner) p-5 shadow-(--shadow-card) border border-border/50 flex flex-col items-center text-center"
    >
      <div
        className={`w-14 h-14 rounded-full ${avatarSrc ? 'bg-white' : 'bg-(--warmth-100)'} text-(--warmth-700) mb-3 flex items-center justify-center overflow-hidden ring-2 ring-(--warmth-100)/80 ring-offset-2 ring-offset-card`}
      >
        {avatarSrc ? (
          <Image
            src={avatarSrc}
            alt={avatarAlt}
            width={56}
            height={56}
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="font-semibold">{initials}</span>
        )}
      </div>
      <h3 className="font-semibold text-foreground leading-tight">{profileName}</h3>
      {profileRole && <p className="text-muted-foreground text-sm mt-1">{profileRole}</p>}
      {profileMeta && <p className="text-muted-foreground text-xs mt-1">{profileMeta}</p>}
    </motion.div>
  );
}

function GroupLabel({
  node,
  setRef,
}: {
  node: Extract<TeamNode, { kind: 'group' }>;
  setRef: (el: HTMLElement | null) => void;
}) {
  const dict = useDictionary();
  const label = dict.team.groups[node.id] ?? node.id;

  return (
    <motion.div
      ref={setRef}
      variants={nodeVariants}
      className="px-4 py-1.5 rounded-full bg-muted/60 border border-dashed border-border text-muted-foreground text-xs font-semibold uppercase tracking-[0.14em]"
    >
      {label}
    </motion.div>
  );
}
