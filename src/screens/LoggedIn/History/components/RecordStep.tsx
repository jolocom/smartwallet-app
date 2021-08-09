import React from 'react'
import { View, StyleSheet } from 'react-native'

import { IRecordSteps } from '~/types/records'
import { Colors } from '~/utils/colors'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import useTranslation from '~/hooks/useTranslation'

const RecordStep: React.FC<IRecordSteps> = ({ title, description }) => {
  const { t } = useTranslation()
  return (
    <View style={styles.stepContainer}>
      <View style={styles.topRowContainer}>
        <View style={styles.dotContainer}>
          <View style={styles.dot} />
        </View>
        <View style={{ flex: 0.75 }}>
          <JoloText
            ignoreScaling
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
          ignoreScaling
          size={JoloTextSizes.mini}
          customStyles={{ textAlign: 'left' }}
          numberOfLines={1}
        >
          {description || t('General.unknown')}
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
})

export default RecordStep
