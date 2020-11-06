import React from 'react'
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native'

import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'

import JoloText, { JoloTextKind } from '../JoloText'
import { useToastToShow } from './context'
import Description from './Description'
import Title from './Title'

const InteractiveToast = React.forwardRef(
  ({ handleInteractionBtnLayout }, ref) => {
    const { toastToShow, toastColor, invokeInteract } = useToastToShow()
    if (toastToShow?.interact) {
      return (
        <>
          <Title customStyles={{ textAlign: 'left' }} />
          <View style={styles.withInteractContainer}>
            <View style={styles.withInteractText}>
              <Description customStyles={{ textAlign: 'left' }} />
            </View>
            <View
              style={styles.interactBtnContainer}
              onLayout={handleInteractionBtnLayout}
              ref={ref}
            >
              <TouchableOpacity
                onPress={invokeInteract}
                style={styles.interactBtn}
              >
                <JoloText
                  kind={JoloTextKind.subtitle}
                  size={JoloTextSizes.tiniest}
                  color={toastColor}
                  customStyles={{
                    fontSize: 12,
                    letterSpacing: 0.8,
                    lineHeight: 12,
                  }}
                >
                  {toastToShow.interact.label}
                </JoloText>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )
    }
    return null
  },
)

const styles = StyleSheet.create({
  withInteractContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  interactBtnContainer: {
    flex: 0.3,
    alignSelf: 'flex-end',
  },
  interactBtn: {
    paddingTop: 3,
    paddingBottom: Platform.OS === 'ios' ? 5 : 3,
    borderWidth: 1,
    borderColor: Colors.silverChalice,
    borderRadius: 6.4,
  },
  withInteractText: { alignItems: 'flex-start', flex: 0.6 },
})

export default InteractiveToast
