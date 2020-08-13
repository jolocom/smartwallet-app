import React from 'react'
import { Wrapper } from 'src/ui/structure/wrapper'
import { Text, ScrollView, View, StyleSheet } from 'react-native'
import { termsOfServiceDE } from './termsOfServiceDE'
import { termsOfServiceEN } from './termsOfServiceEN'
import { ThunkDispatch } from 'src/store'
import { storeTermsOfService } from 'src/actions/generic'
import { JolocomButton } from '../structure'
import { connect } from 'react-redux'
import { NavigationScreenProp, NavigationState } from 'react-navigation'
import { routeList } from 'src/routeList'

interface NavigationProps {
  nextRoute: routeList
}

interface Props extends ReturnType<typeof mapDispatchToProps> {
  navigation: NavigationScreenProp<NavigationState, NavigationProps>
}

const TermsOfServiceComponent: React.FC<Props> = ({
  storeTermsConsent,
  navigation,
}) => {
  const {
    state: {
      params: { nextRoute },
    },
  } = navigation
  return (
    <Wrapper>
      <View>
        <Text>
          SmartWallet introducing Terms and Conditions and Privacy Policy
        </Text>
        <Text>
          You can find the German and English version of the documents below.
          Please note that the German version is legally binding
        </Text>
      </View>
      <View style={{ flex: 3 }}>
        <ScrollView>
          <Text>{termsOfServiceEN}</Text>
        </ScrollView>
      </View>
      <View style={styles.bottomBar}>
        <JolocomButton
          text={'Accept new terms'}
          onPress={() => storeTermsConsent(nextRoute)}
        />
      </View>
    </Wrapper>
  )
}

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  storeTermsConsent: (nextRoute: routeList) =>
    dispatch(storeTermsOfService(nextRoute)),
})

const styles = StyleSheet.create({
  bottomBar: {
    height: 160,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgb(11, 3,13)',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export const TermsOfServiceConsent = connect(
  null,
  mapDispatchToProps,
)(TermsOfServiceComponent)
