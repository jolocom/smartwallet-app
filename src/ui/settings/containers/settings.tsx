import React from 'react'
import { connect } from 'react-redux'
import VersionNumber from 'react-native-version-number'
import { locales } from 'src/locales/i18n'

import { SettingsScreen } from '../components/settings'
import { genericActions } from 'src/actions'
import { ThunkDispatch } from '../../../store'
import { withLoading } from '../../../actions/modifiers'
import { toggleLoading } from '../../../actions/account'
import { showSeedPhrase } from '../../../actions/recovery/recovery'

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps> {}

export class SettingsContainer extends React.Component<Props> {
  render() {
    return (
      <SettingsScreen
        settings={this.props.settings}
        setLocale={this.props.setLocale}
        locales={locales}
        version={VersionNumber.appVersion}
        setupBackup={this.props.setupBackup}
      />
    )
  }
}

const mapStateToProps = (state: any) => ({
  settings: state.settings,
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  setLocale: (locale: string) =>
    dispatch(withLoading(toggleLoading)(genericActions.setLocale(locale))),
  // TODO add error handling
  setupBackup: () => dispatch(showSeedPhrase()),
})

export const Settings = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsContainer)
