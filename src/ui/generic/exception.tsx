import React from 'react'
import { RootState } from 'src/reducers/'
import { connect } from 'react-redux'
import { Container, Block} from 'src/ui/structure/'
import { Button } from 'react-native-material-ui'
import { registrationActions, navigationActions } from 'src/actions/'
import { Text, StyleSheet } from 'react-native'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { routeList } from 'src/routeList'
import I18n from 'src/locales/i18n';


interface ConnectProps {
  startRegistration: () => void
  renderHome: () => void
}

interface Props extends ConnectProps {
  navigation: {
    state: {
      params: {
        flag: string
      }
    }
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: JolocomTheme.primaryColorBlack,
    display: 'flex'
  },
  textBlock: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorTextHeader: {
    textAlign: 'center',
    color: JolocomTheme.primaryColorSand,
    fontSize: 28,
    fontFamily: JolocomTheme.contentFontFamily
  },
  errorText: {
    textAlign: 'center',
    color: JolocomTheme.primaryColorSand,
    fontSize: 18,
    fontFamily: JolocomTheme.contentFontFamily
  },
  buttonBlock: {
    flex: 0.1,
    backgroundColor: JolocomTheme.primaryColorBlack
  },
  buttonContainer: {
    height: '100%',
    width: '50%',
    borderRadius: 4,
    backgroundColor: JolocomTheme.primaryColorPurple
  },
  buttonText: {
    fontFamily: JolocomTheme.contentFontFamily,
    color: JolocomTheme.primaryColorWhite,
    fontSize: JolocomTheme.headerFontSize,
    fontWeight: "100"
  }
})

export const ExceptionComponent: React.SFC<Props> = (props) => {
  const errorText = I18n.t('There was an error with your request.')

  return(
    <Container style={ styles.containerStyle }>
      <Block style={ styles.textBlock }>
        <Text style={ styles.errorTextHeader }>{ I18n.t('Oops!') }</Text>
        <Text style={ styles.errorText }> { I18n.t(errorText) } </Text>
      </Block>
      <Block style={ styles.buttonBlock}>
          <Button
            raised
            onPress={
              props.navigation.state.params.flag === 'registration'
              ? props.startRegistration
              : props.renderHome
            }
            style={{
              container: styles.buttonContainer,
              text: styles.buttonText
            }}
            upperCase= { false }
            text={ I18n.t('Try again') }
          />
        </Block>
    </Container>
  )
}

const mapStateToProps = (state: RootState) => {
  return {}
}

const mapDispatchToProps = (dispatch: Function) => {
  return {
    startRegistration: () => dispatch(registrationActions. startRegistration()),
    renderHome: () => dispatch(navigationActions.navigatorReset({ routeName: routeList.Home }))
  }
}

export const Exception = connect(mapStateToProps, mapDispatchToProps)(ExceptionComponent)
