import React from 'react'
import { Container } from '../../structure'
import { StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native'
import { Scanner } from './scanner'
import { NavigationScreenProps } from 'react-navigation'
import { white } from '../../../styles/colors'
import { ThunkDispatch } from '../../../store'
import { connect } from 'react-redux'
import { CloseIcon } from '../../../resources'
import { fontMain, textXXS } from '../../../styles/typography'
import { Colors } from '../../../styles'
import { navigatorResetHome } from '../../../actions/navigation'

const IS_IOS = Platform.OS === 'ios'

const styles = StyleSheet.create({
  iconWrapper: {
    width: 60,
    height: 60,
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  text: {
    fontFamily: fontMain,
    fontSize: textXXS,
    color: white,
    position: 'absolute',
    bottom: 0,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 2,
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
    NavigationScreenProps {}

const InteractionContainer = (props: Props) => (
  <React.Fragment>
    <StatusBar hidden />
    <Container style={{ backgroundColor: Colors.greyDark }}>
      {IS_IOS && (
        <TouchableOpacity
          onPress={props.navigateHome}
          style={styles.closeButton}
        >
          <CloseIcon />
        </TouchableOpacity>
      )}
      <Scanner navigation={props.navigation} />
    </Container>
  </React.Fragment>
)

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  navigateHome: () => dispatch(navigatorResetHome()),
})

export const InteractionScreen = connect(
  null,
  mapDispatchToProps,
)(InteractionContainer)
