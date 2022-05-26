import { ClaimMimeType } from '@jolocom/protocol-ts'
import { DisplayVal } from '@jolocom/sdk/js/credentials'
import React from 'react'
import { DrivingLicenseData, DrivingPrivilege } from 'react-native-mdl'
import { DocumentCard } from '~/components/Cards'
import { useRedirect } from '~/hooks/navigation'

import { usePopupMenu } from '~/hooks/popupMenu'
import useTranslation from '~/hooks/useTranslation'
import { ScreenNames } from '~/types/screens'
import { useDrivingLicense } from './hooks'
import { utf8ToBase64Image } from './utils'

const formatLabel = (key: string) => {
  return key
    .split('_')
    .map((word, i) => {
      if (i === 0) {
        return word.charAt(0).toUpperCase() + word.slice(1)
      }

      return word
    })
    .join(' ')
}

export const DrivingLicenseCard: React.FC<{
  drivingLicense: DrivingLicenseData
}> = ({ drivingLicense }) => {
  const { showPopup } = usePopupMenu()
  const { t } = useTranslation()
  const { deleteDrivingLicense } = useDrivingLicense()
  const redirect = useRedirect()

  const fields: DisplayVal[] = Object.entries(drivingLicense)
    .map(([key, value]) => {
      console.log({ key, value_type: typeof value })
      let label = formatLabel(key)

      const boolean_value_keys = [
        'age_over_18',
        'age_over_21',
        'age_over_35',
        'age_over_50',
      ]
      if (key === 'un_distinguishing_sign') {
        label = 'UN Distinguishing sign'
      } else if (key === 'driving_privileges') {
        value = (value as DrivingPrivilege[]).reduce((acc, value) => {
          return acc + ' ' + value.vehicle_category_code
        }, '')
      } else if (boolean_value_keys.includes(key)) {
        value = value ? 'Yes' : 'No'
      }

      return { key, value, label, mime_type: ClaimMimeType.text_plain }
    })
    .filter((field) => field.key !== 'portrait')

  const previewFieldsList = [
    'resident_address',
    'birth_date',
    'expiry_date',
    'document_number',
  ]
  const previewFields = fields.filter((field) =>
    previewFieldsList.includes(field.key!),
  )

  const photo = utf8ToBase64Image(drivingLicense.portrait)
  const credentialName = 'Driving License'

  const issuerIcon =
    'https://cloudsignatureconsortium.org/wp-content/uploads/2019/11/Logo_300dpi-300x160-1.png'
  const backgroundImage =
    'https://media.istockphoto.com/vectors/guilloche-grid-template-to-protect-securities-certificates-banknotes-vector-id1072694792?k=20&m=1072694792&s=612x612&w=0&h=845q1ZACEp6wTAw7ia0hSsDfJC1cOalrtfBaPP9TwZw='
  const contextIcons = [
    'https://www.esa.int/var/esa/storage/images/esa_multimedia/images/2014/11/german_flag/15079489-2-eng-GB/German_flag_pillars.png',
  ]
  const detailsParams = {
    fields,
    photo,
    title: credentialName,
    issuerIcon,
    contextIcons,
  }
  const handleMorePress = () => {
    showPopup([
      {
        title: t('Documents.infoCardOption'),
        navigation: {
          screen: ScreenNames.FieldDetails,
          params: detailsParams,
        },
      },
      {
        title: 'Share',
        navigation: {
          screen: ScreenNames.DrivingLicenseShare,
        },
      },
      {
        title: 'Delete',
        navigation: {
          screen: ScreenNames.DragToConfirm,
          params: {
            title: t('Documents.deleteDocumentHeader', {
              documentName: credentialName,
              interpolation: { escapeValue: false },
            }),
            cancelText: t('Documents.cancelCardOption'),
            instructionText: t('Documents.deleteCredentialInstruction'),
            onComplete: deleteDrivingLicense,
          },
        },
      },
    ])
  }

  const handlePressCard = () => {
    redirect(ScreenNames.FieldDetails, detailsParams)
  }

  return (
    <DocumentCard
      credentialName={credentialName}
      holderName={drivingLicense.given_name + ' ' + drivingLicense.family_name}
      onHandleMore={handleMorePress}
      fields={previewFields}
      photo={photo}
      issuerIcon={issuerIcon}
      icons={contextIcons}
      backgroundImage={backgroundImage}
      onPress={handlePressCard}
    />
  )
}
