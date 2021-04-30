export const BOTTOM_RIGHT = 'bottom-right';
export const BOTTOM_CENTER = 'bottom-center';
export const BOTTOM_LEFT = 'bottom-left';
export const TOP_RIGHT = 'top-right';
export const TOP_CENTER = 'top-center';
export const TOP_LEFT = 'top-left';
export const RIGHT_BOTTOM = 'right-bottom';
export const RIGHT_CENTER = 'right-center';
export const RIGHT_TOP = 'right-top';
export const LEFT_BOTTOM = 'left-bottom';
export const LEFT_CENTER = 'left-center';
export const LEFT_TOP = 'left-top';

export const POSITIONS = <const>[
  BOTTOM_RIGHT,
  BOTTOM_CENTER,
  BOTTOM_LEFT,
  TOP_RIGHT,
  TOP_CENTER,
  TOP_LEFT,
  RIGHT_BOTTOM,
  RIGHT_CENTER,
  RIGHT_TOP,
  LEFT_BOTTOM,
  LEFT_CENTER,
  LEFT_TOP,
];

export type Position = typeof POSITIONS[number];

export default POSITIONS;
