import { GestureResponderEvent } from 'react-native'

export interface Coordinates {
  prevX: number
  prevY: number
  curX: number
  curY: number
}

export const extractCoords = (
  e: GestureResponderEvent,
): { curX: number; curY: number } => ({
  curX: Math.floor(e.nativeEvent.locationX),
  curY: Math.floor(e.nativeEvent.locationY),
})

export const shouldComputeLine = (
  coords: Coordinates,
  minDist: number,
): boolean => {
  //NOTE: checks if the new line segment is longer than the min line
  const squareDistance =
    Math.abs(coords.curX - coords.prevX) + Math.abs(coords.curY - coords.prevY)
  return squareDistance > minDist
}

export const findIntersections = (
  lines: number[],
  coords: Coordinates,
): { x: number; y: number }[] => {
  const { prevX, prevY, curX, curY } = coords
  const intersections = []
  for (let i = 0; i < lines.length; i += 4) {
    // NOTE: Defining the coordinates of the each line {(a, b) -> (c, d)}
    // in the canvas and the currently drawn line {(p, q) -> (r, s)}
    const a = lines[i],
      b = lines[i + 1],
      c = lines[i + 2],
      d = lines[i + 3],
      p = prevX,
      q = prevY,
      r = curX,
      s = curY

    const det = (c - a) * (s - q) - (r - p) * (d - b)
    const areParallel = det === 0
    if (areParallel) continue

    const lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det
    const gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det
    const isIntersection = 0 < lambda && lambda < 1 && 0 < gamma && gamma < 1

    if (isIntersection) {
      const x = a + lambda * (c - a)
      const y = b + lambda * (d - b)
      intersections.push({ x, y })

      //NOTE: allow only 1 intersection per segment
      break
    }
  }

  return intersections
}
