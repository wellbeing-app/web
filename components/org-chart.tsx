'use client';

import React, { useRef, useEffect, useLayoutEffect, useState, useCallback } from 'react';
import { motion, Variants } from 'framer-motion';
import { team, type TeamNode } from '@/lib/team';
import { useDictionary } from '@/components/providers/dictionary-provider';

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

export function OrgChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Map<string, HTMLElement>>(new Map());
  const [lines, setLines] = useState<ConnectionLine[]>([]);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const registerRef: RegisterRef = useCallback(
    (id) => (el) => {
      if (el) nodeRefs.current.set(id, el);
      else nodeRefs.current.delete(id);
    },
    [],
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
      const children = node.kind === 'group' ? node.children : node.children ?? [];
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

  // Measure synchronously before paint so lines render at their final positions
  // on the first frame, rather than being computed mid-animation and snapping later.
  useLayoutEffect(() => {
    recalculate();
  }, [recalculate]);

  useEffect(() => {
    window.addEventListener('resize', recalculate);

    const ro =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => recalculate())
        : null;
    if (ro && containerRef.current) ro.observe(containerRef.current);

    return () => {
      window.removeEventListener('resize', recalculate);
      ro?.disconnect();
    };
  }, [recalculate]);

  return (
    <div ref={containerRef} className="relative w-full flex justify-center py-12 overflow-x-auto">
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
            className="stroke-border"
            strokeWidth={2}
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
        <TreeView node={team} registerRef={registerRef} />
      </motion.div>
    </div>
  );
}

function TreeView({ node, registerRef }: { node: TeamNode; registerRef: RegisterRef }) {
  const children = node.kind === 'group' ? node.children : node.children ?? [];

  return (
    <div className="flex flex-col items-center">
      {node.kind === 'person' ? (
        <PersonCard node={node} setRef={registerRef(node.id)} />
      ) : (
        <GroupLabel node={node} setRef={registerRef(node.id)} />
      )}

      {children.length > 0 && (
        <div className="mt-12 flex gap-6 md:gap-10 items-start">
          {children.map((child) => (
            <TreeView key={child.id} node={child} registerRef={registerRef} />
          ))}
        </div>
      )}
    </div>
  );
}

function PersonCard({
  node,
  setRef,
}: {
  node: Extract<TeamNode, { kind: 'person' }>;
  setRef: (el: HTMLElement | null) => void;
}) {
  const dict = useDictionary();
  const role = dict.team.roles[node.id];
  const initials = node.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  return (
    <motion.div
      ref={setRef}
      variants={nodeVariants}
      className="w-52 md:w-56 bg-card rounded-xl p-5 shadow-sm border border-border flex flex-col items-center text-center"
    >
      <div
        className="w-14 h-14 rounded-full bg-muted mb-3 flex items-center justify-center"
        aria-hidden="true"
      >
        <span className="text-muted-foreground font-bold">{initials}</span>
      </div>
      <h3 className="font-semibold text-foreground leading-tight">{node.name}</h3>
      {role && <p className="text-muted-foreground text-sm mt-1">{role}</p>}
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
