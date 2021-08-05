import React from 'react'
import { StyleSheet } from 'react-native'
import InteractionCardOther from '~/assets/svg/InteractionCardOther'

import { Colors } from '~/utils/colors'
import { commonStyles } from '../commonStyles'
import { useCalculateFieldLines } from '../hooks'
import ScaledCard, { ScaledText, ScaledView } from '../ScaledCard'
import { FieldsCalculator } from './components'
import { MAX_FIELD_OTHER } from './consts'
import { shareStyles } from './styles'
import { InteractionShareOtherCardProps } from './types'

export const InteractionShareOtherCard: React.FC<InteractionShareOtherCardProps> =
  ({ credentialName, fields }) => {
    const { fieldLines, handleFieldValueLayout } = useCalculateFieldLines()

    const handleFieldValuesVisibility = (
      child: React.ReactNode,
      idx: number,
    ) => {
      if (idx + 1 > MAX_FIELD_OTHER) {
        /* 1. Do not display anything that is more than max */
        return null
      } else if (
        fieldLines[0] &&
        fieldLines[1] &&
        fieldLines[0] + fieldLines[1] > 2 &&
        idx > 1
      ) {
        /* 2. If the sum of first and second field values is greater than 2 do not display anything later*/
        return null
      }
      return child
    }

    return (
      <ScaledCard originalHeight={232} originalWidth={368} scaleToFit>
        <InteractionCardOther>
          <ScaledView scaleStyle={styles.otherBodyContainer}>
            <ScaledText
              numberOfLines={2}
              scaleStyle={styles.otherCredentialName}
              style={commonStyles.regularText}
            >
              {credentialName}
            </ScaledText>
            <ScaledView scaleStyle={{ paddingBottom: 16 }} />
            <FieldsCalculator cbFieldsVisibility={handleFieldValuesVisibility}>
              {fields.map((f, idx) => (
                <>
                  {idx !== 0 && (
                    <ScaledView scaleStyle={{ paddingBottom: 12 }} />
                  )}

                  <ScaledText
                    scaleStyle={commonStyles.fieldLabel}
                    style={commonStyles.regularText}
                  >
                    {f.label}:
                  </ScaledText>
                  <ScaledView scaleStyle={{ paddingBottom: 4 }} />
                  {/* TODO: the same as in document card */}
                  <ScaledText
                    numberOfLines={2}
                    //@ts-expect-error
                    onTextLayout={(e: TextLayoutEvent) =>
                      handleFieldValueLayout(e, idx)
                    }
                    scaleStyle={shareStyles.fieldValue}
                    style={commonStyles.regularText}
                  >
                    {f.value}
                  </ScaledText>
                </>
              ))}
            </FieldsCalculator>
          </ScaledView>
        </InteractionCardOther>
      </ScaledCard>
    )
  }

const styles = StyleSheet.create({
  otherBodyContainer: {
    // TODO: correct values once available
    // add width once available
    paddingBottom: 18,
    paddingTop: 16,
    paddingLeft: 20,
    paddingRight: 17,
    width: '73%',
  },
  otherCredentialName: {
    color: Colors.black80,
    fontSize: 22,
    lineHeight: 24,
  },
})
