import React from 'react'
import { View, StyleSheet } from 'react-native'

import Btn, { BtnTypes, BtnSize } from '~/components/Btn'
import { Colors } from '~/utils/colors'
import { useLoader } from '~/hooks/loader'
import { useFinishInteraction } from '~/hooks/interactions/handlers'
import useConnection from '~/hooks/connection'
import useTranslation from '~/hooks/useTranslation'

interface Props {
  submitLabel: string
  onSubmit: () => Promise<void> | void
  onCancel?: () => void
  disabled?: boolean
  disableLoader?: boolean
}

// TODO: add logic for disabling buttons
const InteractionFooter: React.FC<Props> = ({
  submitLabel,
  onSubmit,
  onCancel,
  disabled = false,
  disableLoader = false,
}) => {
  const { t } = useTranslation()
  const loader = useLoader()
  const { clearInteraction, closeInteraction } = useFinishInteraction()
  const { connected } = useConnection()

  const handleSubmit = async () => {
    if (disableLoader) return onSubmit()
    await loader(
      async () => {
        await onSubmit()
      },
      { showSuccess: false, showFailed: false },
    )
  }

  const handleCancel = () => {
    clearInteraction()
    closeInteraction()
  }

  return (
    <>
      <View style={styles.container}>
        <View style={[styles.btnContainer, { flex: 0.7, marginRight: 12 }]}>
          <Btn
            disabled={!connected || disabled}
            size={BtnSize.medium}
            onPress={handleSubmit}
            withoutMargins
          >
            {submitLabel}
          </Btn>
        </View>
        <View style={[styles.btnContainer, { flex: 0.3 }]}>
          <Btn
            size={BtnSize.medium}
            type={BtnTypes.secondary}
            onPress={onCancel ? onCancel : handleCancel}
            customContainerStyles={styles.cancelBtn}
            withoutMargins
          >
            {t('Interaction.cancelBtn')}
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

export default InteractionFooter
