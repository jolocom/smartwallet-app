import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useSafeArea } from 'react-native-safe-area-context'

import BtnGroup, { BtnsAlignment } from '~/components/BtnGroup'
import Btn, { BtnTypes, BtnSize } from '~/components/Btn'
import { strings } from '~/translations/strings'
import { Colors } from '~/utils/colors'
import AbsoluteBottom from '~/components/AbsoluteBottom'
import { useLoader } from '~/hooks/loader'
import { useFinishInteraction } from '~/hooks/interactions'

export const FooterContainer: React.FC = ({ children }) => {
  const insets = useSafeArea()
  return (
    <AbsoluteBottom
      customStyles={{
        ...styles.FASfooter,
        paddingBottom: insets.bottom,
      }}
    >
      <View style={styles.FAScontainer}>{children}</View>
    </AbsoluteBottom>
  )
}

interface Props {
  onSubmit: () => Promise<any> | any
  cta: string
  disabled?: boolean
}

const InteractionFooter: React.FC<Props> = ({
  onSubmit,
  cta,
  disabled = false,
}) => {
  const loader = useLoader()
  const finishInteraction = useFinishInteraction()

  const handleSubmit = async () => {
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
      <BtnGroup alignment={BtnsAlignment.horizontal}>
        <View style={[styles.btnContainer, { flex: 0.7, marginRight: 12 }]}>
          <Btn
            disabled={disabled}
            size={BtnSize.medium}
            onPress={handleSubmit}
            withoutMargins
          >
            {cta}
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
      </BtnGroup>
    </>
  )
}

const styles = StyleSheet.create({
  FASfooter: {
    bottom: 0,
    height: 106,
    paddingTop: 25,
    backgroundColor: Colors.black,
    justifyContent: 'flex-start',
    borderTopRightRadius: 22,
    borderTopLeftRadius: 22,
    shadowColor: Colors.black30,
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowRadius: 7,
    shadowOpacity: 1,
    elevation: 10,
  },
  FAScontainer: {
    paddingHorizontal: '5%',
    alignItems: 'center',
    justifyContent: 'center',
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
