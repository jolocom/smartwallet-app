import React from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { NavigationSection } from '../errors/components/navigationSection'
import { ThunkDispatch } from 'src/store'
import { navigationActions } from 'src/actions'
import { connect } from 'react-redux'
import { Wrapper } from '../structure'
import { privacyPolicyEN, privacyPolicyDE } from './legalTexts'
import { fontMain } from 'src/styles/typography'
import { RootState } from 'src/reducers'
import I18n from 'src/locales/i18n'
import strings from 'src/locales/strings'

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps> {}

const PrivacyPolicyContainer: React.FC<Props> = ({
  navigateBack,
  language,
}) => {
  const privacyText = language === 'en' ? privacyPolicyEN : privacyPolicyDE

  return (
    <Wrapper style={{ backgroundColor: 'rgb(32,26,33)' }}>
      <NavigationSection onNavigation={navigateBack} isBackButton={true} />
      <View style={styles.wrapper}>
        <Text style={styles.header}>{I18n.t(strings.PRIVACY_POLICY)}</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.text}>{privacyText}</Text>
        </ScrollView>
      </View>
    </Wrapper>
  )
}

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  navigateBack: () => dispatch(navigationActions.navigateBack()),
})

const mapStateToProps = (state: RootState) => ({
  language: state.settings.locale,
})

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    fontFamily: fontMain,
    fontSize: 28,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 32,
    letterSpacing: 0,
    color: 'rgba(255,255,255,0.9)',
    marginVertical: 16,
  },
  text: {
    fontFamily: fontMain,
    fontSize: 20,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0.14,
    color: 'rgba(255, 255, 255, 0.4)',
  },
})

export const PrivacyPolicy = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PrivacyPolicyContainer)
