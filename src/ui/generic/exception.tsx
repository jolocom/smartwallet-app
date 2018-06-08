import React from 'react'
import { Container, CenteredText, Header, Block} from 'src/ui/structure/'
import { Text, StyleSheet } from 'react-native'
import { JolocomTheme } from 'src/styles/jolocom-theme'

interface Props {
  navigation: {
    state: {
      params: {
        errorMessage: string
        stackTrace: string
      }
    }
  }
}

const styles = StyleSheet.create({
  stackTrace: {
    color: JolocomTheme.primaryColorBlack,
    fontSize: 10,
    fontFamily: JolocomTheme.contentFontFamily
  }
})

export const Exception : React.SFC<Props> = (props) => {
  const { errorMessage, stackTrace } = props.navigation.state.params
  const defaultErrorMessage = 'No further details are available :('
  const defaultStackTraceMsg = 'No stack trace available :('

  const abbreviatedErrMsg = errorMessage
    ? `${errorMessage.substring(0, 100)}...`
    : defaultErrorMessage
    const abbreviatedStack = stackTrace
      ? `${stackTrace.substring(0, 800)}...`
      : defaultStackTraceMsg

  return(
    <Container>
      <Header title='CATASTROPHIC FAILURE'/>
      <Block flex={ 0.2 }>
        <CenteredText msg={ abbreviatedErrMsg }/>
      </Block>
      <Block flex={ 0.4 }>
        <Text style={ styles.stackTrace }>
          { abbreviatedStack }
        </Text>
      </Block>
      <Block flex={ 0.2 }>
        <CenteredText msg='Please try to restart the application!' />
      </Block>
    </Container>
  )
}
