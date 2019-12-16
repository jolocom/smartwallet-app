import React from 'react'
import VersionNumber from 'react-native-version-number'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import I18n, { locales } from 'src/locales/i18n'
import strings from '../../../locales/strings'
import { Colors, Spacing, Typography } from 'src/styles'
import { Container } from 'src/ui/structure'
import { SettingSection } from '../components/settingSection'
import { RootState } from '../../../reducers'
import { ThunkDispatch } from '../../../store'
import { routeList } from 'src/routeList'
import { withErrorScreen, withLoading } from '../../../actions/modifiers'
import { genericActions, navigationActions } from '../../../actions'
import { connect } from 'react-redux'
import { LocaleSetting } from '../components/localeSetting'
import SettingItem from '../components/settingItem'
import settingKeys from '../settingKeys'
import { showSeedPhrase } from '../../../actions/recovery'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundLightMain,
  },
  scrollComponent: {
    width: '100%',
  },
  scrollComponentContainer: {
    paddingBottom: Spacing.XXL,
  },
  versionNumber: {
    ...Typography.baseFontStyles,
    fontSize: Typography.textXS,
    textAlign: 'center',
    color: Colors.blackMain040,
    marginTop: Spacing.XL,
  },
})

interface Props
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {}

export const SettingsContainer: React.FC<Props> = props => {
  const {
    setLocale,
    settings,
    setupBackup,
    openStorybook,
    editBackup,
    openErrorScreen,
  } = props
  const version = VersionNumber.appVersion
  const currentLocale = settings.locale
  const seedPhraseSaved = settings[settingKeys.seedPhraseSaved] as boolean
  return (
    <Container style={styles.container}>
      <ScrollView
        style={styles.scrollComponent}
        contentContainerStyle={styles.scrollComponentContainer}
      >
        {__DEV__ && (
          <SettingSection title={'Dev'}>
            <SettingItem
              iconName={'book-open-page-variant'}
              title={'Storybook'}
              onPress={openStorybook}
            />
            <SettingItem
              title={'Error report Test'}
              description={'Exception Screen'}
              iconName={'alert'}
              onPress={openErrorScreen}
            />
          </SettingSection>
        )}
        <SettingSection title={I18n.t(strings.YOUR_PREFERENCES)}>
          <LocaleSetting
            locales={locales}
            currentLocale={currentLocale}
            setLocale={setLocale}
          />
        </SettingSection>
        <SettingSection title={I18n.t(strings.SECURITY)}>
          <SettingItem
            title={I18n.t(strings.BACKUP_YOUR_IDENTITY)}
            iconName={'flash'}
            description={
              seedPhraseSaved
                ? I18n.t(strings.YOUR_IDENTITY_IS_ALREADY_BACKED_UP)
                : I18n.t(
                    strings.SET_UP_A_SECURE_PHRASE_TO_RECOVER_YOUR_ACCOUNT_IN_THE_FUTURE_IF_YOUR_PHONE_IS_STOLEN_OR_IS_DAMAGED,
                  )
            }
            isHighlighted={!seedPhraseSaved}
            isDisabled={seedPhraseSaved}
            onPress={setupBackup}
          />

          <SettingItem
            title={'Backup'}
            description={'Securely backup your data'}
            iconName={'delete'}
            onPress={editBackup}
          />
        </SettingSection>
        <Text style={styles.versionNumber}>
          Jolocom SmartWallet {I18n.t(strings.VERSION)} {version}
        </Text>
        <View />
      </ScrollView>
    </Container>
  )
}

const mapStateToProps = (state: RootState) => ({
  settings: state.settings,
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  setLocale: (locale: string) =>
    dispatch(withLoading(genericActions.setLocale(locale))),
  openStorybook: () =>
    dispatch(
      navigationActions.navigate({
        routeName: routeList.Storybook,
      }),
    ),
  setupBackup: () => dispatch(withErrorScreen(showSeedPhrase())),
  editBackup: () =>
    dispatch(
      withErrorScreen(
        navigationActions.navigate({
          routeName: routeList.Backup,
        }),
      ),
    ),
  openErrorScreen: () =>
    dispatch(
      navigationActions.navigate({
        routeName: routeList.Exception,
        params: { error: new Error('Test Error') },
      }),
    ),
})

export const Settings = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsContainer)
