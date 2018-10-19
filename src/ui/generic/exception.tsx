import React from 'react'
import { RootState } from 'src/reducers/'
import { connect } from 'react-redux'
import { Container, Block} from 'src/ui/structure/'
import { Button } from 'react-native-material-ui'
import { registrationActions } from 'src/actions/'
import { Text, StyleSheet } from 'react-native'
import { JolocomTheme } from 'src/styles/jolocom-theme'


interface ConnectProps {
  startRegistration: () => void
}
interface Props extends ConnectProps {
  navigation: {
    state: {
      // params: {
      //   errorMessage: string
      //   errorText: string
      // }
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

  const errorText = 'There was an error with your request.'

  return(
    <Container style={ styles.containerStyle }>
      <Block style={ styles.textBlock }>
        <Text style={ styles.errorTextHeader }>Oops!</Text>
        <Text style={ styles.errorText }> { errorText } </Text>
      </Block>
      <Block style={ styles.buttonBlock}>
          <Button
            raised
            onPress={ props.startRegistration }
            style={{
              container: styles.buttonContainer,
              text: styles.buttonText
            }}
            upperCase= { false }
            text='Try again'
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
  }
}

export const Exception = connect(mapStateToProps, mapDispatchToProps)(ExceptionComponent)