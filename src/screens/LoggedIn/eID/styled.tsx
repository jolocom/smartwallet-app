import React, { Children } from 'react'
import { Linking, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { InitiatorPlaceholderIcon } from '~/assets/svg'
import Btn, { BtnSize, BtnTypes } from '~/components/Btn'
import JoloText, {
  IJoloTextProps,
  JoloTextKind,
  JoloTextWeight,
} from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import ScreenDismissArea from '~/components/ScreenDismissArea'
import { ContainerBAS } from '~/screens/Modals/Interaction/InteractionFlow/components/styled'
import { Colors } from '~/utils/colors'

export const AusweisBottomSheet: React.FC<{
  onDismiss?: () => void
  backgroundColor?: Colors
  customContainerStyles?: StyleProp<ViewStyle>
}> = ({
  children,
  onDismiss = () => {},
  backgroundColor = Colors.codGrey,
  customContainerStyles = {},
}) => {
  return (
    <View style={styles.fullScreen}>
      <ScreenDismissArea onDismiss={onDismiss} />
      <View style={styles.interactionBody}>
        <ContainerBAS
          customStyles={[customContainerStyles, { backgroundColor }]}
        >
          {children}
        </ContainerBAS>
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
        <Btn
          size={BtnSize.medium}
          onPress={onSubmit}
          withoutMargins
          testID="ausweis-cta-btn"
        >
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
          testID="ausweis-ignore-btn"
        >
          {cancelLabel}
        </Btn>
      </View>
    </View>
  )
}

export const AusweisLogo: React.FC = () => {
  return (
    <View
      testID="ausweis-logo"
      style={[styles.image, { backgroundColor: Colors.white }]}
    >
      <InitiatorPlaceholderIcon />
    </View>
  )
}

export const AusweisHeaderDescription: React.FC = ({ children }) => {
  return (
    <JoloText
      kind={JoloTextKind.subtitle}
      size={JoloTextSizes.mini}
      color={Colors.white90}
      customStyles={{ paddingHorizontal: 10, opacity: 0.7 }}
    >
      {children}
    </JoloText>
  )
}

export const AusweisTextLink: React.FC<{ url: string } & IJoloTextProps> = ({
  url,
  customStyles,
  ...textProps
}) => {
  return (
    <JoloText
      {...textProps}
      customStyles={[customStyles, { textDecorationLine: 'underline' }]}
      onPress={() => Linking.openURL(url)}
    >
      {url}
    </JoloText>
  )
}

export const AusweisListSection: React.FC<{ title: string }> = ({
  title,
  children,
}) => {
  if (!Children.count(children)) return null
  return (
    <View testID="ausweis-list-section" style={{ marginBottom: 72 }}>
      <View style={{ marginLeft: 8 }}>
        <JoloText
          kind={JoloTextKind.title}
          size={JoloTextSizes.mini}
          color={Colors.white50}
          weight={JoloTextWeight.medium}
          customStyles={{
            textAlign: 'left',
            marginBottom: 16,
          }}
        >
          {title}
        </JoloText>
      </View>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  fullScreen: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.black65,
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
