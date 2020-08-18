import React from 'react'
import { Image } from 'react-native'
import { connect } from 'react-redux'

import ScreenContainer from './components/ScreenContainer'
import Header from './components/Header'
import Paragraph from './components/Paragraph'
import Btn, { BtnTypes } from './components/Btn'
import AbsoluteBottom from './components/AbsoluteBottom'
import strings from 'src/locales/strings'
import { ThunkDispatch } from 'src/store'
import { Colors } from './colors'
import LocalModal from './LocalModal'
import { RootState } from 'src/reducers'
import BP from './utils/breakpoints'
import { accountActions, navigationActions } from 'src/actions'
import { routeList } from 'src/routeList'

const recoveryInstruction = require('src/resources/img/recoveryInstructions.png')

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
          paddingTop: 30,
          paddingHorizontal: 20,
        }}
      >
        <Header color={Colors.white90} customStyles={{ textAlign: 'left' }}>
          {strings.HOW_TO_CHANGE_PIN}
        </Header>
        <Paragraph
          color={Colors.white80}
          customStyles={{ alignSelf: 'flex-start', textAlign: 'left' }}
        >
          {strings.WE_ARE_SORRY_THAT_YOU_FORGOT}
        </Paragraph>
        <Paragraph
          color={Colors.white80}
          customStyles={{ alignSelf: 'flex-start', textAlign: 'left' }}
        >
          {strings.YOU_CAN_CHANGE_PIN}
        </Paragraph>
        <Image source={recoveryInstruction} />
        <AbsoluteBottom customStyles={{ alignSelf: 'center' }}>
          <Btn onPress={handleAccessRestore}>{strings.RESTORE_ACCESS}</Btn>
          <Paragraph
            color={Colors.white70}
            customStyles={{
              paddingHorizontal: BP({
                xsmall: 5,
                small: 5,
                medium: 10,
                large: 25,
              }),
            }}
          >
            {strings.STORING_NO_AFFECT_DATA}
          </Paragraph>
          <Btn onPress={handleGoBack} type={BtnTypes.secondary}>
            {strings.CANCEL}
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
        routeName: routeList.InputSeedPhrase,
        params: { isPINrestoration: true },
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
