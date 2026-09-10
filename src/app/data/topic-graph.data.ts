/**
 * Hand-placed grid positions for the curriculum map. Prerequisite edges come
 * from the topics themselves; only the layout lives here, so a node can be
 * moved without touching any relationship.
 *
 * `col` runs 0-4 left to right, `row` top to bottom.
 */
export const TOPIC_POSITIONS: Record<string, { col: number; row: number }> = {
  'why-dsa': { col: 2, row: 0 },
  foundations: { col: 2, row: 1 },
  complexity: { col: 2, row: 2 },
  mathematics: { col: 0, row: 3 },
  arrays: { col: 2, row: 3 },
  strings: { col: 1, row: 4 },
  hashing: { col: 2, row: 4 },
  'binary-search': { col: 4, row: 4 },
  'two-pointers': { col: 2, row: 5 },
  sorting: { col: 4, row: 5 },
  'sliding-window': { col: 2, row: 6 },
  recursion: { col: 4, row: 6 },
  'linked-lists': { col: 4, row: 7 },
  'stacks-queues': { col: 4, row: 8 },
  trees: { col: 3, row: 9 },
  heaps: { col: 3, row: 10 },
  graphs: { col: 1, row: 11 },
  greedy: { col: 3, row: 11 },
  'dynamic-programming': { col: 2, row: 12 },
  advanced: { col: 2, row: 13 },
};

/** Geometry of one grid cell, in SVG units. */
export const GRAPH_LAYOUT = {
  nodeWidth: 132,
  nodeHeight: 38,
  colPitch: 150,
  rowPitch: 62,
  padding: 12,
  columns: 5,
  rows: 14,
};
