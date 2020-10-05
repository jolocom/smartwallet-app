import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useDispatch } from 'react-redux'
import { useSafeArea } from 'react-native-safe-area-context'

import BtnGroup, { BtnsAlignment } from '~/components/BtnGroup'
import Btn, { BtnTypes, BtnSize } from '~/components/Btn'
import { resetInteraction } from '~/modules/interaction/actions'
import { strings } from '~/translations/strings'
import { Colors } from '~/utils/colors'
import AbsoluteBottom from '~/components/AbsoluteBottom'
import { useLoader } from '~/hooks/useLoader'
import { debugView } from '~/utils/dev'

export const FooterContainer: React.FC = ({ children }) => {
  const insets = useSafeArea()
  return (
    <AbsoluteBottom
      customStyles={{
        ...styles.FASfooter,
        bottom: insets.bottom + insets.top,
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
  const dispatch = useDispatch()
  const loader = useLoader()

  const handleSubmit = async () => {
    await loader(
      async () => {
        await onSubmit()
      },
      { showSuccess: false, showFailed: false },
    )
  }

  const handleCancel = () => {
    dispatch(resetInteraction())
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
  FAScontainer: {
    paddingHorizontal: '5%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  FASfooter: {
    height: 106,
    backgroundColor: Colors.black,
    justifyContent: 'center',
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
