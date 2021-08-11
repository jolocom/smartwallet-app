import React from 'react'
import { StyleSheet } from 'react-native'
import InteractionCardOther from '~/assets/svg/InteractionCardOther'

import { Colors } from '~/utils/colors'
import { commonStyles } from '../commonStyles'
import { usePruneFields } from '../hooks'
import ScaledCard, { ScaledText, ScaledView } from '../ScaledCard'
import { FieldsCalculator } from './components'
import { shareStyles } from './styles'
import { InteractionShareOtherCardProps } from './types'

const MAX_FIELDS = 3
const MAX_FIELD_LINES = 3

export const InteractionShareOtherCard: React.FC<InteractionShareOtherCardProps> =
  ({ credentialName, fields }) => {
    const {
      displayedFields,
      handleFieldValueLayout,
      handleFieldValuesVisibility,
    } = usePruneFields(fields, MAX_FIELDS, MAX_FIELD_LINES)

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
              {displayedFields.map((f, idx) => (
                <>
                  {idx !== 0 && (
                    <ScaledView scaleStyle={{ paddingBottom: 12 }} />
                  )}

                  <ScaledText
                    numberOfLines={1}
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
