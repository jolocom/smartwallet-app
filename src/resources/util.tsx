import React from 'react'
import { CredentialTypes } from 'src/lib/categories'
import { EmailIcon, NameIcon, PhoneIcon, AccessibilityIcon } from '.'

export const getCredentialIconByType = (type: string) => {
  const typeToIconMap = {
    [CredentialTypes.Name]: <NameIcon/>,
    [CredentialTypes.Email]: <EmailIcon/>,
    [CredentialTypes.MobilePhone]: <PhoneIcon/>
  }

  return typeToIconMap[type] || <AccessibilityIcon/>
}