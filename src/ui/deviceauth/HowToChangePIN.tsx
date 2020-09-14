import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'

import I18n from 'src/locales/i18n'

import ScreenContainer from './components/ScreenContainer'
import Header from './components/Header'
import Paragraph, { ParagraphSizes } from './components/Paragraph'
import Btn, { BtnTypes } from './components/Btn'
import AbsoluteBottom from './components/AbsoluteBottom'
import strings from 'src/locales/strings'
import { ThunkDispatch } from 'src/store'
import { Colors } from './colors'
import LocalModal from './LocalModal'
import { RootState } from 'src/reducers'
import { BP } from '../../styles/breakpoints'
import { accountActions, navigationActions } from 'src/actions'
import { routeList } from 'src/routeList'
import RecoveryInstructions from 'src/resources/svg/ForgotPINInstructions'

interface PropsI {
  handleGoBack: () => void
  handleAccessRestore: () => void
}
const HowToChangePIN: React.FC<PropsI> = ({
  handleGoBack,
  handleAccessRestore,
}) => {
  return (
    <LocalModal isVisible>
      <ScreenContainer
        customStyles={{
          backgroundColor: Colors.black,
          justifyContent: 'flex-start',
          paddingTop: BP({ small: 30, medium: 50, large: 50 }),
          paddingHorizontal: 20,
        }}>
        <Header
          color={Colors.white90}
          customStyles={{
            fontSize: BP({ small: 24, medium: 28, large: 28 }),
            alignSelf: 'flex-start',
          }}>
          {I18n.t(strings.HOW_TO_CHANGE_PIN)}
        </Header>
        <Paragraph
          color={Colors.white80}
          customStyles={{
            alignSelf: 'flex-start',
            textAlign: 'left',
            lineHeight: 17,
          }}>
          {I18n.t(strings.WE_ARE_SORRY_THAT_YOU_FORGOT)}
        </Paragraph>
        <Paragraph
          color={Colors.white80}
          customStyles={{
            alignSelf: 'flex-start',
            textAlign: 'left',
            lineHeight: 17,
            marginTop: 10,
          }}>
          {I18n.t(strings.YOU_CAN_CHANGE_PIN)}
        </Paragraph>
        <View
          style={{
            transform: [{ scale: BP({ small: 0.75, medium: 1, large: 1 }) }],
            position: 'absolute',
            bottom: BP({ small: -70, medium: -50, large: -50 }),
          }}>
          <RecoveryInstructions />
        </View>
        <AbsoluteBottom customStyles={{ alignSelf: 'center', bottom: 0 }}>
          <Btn onPress={handleAccessRestore}>
            {I18n.t(strings.RESTORE_ACCESS)}
          </Btn>
          <Paragraph
            size={ParagraphSizes.micro}
            color={Colors.white70}
            customStyles={{
              paddingHorizontal: BP({
                small: 10,
                medium: 25,
                large: 25,
              }),
              lineHeight: 15,
            }}>
            {I18n.t(strings.STORING_NO_AFFECT_DATA)}
          </Paragraph>
          <Btn onPress={handleGoBack} type={BtnTypes.secondary}>
            {I18n.t(strings.CANCEL)}
          </Btn>
        </AbsoluteBottom>
      </ScreenContainer>
    </LocalModal>
  )
}

const mapStateToProps = (state: RootState) => ({
  isLockVisible: state.account.appState.isLockVisible,
  isPINInstructionVisible: state.account.appState.isPINInstructionVisible,
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  handleGoBack: () => {
    dispatch(accountActions.closePINinstructions())
    dispatch(accountActions.openLock())
  },
  handleAccessRestore: () => {
    dispatch(accountActions.closePINinstructions())
    dispatch(
      navigationActions.navigate({
        routeName: routeList.InputSeedPhrasePin,
        params: { isPINrecovery: true },
      }),
    )
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(({ isPINInstructionVisible, handleGoBack, handleAccessRestore }) => {
  if (isPINInstructionVisible) {
    return (
      <HowToChangePIN
        handleGoBack={handleGoBack}
        handleAccessRestore={handleAccessRestore}
      />
    )
  }
  return null
})
