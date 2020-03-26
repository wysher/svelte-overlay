const RIGHT = "right";
const LEFT = "left";
const TOP = "top";
const CENTER = "center";
const BOTTOM = "bottom";

export const getMainPosition = (
  position,
  {
      top,
      bottom,
      left,
      right,
      height,
      width,
  }
) => {
  const fitsOnTop = top > height;
  const fitsOnBottom = bottom + height < window.innerHeight;
  const fitsOnLeft = left > width;
  const fitsOnRight = right + width < window.innerWidth;

  const positions = {
      top: () => !fitsOnTop && fitsOnBottom ? BOTTOM : TOP,
      bottom: () => fitsOnTop && !fitsOnBottom ? TOP : BOTTOM,
      left: () => !fitsOnLeft && fitsOnRight ? RIGHT : LEFT,
      right: () => !fitsOnRight && fitsOnLeft ? LEFT : RIGHT,
  };

  return positions[position]();
};

export const getSecondaryPosition = (
  position,
  {
      top,
      bottom,
      left,
      right,
      height,
      width,
  }
) => {
  const parentHeight = bottom - top;
  const parentCenter = top + parentHeight / 2;

  const fitsOnTop = bottom > height;
  const fitsOnBottom = top + height < window.innerHeight;
  const fitsCenter = (parentCenter - height / 2) > 0 && (parentCenter + height / 2) < window.innerHeight;
  const fitsOnLeft = right > width;
  const fitsOnRight = left + width < window.innerWidth;

  const positions = {
      top: () => !fitsOnTop && fitsOnBottom ? BOTTOM : TOP,
      center: () => fitsCenter ? CENTER : positions.top(),
      bottom: () => !fitsOnBottom && fitsOnTop ? TOP : BOTTOM,
      left: () => !fitsOnLeft && fitsOnRight ? RIGHT : LEFT,
      right: () => !fitsOnRight && fitsOnLeft ? LEFT : RIGHT,
  };

  return positions[position]();
};
