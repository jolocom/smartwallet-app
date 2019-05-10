import React from 'react'
import { connect } from 'react-redux'
import { Container } from 'src/ui/structure/'
import { Button } from 'react-native-material-ui'
import { navigationActions } from 'src/actions/'
import { Text, StyleSheet, View, Image } from 'react-native'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { routeList } from 'src/routeList'
import I18n from 'src/locales/i18n'
const errorImage = require('src/resources/img/error_image.png')

const ERROR_MESSAGES = [I18n.t('Damn!'), I18n.t('Oh no.'), I18n.t('Uh oh.')]

function getRandomErrorTitle() {
  const length = ERROR_MESSAGES.length
  const randomNum = Math.floor(Math.random() * length)
  return ERROR_MESSAGES[randomNum]
}

interface ConnectProps {
  navigateBack: (routeName: routeList) => void
}

interface Props extends ConnectProps {
  navigation: {
    state: {
      params: {
        returnTo: routeList
        error: Error
      }
    }
  }
}

const debug = {
  // borderColor: 'red',
  // borderWidth: 1,
}

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: JolocomTheme.primaryColorBlack,
    justifyContent: 'space-around',
  },
  upperContainer: {
    ...debug,
    marginTop: 85,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  imagePlaceholder: {
    backgroundColor: 'grey',
    width: 160,
    height: 160,
  },
  textBlock: {
    ...debug,
    marginTop: 25,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  errorTextHeader: {
    textAlign: 'center',
    color: JolocomTheme.primaryColorSand,
    fontSize: JolocomTheme.landingHeaderFontSize,
    fontFamily: JolocomTheme.contentFontFamily,
  },
  errorText: {
    ...debug,
    marginTop: 15,
    textAlign: 'center',
    color: JolocomTheme.primaryColorSand,
    fontSize: JolocomTheme.labelFontSize,
    fontFamily: JolocomTheme.contentFontFamily,
  },
  buttonBlock: {
    // flex: 0.1,
    ...debug,
    marginTop: 20,
    backgroundColor: JolocomTheme.primaryColorBlack,
  },
  buttonContainer: {
    ...debug,
    height: 48,
    borderRadius: 4,
    backgroundColor: JolocomTheme.primaryColorPurple,
  },
  buttonText: {
    ...debug,
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontFamily: JolocomTheme.contentFontFamily,
    color: JolocomTheme.primaryColorWhite,
    fontSize: JolocomTheme.headerFontSize,
    fontWeight: '100',
  },
})

export const ExceptionComponent: React.SFC<Props> = props => {
  // const errorText = I18n.t('There was an error with your request') + '.'
  const errorText = props.navigation.state.params.error.message
  console.error(props.navigation.state.params.error)

  return (
    <Container style={styles.containerStyle}>
      <View style={styles.upperContainer}>
        <Image source={errorImage} style={{ width: 160, height: 160 }} />
        <View style={styles.textBlock}>
          <Text style={styles.errorTextHeader}>{getRandomErrorTitle()}</Text>
          {/* <Text style={styles.errorText}>{errorText}</Text> */}
          <Text style={styles.errorText}>
            An error message that is really, really, really long, but hopefully
            only goes onto three lines and not four or five? These may be fairly
            cryptic, kind of.
          </Text>
        </View>
      </View>
      <View style={styles.buttonBlock}>
        <Button
          raised
          onPress={() =>
            props.navigateBack(props.navigation.state.params.returnTo)
          }
          style={{
            container: styles.buttonContainer,
            text: styles.buttonText,
          }}
          upperCase={false}
          text={I18n.t('Go back')}
        />
      </View>
    </Container>
  )
}

const mapStateToProps = () => ({})

const mapDispatchToProps = (dispatch: Function) => ({
  navigateBack: (routeName: routeList) =>
    dispatch(navigationActions.navigatorReset({ routeName })),
})

export const Exception = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExceptionComponent)
