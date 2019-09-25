import React from 'react'
import VersionNumber from 'react-native-version-number'
import { SettingsScreen } from '../components/settings'

export const Settings = () => (
  <SettingsScreen version={VersionNumber.appVersion} />
)
