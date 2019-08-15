import React from 'react'
import { connect } from 'react-redux'
import VersionNumber from 'react-native-version-number'
import { locales } from 'src/locales/i18n'

import { SettingsScreen } from '../components/settings'
import { genericActions, navigationActions } from 'src/actions'
import { ThunkDispatch } from '../../../store'
import { withLoading } from '../../../actions/modifiers'
import { routeList } from 'src/routeList'

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
})

export const Settings = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsContainer)
