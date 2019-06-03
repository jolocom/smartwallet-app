import React from 'react'
import { connect } from 'react-redux'
import VersionNumber from 'react-native-version-number'
import { locales } from 'src/locales/i18n'

import { SettingsScreen } from '../components/settings'
import { genericActions } from 'src/actions'
import {ThunkDispatch} from '../../../store'

interface Props extends ReturnType<typeof mapDispatchToProps>, ReturnType<typeof mapStateToProps> {}

export class SettingsContainer extends React.Component<Props> {
  render() {
    return (
      <SettingsScreen
        settings={this.props.settings}
        setLocale={this.props.setLocale}
        locales={locales}
        version={VersionNumber.appVersion}
      />
    )
  }
}

const mapStateToProps = (state: any) => ({
  settings: state.settings,
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  setLocale: (locale: string) => dispatch(genericActions.setLocale(locale)),
})

export const Settings = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsContainer)
