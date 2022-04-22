export function getAccelerometerAngles(dx, dy, dz) {
  const
    x2 = dx * dx,
    y2 = dy * dy,
    z2 = dz * dz,
    ax = Math.atan2(dx, Math.sqrt(y2 + z2)),
    ay = Math.atan2(dy, Math.sqrt(x2 + z2));
  
  return [ax, ay];
}