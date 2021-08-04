import { useRef, useState } from 'react'
import { TextLayoutEvent } from '~/types/props'

/**
 * logic to define if credential text should be scaled
 */
export const useCredentialNameScale = () => {
  const [isCredentialNameScaled, setIsCredentialNameScaled] = useState(false)
  const handleCredentialNameTextLayout = (e: TextLayoutEvent) => {
    if (!isCredentialNameScaled) {
      setIsCredentialNameScaled(e.nativeEvent.lines.length > 2)
    }
  }
  return {
    isCredentialNameScaled,
    handleCredentialNameTextLayout,
  }
}

/**
 * logic to define number of displayed fields
 */
export const useTrimFields = <FP>(
  fields: FP[],
  photo?: string,
  highlight?: string,
) => {
  const [displayedFields, setDisplayedFields] = useState(fields.slice(0, 3))
  const lines = useRef(0)
  const handleOptionalFieldTextLayout = () => {
    let calculatedTimes = 0
    return (e: TextLayoutEvent) => {
      calculatedTimes++
      // disable lines manipulation if the number of times this function was invoked
      // exceeds length of optional fields twice (because we calculate field name and
      // field value )
      if (calculatedTimes < fields.length * 2 + 1) {
        const numberOfLines = e.nativeEvent.lines.length
        lines.current += numberOfLines
        if (calculatedTimes === fields.length * 2) {
          /* check wether to show last optional field */
          if (lines.current > 7 && (highlight || photo)) {
            setDisplayedFields((prevState) =>
              prevState.slice(0, Math.floor(lines.current / fields.length)),
            )
          } else if (lines.current > 9 && !highlight) {
            setDisplayedFields((prevState) => prevState.slice(0, 3))
          }
        }
      }
    }
  }
  const onTextLayoutChange = handleOptionalFieldTextLayout()
  return { displayedFields, onTextLayoutChange }
}
