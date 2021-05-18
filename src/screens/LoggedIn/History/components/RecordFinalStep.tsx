import React from 'react'
import { View, StyleSheet } from 'react-native'

import { IRecordSteps, IRecordStatus } from '~/types/records'
import { Colors } from '~/utils/colors'
import JoloText from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import { SuccessTick, ErrorIcon } from '~/assets/svg'

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
      <View style={styles.textContainer}>
        <JoloText color={Colors.white} customStyles={{ textAlign: 'left' }}>
          {title}
        </JoloText>
        <JoloText
          color={
            status === IRecordStatus.finished ? Colors.white60 : Colors.error
          }
          size={JoloTextSizes.tiniest}
          customStyles={{ textAlign: 'left' }}
          numberOfLines={1}
        >
          {description}
        </JoloText>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  stepContainer: {
    width: '100%',
    paddingVertical: 14,
  },
  dotContainer: {
    flex: 0.25,
    alignItems: 'center',
    justifyContent: 'center',
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
  textContainer: {
    flex: 0.75,
    paddingLeft: 4,
    justifyContent: 'center',
  },
})

export default RecordFinalStep
