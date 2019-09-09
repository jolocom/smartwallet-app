import React from 'react'
import { connect } from 'react-redux'
import VersionNumber from 'react-native-version-number'
import { locales } from 'src/locales/i18n'

import { SettingsScreen } from '../components/settings'
import { genericActions, navigationActions } from 'src/actions'
import { ThunkDispatch } from '../../../store'
import { withErrorScreen, withLoading } from '../../../actions/modifiers'
import { showSeedPhrase } from '../../../actions/recovery'
import settingKeys from '../settingKeys'
import { routeList } from '../../../routeList'

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps> {}

export class SettingsContainer extends React.Component<Props> {
  public render() {
    const { settings, setLocale, setupBackup, socialRecovery } = this.props
    return (
      <SettingsScreen
        settings={settings}
        setLocale={setLocale}
        locales={locales}
        version={VersionNumber.appVersion}
        setupBackup={setupBackup}
        setupSocialRecovery={() =>
          socialRecovery(this.props.settings[settingKeys.shardsCreated])
        }
      />
    )
  }
}

const mapStateToProps = (state: any) => ({
  settings: state.settings,
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  setLocale: (locale: string) =>
    dispatch(withLoading(genericActions.setLocale(locale))),
  setupBackup: () => dispatch(withErrorScreen(showSeedPhrase())),
  socialRecovery: (shardsCreated: boolean) =>
    dispatch(navigationActions.navigate({
      routeName: shardsCreated
        ? routeList.SocialRecovery
        : routeList.InitSocialRecovery,
    })),
})

export const Settings = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsContainer)
