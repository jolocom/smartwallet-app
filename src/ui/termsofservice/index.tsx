import React, { useState } from 'react'
import { Wrapper } from 'src/ui/structure/wrapper'
import {
  Text,
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { termsOfServiceDE } from './termsOfServiceDE'
import { termsOfServiceEN } from './termsOfServiceEN'
import { ThunkDispatch } from 'src/store'
import { storeTermsOfService } from 'src/actions/generic'
import { JolocomButton } from '../structure'
import { connect } from 'react-redux'
import { NavigationScreenProp, NavigationState } from 'react-navigation'
import { routeList } from 'src/routeList'
import { debug } from 'src/styles/presets'
import { fontMain } from 'src/styles/typography'

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
  const [accepted, setAccepted] = useState(false)

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
        <TouchableOpacity
          onPress={() => setAccepted(!accepted)}
          style={styles.acceptWrapper}
        >
          <View style={{ flex: 0.1 }}>
            <View
              style={[
                styles.checkboxBase,
                accepted ? styles.checkboxActive : styles.checkboxInactive,
              ]}
            />
          </View>
          <View style={{ paddingLeft: 20, flex: 0.9 }}>
            <Text style={styles.acceptText}>
              I understand and accept the Terms of Service and Privacy Policy
            </Text>
          </View>
        </TouchableOpacity>
        <JolocomButton
          text={'Accept new terms'}
          containerStyle={{ width: '100%' }}
          onPress={() => storeTermsConsent(nextRoute)}
          disabled={!accepted}
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
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
    borderRadius: 22,
  },
  checkboxBase: {
    width: 28,
    height: 28,
    borderRadius: 20,
  },
  acceptWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkboxActive: {
    backgroundColor: 'rgb(82, 81, 193)',
  },
  checkboxInactive: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  acceptText: {
    fontFamily: fontMain,
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: 'rgba(255,255,255,0.9)',
  },
})

export const TermsOfServiceConsent = connect(
  null,
  mapDispatchToProps,
)(TermsOfServiceComponent)
