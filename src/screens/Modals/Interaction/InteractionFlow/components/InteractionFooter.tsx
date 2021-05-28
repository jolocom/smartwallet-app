import React from 'react'
import { View, StyleSheet } from 'react-native'

import BtnGroup, { BtnsAlignment } from '~/components/BtnGroup'
import Btn, { BtnTypes, BtnSize } from '~/components/Btn'
import { strings } from '~/translations/strings'
import { Colors } from '~/utils/colors'
import { useLoader } from '~/hooks/loader'
import { useFinishInteraction } from '~/hooks/interactions/handlers'
import useConnection from '~/hooks/connection'

interface Props {
  onSubmit: () => Promise<any> | any
  disabled?: boolean
  disableLoader?: boolean
  submitLabel: string
}

// TODO: add logic for disabling buttons
const InteractionFooter: React.FC<Props> = ({
  onSubmit,
  disabled = false,
  disableLoader = false,
  submitLabel,
}) => {
  const loader = useLoader()
  const finishInteraction = useFinishInteraction()
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
    finishInteraction()
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
            onPress={handleCancel}
            customContainerStyles={styles.cancelBtn}
            withoutMargins
          >
            {strings.IGNORE}
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
