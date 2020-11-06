import React from 'react'
import {
  LayoutChangeEvent,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'

import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'

import JoloText, { JoloTextKind } from '../JoloText'
import { useToastToShow } from './context'
import ToastDescription from './ToastDescription'
import ToastTitle from './ToastTitle'

interface IProps {
  handleInteractionBtnLayout: (e: LayoutChangeEvent) => void
}

const InteractiveToast = React.forwardRef<View, IProps>(
  ({ handleInteractionBtnLayout }, ref) => {
    const { toastToShow, toastColor, invokeInteract } = useToastToShow()
    if (toastToShow?.interact && toastToShow.dismiss) {
      return (
        <>
          <ToastTitle customStyles={{ textAlign: 'left' }} />
          <View style={styles.withInteractContainer}>
            <View style={styles.withInteractText}>
              <ToastDescription customStyles={{ textAlign: 'left' }} />
            </View>
            <View
              style={styles.interactBtnContainer}
              onLayout={handleInteractionBtnLayout}
              ref={ref}
            >
              <TouchableOpacity
                onPressIn={invokeInteract}
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
    paddingTop: Platform.select({ ios: 3, android: 6 }),
    paddingBottom: Platform.select({ ios: 5, android: 6 }),
    borderWidth: 1,
    borderColor: Colors.silverChalice,
    borderRadius: 6.4,
  },
  withInteractText: { alignItems: 'flex-start', flex: 0.6 },
})

export default InteractiveToast
