// Calculates whether a given point is within a given area
export const isPointWithinArea = (
  pointX: number, // x coordinate
  pointY: number, // y coordinate
  areaTlX: number, // top left x coordinate
  areaTlY: number, // top left y coordinate
  areaBrX: number, // bottom right x coordinate
  areaBrY: number, // bottom right y coordinate
): boolean => {
  return (
    areaTlX <= pointX &&
    pointX <= areaBrX &&
    areaTlY <= pointY &&
    pointY <= areaBrY
  )
}

// Moves an object within a given array from one position to another
export const moveArrayElement = (
  array: {}[], // array of objects
  from: number, // element to move index
  to: number, // index where to move
  mergeProps?: {} = {}, // merge additional props into the object
): {}[] => {
  if (to > array.length) return array

  // Remove the element we need to move
  const arr = [...array.slice(0, from), ...array.slice(from + 1)]

  // And add it back at a new position
  return [
    ...arr.slice(0, to),
    {
      ...array[from],
      ...mergeProps, // merge passed props if any or nothing (empty object) by default
    },
    ...arr.slice(to),
  ]
}
