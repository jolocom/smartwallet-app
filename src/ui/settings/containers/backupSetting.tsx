import React from 'react'
import SettingsItem from '../components/settingsItem'
import I18n from '../../../locales/i18n'
import strings from '../../../locales/strings'
import { RootState } from '../../../reducers'
import { connect } from 'react-redux'
import settingKeys from '../settingKeys'
import { ThunkDispatch } from '../../../store'
import { withErrorScreen } from '../../../actions/modifiers'
import { showSeedPhrase } from '../../../actions/recovery'

interface Props
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {}

const BackupSettingContainer: React.FC<Props> = props => {
  const seedPhraseSaved = props.settings[settingKeys.seedPhraseSaved] as boolean
  return (
    <SettingsItem
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
      onPress={props.setupBackup}
    />
  )
}

const mapStateToProps = (state: RootState) => ({
  settings: state.settings,
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  setupBackup: () => dispatch(withErrorScreen(showSeedPhrase())),
})

export const BackupSetting = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BackupSettingContainer)
