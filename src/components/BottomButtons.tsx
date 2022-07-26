import React from 'react'
import { StyleSheet, View } from 'react-native'
import useTranslation from '~/hooks/useTranslation'
import { Colors } from '~/utils/colors'
import Btn, { BtnSize, BtnTypes } from './Btn'

interface Props {
  onSubmit: () => void
  onCancel: () => void
  submitLabel: string
  cancelLabel?: string
  isSubmitDisabled?: boolean
}

export const BottomButtons: React.FC<Props> = ({
  onSubmit,
  onCancel,
  submitLabel,
  cancelLabel,
  isSubmitDisabled,
}) => {
  const { t } = useTranslation()

  return (
    <>
      <View style={styles.container}>
        <View style={[styles.btnContainer, { flex: 0.7, marginRight: 12 }]}>
          <Btn
            disabled={isSubmitDisabled ?? false}
            size={BtnSize.medium}
            onPress={onSubmit}
            withoutMargins
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
          >
            {cancelLabel ?? t('Interaction.cancelBtn')}
          </Btn>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
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
})
