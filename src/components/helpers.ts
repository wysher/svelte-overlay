import type { Position } from './positions';

const RIGHT = "right";
const LEFT = "left";
const TOP = "top";
const CENTER = "center";
const BOTTOM = "bottom";

type PositionPart = typeof RIGHT | typeof LEFT | typeof TOP | typeof CENTER | typeof BOTTOM;

type PositionsRecord = Partial<Record<PositionPart, () => PositionPart>>;

export interface Dimensions extends ClientRect {
  clientWidth?: number,
  clientHeight?: number,
};

// for SSR
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

export const getNextPosition = (position: Position, dimensions: Dimensions): string => {
  const clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight);
  const clientWidth = Math.min(document.body.clientWidth, document.documentElement.clientWidth);
  Object.assign(dimensions, { clientWidth, clientHeight });

  const [mainPosition, secondaryPosition] = position.split('-') as PositionPart[];
  const nextMainPosition = getMainPosition(mainPosition, dimensions);
  const nextSecondaryPosition = getSecondaryPosition(secondaryPosition, dimensions);

  return `${nextMainPosition}-${nextSecondaryPosition}`;
}

const getMainPosition = (
  position: PositionPart,
  {
    top,
    bottom,
    left,
    right,
    height,
    width,
    clientWidth,
    clientHeight,
  }: Dimensions,
): PositionPart => {

  const fitsOnTop = top > height;
  const fitsOnBottom = bottom + height < clientHeight;

  const fitsOnLeft = left > width;
  const fitsOnRight = right + width < clientWidth;

  const positions: PositionsRecord = {
    top: () => !fitsOnTop && fitsOnBottom ? BOTTOM : TOP,
    bottom: () => fitsOnTop && !fitsOnBottom ? TOP : BOTTOM,
    left: () => !fitsOnLeft && fitsOnRight ? RIGHT : LEFT,
    right: () => !fitsOnRight && fitsOnLeft ? LEFT : RIGHT,
  };

  return positions[position]();
};

const getSecondaryPosition = (
  position: PositionPart,
  {
    top,
    bottom,
    left,
    right,
    height,
    width,
    clientWidth,
    clientHeight,
  }: Dimensions
): PositionPart => {
  const parentHeight = bottom - top;
  const parentCenter = top + parentHeight / 2;

  const fitsOnTop = bottom > height;
  const fitsOnBottom = top + height < clientHeight;
  const fitsCenter = (parentCenter - height / 2) > 0 && (parentCenter + height / 2) < clientHeight;
  const fitsOnLeft = right > width;
  const fitsOnRight = left + width < clientWidth;

  const positions: PositionsRecord = {
    top: () => !fitsOnTop && fitsOnBottom ? BOTTOM : TOP,
    center: () => fitsCenter ? CENTER : positions.top(),
    bottom: () => !fitsOnBottom && fitsOnTop ? TOP : BOTTOM,
    left: () => !fitsOnLeft && fitsOnRight ? RIGHT : LEFT,
    right: () => !fitsOnRight && fitsOnLeft ? LEFT : RIGHT,
  };

  return positions[position]();
};
