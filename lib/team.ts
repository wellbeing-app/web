export type TeamNode =
  | { kind: 'person'; id: string; name: string; image?: string; children?: TeamNode[] }
  | { kind: 'group'; id: string; children: TeamNode[] };

export const team: TeamNode = {
  kind: 'person',
  id: 'anna',
  name: 'Anna Zezulka',
  image: '/anna.png',
  children: [
    {
      kind: 'group',
      id: 'vedeni',
      children: [
        { kind: 'person', id: 'sofia', name: 'Sofia Grycová', image: '/sofia.png' },
        { kind: 'person', id: 'natalie', name: 'Natálie Neumannová', image: '/natalie.webp' },
      ],
    },
    {
      kind: 'group',
      id: 'vyvoj',
      children: [
        { kind: 'person', id: 'daniel', name: 'Daniel Pravdík' },
        { kind: 'person', id: 'matyas', name: 'Matyáš Procházka' },
        { kind: 'person', id: 'martin', name: 'Martin Čechal', image: '/martin.webp' },
      ],
    },
  ],
};

export function flattenPeople(node: TeamNode): Array<{ id: string; name: string; image?: string }> {
  if (node.kind === 'person') {
    const rest = node.children?.flatMap(flattenPeople) ?? [];
    return [{ id: node.id, name: node.name, image: node.image }, ...rest];
  }
  return node.children.flatMap(flattenPeople);
}
