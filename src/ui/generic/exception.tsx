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
    color: JolocomTheme.textStyles.headline.color,
    fontSize: 10
  }
})

export const Exception : React.SFC<Props> = (props) => {
  const { errorMessage, stackTrace } = props.navigation.state.params
  const defaultErrorMessage = 'No further details are available :('
  const abbreviatedStack = stackTrace ? `${stackTrace.substring(0, 800)}...` : ''

  return(
    <Container>
      <Header title='CATASTROPHIC FAILURE'/>
      <Block flex={ 0.2 }>
        <CenteredText msg={ errorMessage ? errorMessage : defaultErrorMessage }/>
      </Block>
      <Block flex={ 0.4 }>
        <Text style={ styles.stackTrace }>
          {abbreviatedStack}
        </Text>
      </Block>
      <Block flex={ 0.2 }>
        <CenteredText msg='Please try to restart the application!' />
      </Block>
    </Container>
  )
}
