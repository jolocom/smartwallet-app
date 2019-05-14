import React from 'react'
import { connect } from 'react-redux'
import { Container, Block } from 'src/ui/structure/'
import { Button } from 'react-native-material-ui'
import { navigationActions } from 'src/actions/'
import { Text, StyleSheet } from 'react-native'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { routeList } from 'src/routeList'
import I18n from 'src/locales/i18n'
import { AppError } from 'src/lib/errors'

interface ConnectProps {
  navigateBack: (routeName: routeList) => void
}

interface Props extends ConnectProps {
  navigation: {
    state: {
      params: {
        returnTo: routeList
        error: Error & AppError
      }
    }
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: JolocomTheme.primaryColorBlack,
    display: 'flex',
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
    fontFamily: JolocomTheme.contentFontFamily,
  },
  errorText: {
    textAlign: 'center',
    color: JolocomTheme.primaryColorSand,
    fontSize: 18,
    fontFamily: JolocomTheme.contentFontFamily,
  },
  buttonBlock: {
    flex: 0.1,
    backgroundColor: JolocomTheme.primaryColorBlack,
  },
  buttonContainer: {
    height: '100%',
    width: '50%',
    borderRadius: 4,
    backgroundColor: JolocomTheme.primaryColorPurple,
  },
  buttonText: {
    paddingVertical: 20,
    fontFamily: JolocomTheme.contentFontFamily,
    color: JolocomTheme.primaryColorWhite,
    fontSize: JolocomTheme.headerFontSize,
    fontWeight: '100',
  },
})

export const ExceptionComponent: React.SFC<Props> = props => {
  // TODO: display error code
  const err = props.navigation.state.params.error
  let errorText: string = err && err.message
  if (!errorText)
    errorText = "There was an error with your request"
  errorText = I18n.t(errorText) + '.'
  console.error(err && err.origError ? err.origError : err)

  return (
    <Container style={styles.containerStyle}>
      <Block style={styles.textBlock}>
        <Text style={styles.errorTextHeader}>{I18n.t('Oops!')}</Text>
        <Text style={styles.errorText}> {errorText} </Text>
      </Block>
      <Block style={styles.buttonBlock}>
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
          text={I18n.t('Try again')}
        />
      </Block>
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
