import { DisplayVal } from '@jolocom/sdk/js/credentials'
import React, { useMemo, useRef, useState } from 'react'
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
 * a hook to decide about nr of displayed fields for document
 * section cards
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

/**
 * a hook to calculate nr of displayed fields for interaction cards
 */
export const useCalculateFieldLines = () => {
  const [fieldLines, setFieldLines] = useState<Record<number, number>>({})
  const handleFieldValueLayout = (e: TextLayoutEvent, idx: number) => {
    const lines = e.nativeEvent.lines.length
    setFieldLines((prevState) => ({
      ...prevState,
      [idx]: prevState[idx] ?? lines,
    }))
  }
  return {
    fieldLines,
    handleFieldValueLayout,
  }
}

export const usePruneFields = (
  fields: Array<Required<DisplayVal>>,
  maxNrFields: number,
  maxNrFieldLines: number,
) => {
  const displayedFields = useMemo(
    () => fields.splice(0, maxNrFields),
    [fields.length],
  )
  const { fieldLines, handleFieldValueLayout } = useCalculateFieldLines()

  const sumFieldLines = useMemo(() => {
    if (Object.keys(fieldLines).length === displayedFields.length) {
      return Object.keys(fieldLines).reduce(
        (acc, key) => acc + fieldLines[parseInt(key)],
        0,
      )
    }
    return 0
  }, [JSON.stringify(fieldLines)])

  /**
   * We can not display more than maxNrFieldLines lines of all field value lines
   */
  const handleFieldValuesVisibility = (child: React.ReactNode, idx: number) => {
    /**
     * Once nr of lines of all displayed fields was calculated
     */
    if (
      Object.keys(fieldLines).length === displayedFields.length &&
      sumFieldLines !== 0
    ) {
      /**
       * if sum of all field lines doesn't exceed max
       * amount of lines that can be displayed
       */
      if (sumFieldLines <= maxNrFieldLines) {
        return child
      } else {
        /**
         * safely display lines of first and second fields,
         * because max number of lines for a field value is 2,
         * and even if both of these fields (1st, 2nd)
         * have max amount of field lines display it will still display 4 lines
         */
        if (idx === 0 || idx === 1) {
          return child
        } else {
          const remainingNrLines =
            maxNrFieldLines - fieldLines[0] - fieldLines[1]
          /**
           * If no lines are left to display do not display the whole field
           */
          if (remainingNrLines === 0) {
            return null
          } else {
            /**
             * otherwise,
             * change numberOfLines display for field value
             */
            return React.Children.map(child.props.children, (c, idx) => {
              // NOTE: using idx 3 as field.value is located under 3rd idx,
              // if texts will get reorganized this will have to be updated
              if (idx === 3) {
                return React.cloneElement(c, {
                  numberOfLines:
                    maxNrFieldLines - fieldLines[0] - fieldLines[1],
                })
              }
              // the rest of children
              return c
            })
          }
        }
      }
    }
    return child
  }

  return {
    displayedFields,
    handleFieldValueLayout,
    handleFieldValuesVisibility,
  }
}
