import React from 'react'
import { View, StyleSheet } from 'react-native'
import Dash from 'react-native-dash'

import { IRecordDetails } from '~/types/records'
import { Colors } from '~/utils/colors'
import RecordStep from './RecordStep'
import RecordFinalStep from './RecordFinalStep'

const RecordItemDetails: React.FC<{ details: IRecordDetails }> = ({
  details,
}) => {
  return (
    <View testID="record-item-details">
      <View style={styles.dashContainer}>
        <Dash
          dashLength={2}
          dashThickness={1}
          dashGap={5}
          dashColor={Colors.genevaGray}
          style={styles.dash}
        />
      </View>
      {details.steps.map((s, i) => {
        const isLastStep = i === details.steps.length - 1
        return isLastStep ? (
          <RecordFinalStep
            key={i}
            title={s.title}
            description={s.description}
            status={details.status}
          />
        ) : (
          <RecordStep key={i} title={s.title} description={s.description} />
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  dashContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '25%',
    height: '100%',
    paddingTop: 8,
    paddingBottom: 16,
    alignItems: 'center',
  },
  dash: {
    height: '100%',
    flexDirection: 'column',
    opacity: 0.4,
  },
})

export default RecordItemDetails
