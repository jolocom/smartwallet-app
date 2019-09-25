import React from 'react'
import strings from '../../../locales/strings'
import SettingsItem from '../components/settingsItem'
import I18n from 'src/locales/i18n'

export const DeleteIdentitySetting: React.FC = () => {
  return (
    <SettingsItem
      title={I18n.t(strings.DELETE_IDENTITY)}
      description={'(coming soon)'}
      iconName={'delete'}
      isDisabled
    />
  )
}
