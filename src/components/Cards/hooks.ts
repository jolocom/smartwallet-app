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
export const useCalculateFieldLines = (maxLinesPerField = 2) => {
  const [fieldLines, setFieldLines] = useState<Record<number, number>>({})
  const handleFieldValueLayout = (e: TextLayoutEvent, idx: number) => {
    const lines = e.nativeEvent.lines.length
    setFieldLines((prevState) => {
      const value = prevState[idx] ?? lines
      return {
        ...prevState,
        [idx]: value > maxLinesPerField ? maxLinesPerField : value,
      }
    })
  }
  return {
    fieldLines,
    handleFieldValueLayout,
  }
}

/**
 *
 * @param fields
 * @param maxNrFields
 * @param maxNrFieldLines
 * @returns
 */

/**
 * NOTE: this hook is currently used in
 * DocumentSectionDocumentCard and InteractionShareOtherCard components.
 * @param fields - claims of a credential
 * @param maxNrField - max number of fields a card can display
 * @param maxNrFieldLines - max number of lines each field can display
 * @returns displayFields - pruned field length based on maxNrField argument
 * @returns handleFieldValueLayout - fn executed in onTextLayout event of field value text
 * to calculate how many lines each field value has
 * @returns handleFieldValuesVisibility - used to decide how many fields
 * and how many field lines in field value are displayed. Should it thould beused in FieldCalculator component
 */
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
   * NOTE: We can not display more than maxNrFieldLines lines of all field value lines
   */
  /**
   *
   * @param child a field node (a fragement with 4 children) of the collection of displayfields node
   * children:
   * 0 idx - top padding of a field
   * 1 idx - field label
   * 2 idx - padding between field label and field value
   * 3 idx - field value
   * @param idx an index of a field node in collection of displayedFields
   * @returns
   * - a field node if sum of displayed filed lines doesnt exceeed maxNrFieldLines
   * - null if no space is left because all available field lines were occupied
   * - modiedied field node, where field value display number of remaining available fields (nr = 1)
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
          if (remainingNrLines <= 0) {
            return null
          } else {
            /**
             * otherwise,
             * change numberOfLines display for field value
             */
            return React.Children.map(child.props.children, (c, idx) => {
              /**
               * NOTE: performing operation on the last child as this is a components
               * responsible for rendering field.value,
               * NOTE: !!!! if texts will get reorganized this will have to be updated
               */
              /**
               * NOTE: as of now children of field caculator fragment are:
               * 0 idx - top padding of a field
               * 1 idx - field label
               * 2 idx - padding between field label and field value
               * 3 idx - field value
               */
              if (idx === child.props.children.length - 1) {
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
