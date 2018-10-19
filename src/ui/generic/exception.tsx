import React from 'react'
import { Container, CenteredText, Header, Block} from 'src/ui/structure/'
import { Text, StyleSheet } from 'react-native'
import { JolocomTheme } from 'src/styles/jolocom-theme'

interface Props {
  navigation: {
    state: {
      params: {
        errorMessage: string
        errorText: string
      }
    }
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: JolocomTheme.primaryColorBlack
  },
  errorText: {
    textAlign: 'center',
    color: JolocomTheme.primaryColorSand,
    fontSize: 16,
    fontFamily: JolocomTheme.contentFontFamily
  }
})

export const Exception : React.SFC<Props> = (props) => {
  // const { errorMessage, stackTrace } = props.navigation.state.params
  // const defaultErrorMessage = 'No further details are available :('
  // const defaultStackTraceMsg = 'No stack trace available :('

  // const abbreviatedErrMsg = errorMessage
  //   ? `${errorMessage.substring(0, 100)}...`
  //   : defaultErrorMessage
  //   const abbreviatedStack = stackTrace
  //     ? `${stackTrace.substring(0, 800)}...`
  //     : defaultStackTraceMsg
  const errorText = 'There was an error with your request.'
  const errorText2 = 'Please try again.'

  return(
    <Container style={ styles.containerStyle }>
      <Header title='Oops!'/>
      <Block flex={ 0.2 }>
        <Text style={ styles.errorText }> { errorText } </Text>
        <Text style={ styles.errorText }> { errorText2 } </Text>
        {/* <CenteredText msg={ errorTextHeader }/> */}
      </Block>
      {/* <Block flex={ 0.4 }>
        <Text style={ styles.stackTrace }>
          { abbreviatedStack }
        </Text>
      </Block>
      <Block flex={ 0.2 }>
        <CenteredText msg='Please try to restart the application!' />
      </Block> */}
    </Container>
  )
}
