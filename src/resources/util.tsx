import React, { ReactNode } from 'react'
import { CredentialTypes } from 'src/lib/categories'
import { EmailIcon, NameIcon, PhoneIcon, AccessibilityIcon } from '.'

export const getCredentialIconByType = (type: string): ReactNode => {
  const typeToIconMap = {
    [CredentialTypes.Name]: <NameIcon />,
    [CredentialTypes.Email]: <EmailIcon />,
    [CredentialTypes.MobilePhone]: <PhoneIcon />,
  }

  return typeToIconMap[type] || <AccessibilityIcon />
}
