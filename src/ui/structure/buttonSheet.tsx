import React from 'react'
import { ActionSheet } from './actionSheet'
import I18n from 'src/locales/i18n'
import { View, StyleSheet } from 'react-native'
import { JolocomButton } from './'
import strings from 'src/locales/strings'
import { fontMedium } from 'src/styles/typography'

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
  },
  confirm: {
    flex: 2,
  },
  cancel: {
    flex: 1,
  },
  confirmText: {
    fontFamily: fontMedium,
  },
})

interface Props {
  show?: boolean
  onConfirm: () => void
  onCancel: () => void
  disabledConfirm?: boolean
}

export const ButtonSheet = ({
  show = true,
  onConfirm,
  onCancel,
  disabledConfirm,
}: Props) => {
  return (
    <ActionSheet showSlide={show}>
      <View style={styles.wrapper}>
        <JolocomButton
          textStyle={styles.confirmText}
          containerStyle={styles.confirm}
          disabled={!!disabledConfirm}
          onPress={onConfirm}
          text={I18n.t(strings.SAVE)}
        />
        <JolocomButton
          containerStyle={styles.cancel}
          onPress={onCancel}
          text={I18n.t(strings.CANCEL)}
          transparent
        />
      </View>
    </ActionSheet>
  )
}
