export type TeamNode =
  | { kind: 'person'; id: string; name: string; children?: TeamNode[] }
  | { kind: 'group'; id: string; children: TeamNode[] };

export const team: TeamNode = {
  kind: 'person',
  id: 'anna',
  name: 'Anna Zezulka',
  children: [
    {
      kind: 'group',
      id: 'vedeni',
      children: [
        { kind: 'person', id: 'sofia', name: 'Sofia Grycová' },
        { kind: 'person', id: 'natalie', name: 'Natálie Neumannová' },
      ],
    },
    {
      kind: 'group',
      id: 'vyvoj',
      children: [{ kind: 'person', id: 'daniel', name: 'Daniel Pravdík' }],
    },
  ],
};

export function flattenPeople(
  node: TeamNode,
): Array<{ id: string; name: string }> {
  if (node.kind === 'person') {
    const rest = node.children?.flatMap(flattenPeople) ?? [];
    return [{ id: node.id, name: node.name }, ...rest];
  }
  return node.children.flatMap(flattenPeople);
}
