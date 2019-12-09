import React from 'react'
import { Dimensions } from 'react-native'
import Svg, { G, Mask, Path, Polygon } from 'react-native-svg'

export const scaleSVGPath = (path: string, factor: number) => {
  const coordArray = path.split(' ')
  const isLastZ = coordArray[coordArray.length - 1][0] === 'Z'
  if (isLastZ) coordArray.pop()

  const coordinates = coordArray.map(vals => {
    const coordinates = vals.split(',')
    const paths = coordinates.map(val => {
      let newVal = val
      let pathType
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (isNaN(val[0] as any)) {
        pathType = val[0]
        newVal = val.substr(1)
      } else {
        pathType = ''
      }
      const numVal = parseFloat(newVal)
      const scaledVal = numVal * factor
      return `${pathType}${scaledVal}`
    })
    return paths.join(',')
  })
  if (isLastZ) coordinates.push('Z')
  return coordinates.join(' ')
}

export const SVGBar = () => {
  const { width } = Dimensions.get('window')
  const origWidth = 414
  const origHeight = 110
  const scaleFactor = width / origWidth
  const origPath =
    'M414,38.3893622 L414,109 L414,109 L0,109 L0,37.536 C-2.53876144e-15,16.8054396 16.8054396,-1.04027126e-14 37.536,0 L163.51955,0 L163.51955,0 C161.798583,4.88903633 160.86221,10.1498511 160.86221,15.6302447 C160.86221,41.5272807 181.771313,62.5209787 207.564142,62.5209787 C233.35697,62.5209787 254.266074,41.5272807 254.266074,15.6302447 C254.266074,10.1498511 253.3297,4.88903633 251.608734,0 L376.720282,0.854237144 C397.350347,0.995095185 414,17.7588166 414,38.3893622 Z'

  const origPoints = '0 -6 414 -6 414 109 6.12922817e-14 109'

  const scaledPath = scaleSVGPath(origPath, scaleFactor)
  const scaledPoints = scaleSVGPath(origPoints, scaleFactor)
  return (
    <Svg
      width={origWidth}
      height={origHeight}
      viewBox={`0 0 ${origWidth} ${origHeight}`}
    >
      <G id="Symbols" fill="none" fillRule="evenodd">
        <G id="balck_bckg">
          <Mask id="mask-2" fill="white">
            <Path d={scaledPath} id="path-1" />
          </Mask>
          <G id="Clip-86" />
          <Polygon
            id="Fill-85"
            fill="#0B030D"
            mask="url(#mask-2)"
            points={scaledPoints}
          />
        </G>
      </G>
    </Svg>
  )
}
