import React from 'react'
import { connect } from 'react-redux'
import VersionNumber from 'react-native-version-number'
import { locales } from 'src/locales/i18n'

import { SettingsScreen } from '../components/settings'
import { genericActions, navigationActions } from 'src/actions'
import { ThunkDispatch } from '../../../store'
import { routeList } from 'src/routeList'
import { withErrorScreen, withLoading } from '../../../actions/modifiers'
import { showSeedPhrase } from '../../../actions/recovery'

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps> {}

export class SettingsContainer extends React.Component<Props> {
  public render() {
    return (
      <SettingsScreen
        settings={this.props.settings}
        setLocale={this.props.setLocale}
        locales={locales}
        version={VersionNumber.appVersion}
        openStorybook={this.props.openStorybook}
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
    dispatch(withLoading(genericActions.setLocale(locale))),
  openStorybook: () =>
    dispatch(
      navigationActions.navigate({
        routeName: routeList.Storybook,
      }),
    ),
  setupBackup: () => dispatch(withErrorScreen(showSeedPhrase())),
})

export const Settings = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsContainer)
