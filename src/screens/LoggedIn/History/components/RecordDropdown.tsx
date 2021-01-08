import React from 'react'
import { View, StyleSheet } from 'react-native'
import Dash from 'react-native-dash'

import {
  IRecordDetails,
  IRecordSteps,
  IRecordStatus,
} from '~/hooks/history/types'
import { debugView } from '~/utils/dev'
import { Colors } from '~/utils/colors'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import { SuccessTick, ErrorIcon } from '~/assets/svg'

const RecordStep: React.FC<IRecordSteps> = ({ title, description }) => {
  return (
    <View style={styles.stepContainer}>
      <View style={styles.topRowContainer}>
        <View style={styles.dotContainer}>
          <View style={styles.dot} />
        </View>
        <View style={{ flex: 0.75 }}>
          <JoloText
            kind={JoloTextKind.title}
            size={JoloTextSizes.mini}
            customStyles={{ textAlign: 'left' }}
          >
            {title}
          </JoloText>
        </View>
      </View>
      <View style={styles.descriptionContainer}>
        <JoloText
          size={JoloTextSizes.mini}
          customStyles={{ textAlign: 'left' }}
          numberOfLines={1}
        >
          {description}
        </JoloText>
      </View>
    </View>
  )
}

const RecordFinalStep: React.FC<IRecordSteps & { status: IRecordStatus }> = ({
  title,
  description,
  status,
}) => {
  return (
    <View style={[styles.stepContainer, { flexDirection: 'row' }]}>
      <View style={styles.dotContainer}>
        <View style={styles.statusContainer}>
          <View style={styles.iconContainer}>
            {status === IRecordStatus.finished ? (
              <SuccessTick color={Colors.white} />
            ) : (
              <ErrorIcon color={Colors.white} />
            )}
          </View>
        </View>
      </View>
      <View style={{ flex: 0.75, paddingLeft: 4 }}>
        <JoloText color={Colors.white} customStyles={{ textAlign: 'left' }}>
          {title}
        </JoloText>
        <JoloText
          color={
            status === IRecordStatus.finished ? Colors.white60 : Colors.error
          }
          size={JoloTextSizes.tiniest}
          customStyles={{ textAlign: 'left' }}
        >
          {description}
        </JoloText>
      </View>
    </View>
  )
}

const RecordDropdown: React.FC<{ details: IRecordDetails }> = ({ details }) => {
  return (
    <View>
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
            title={s.title}
            description={s.description}
            status={details.status}
          />
        ) : (
          <RecordStep title={s.title} description={s.description} />
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
  stepContainer: {
    width: '100%',
    paddingVertical: 14,
  },
  topRowContainer: {
    width: '100%',
    flexDirection: 'row',
  },
  dotContainer: {
    flex: 0.25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.white,
  },
  descriptionContainer: {
    width: '100%',
    paddingLeft: '25%',
    marginTop: 1,
  },
  statusContainer: {
    width: 42,
    height: 42,
    borderWidth: 1,
    borderColor: Colors.white,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.mainBlack,
  },
  iconContainer: {
    transform: [{ scale: 0.6 }],
  },
})

export default RecordDropdown
