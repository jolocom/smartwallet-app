import React from 'react'
import { StyleSheet, View } from 'react-native'
import { InitiatorPlaceholderIcon } from '~/assets/svg'
import Btn, { BtnSize, BtnTypes } from '~/components/Btn'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import ScreenDismissArea from '~/components/ScreenDismissArea'
import { ContainerBAS } from '~/screens/Modals/Interaction/InteractionFlow/components/styled'
import { Colors } from '~/utils/colors'

export const AusweisBottomSheet: React.FC<{ onDismiss: () => void }> = ({
  children,
  onDismiss,
}) => {
  return (
    <View style={styles.fullScreen}>
      <ScreenDismissArea onDismiss={onDismiss} />
      <View style={styles.interactionBody}>
        <ContainerBAS>{children}</ContainerBAS>
      </View>
    </View>
  )
}

export const AusweisButtons: React.FC<{
  submitLabel: string
  onSubmit: () => void
  cancelLabel: string
  onCancel: () => void
}> = ({ submitLabel, onSubmit, cancelLabel, onCancel }) => {
  return (
    <View style={styles.btnGroupContainer}>
      <View style={[styles.btnContainer, { flex: 0.7, marginRight: 12 }]}>
        <Btn size={BtnSize.medium} onPress={onSubmit} withoutMargins>
          {submitLabel}
        </Btn>
      </View>
      <View style={[styles.btnContainer, { flex: 0.3 }]}>
        <Btn
          size={BtnSize.medium}
          type={BtnTypes.secondary}
          onPress={onCancel}
          customContainerStyles={styles.cancelBtn}
          withoutMargins
        >
          {cancelLabel}
        </Btn>
      </View>
    </View>
  )
}

export const AusweisLogo: React.FC = () => {
  return (
    <View style={[styles.image, { backgroundColor: Colors.white }]}>
      <InitiatorPlaceholderIcon />
    </View>
  )
}

export const AusweisHeaderDescription: React.FC = ({ children }) => {
  return (
    <JoloText
      kind={JoloTextKind.subtitle}
      size={JoloTextSizes.mini}
      color={Colors.white70}
      customStyles={{ paddingHorizontal: 10 }}
    >
      {children}
    </JoloText>
  )
}

const styles = StyleSheet.create({
  fullScreen: {
    width: '100%',
    height: '100%',
  },
  tapArea: {
    flex: 1,
  },
  interactionBody: {
    flex: 0,
    alignItems: 'center',
  },
  btnGroupContainer: {
    width: '100%',
    flexDirection: 'row',
  },
  btnContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtn: {
    borderWidth: 2,
    borderColor: Colors.borderGray20,
    borderRadius: 8,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
})
