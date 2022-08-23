import { ClaimMimeType } from '@jolocom/protocol-ts'
import { DisplayVal } from '@jolocom/sdk/js/credentials'
import React from 'react'
import { LogBox } from 'react-native'
import { DrivingLicenseData, DrivingPrivilege } from 'react-native-mdl'
import { DocumentCard } from '~/components/Cards'
import { useRedirect } from '~/hooks/navigation'

import { usePopupMenu } from '~/hooks/popupMenu'
import useTranslation from '~/hooks/useTranslation'
import { ScreenNames } from '~/types/screens'
import { useDrivingLicense } from './hooks'
import { utf8ToBase64Image } from './utils'

enum DrivingLicenseKeys {
  document_number = 'document_number',
  issue_date = 'issue_date',
  expiry_date = 'expiry_date',
  resident_address = 'resident_address',
  issuing_authority = 'issuing_authority',
  issuing_country = 'issuing_country',
  given_name = 'given_name',
  family_name = 'family_name',
  resident_postal_code = 'resident_postal_code',
  birth_place = 'birth_place',
  birth_date = 'birth_date',
  portrait = 'portrait',
  un_distinguishing_sign = 'un_distinguishing_sign',
  driving_privileges = 'driving_privileges',
  age_over_18 = 'age_over_18',
  age_over_21 = 'age_over_21',
  age_over_35 = 'age_over_35',
  age_over_50 = 'age_over_50',
}

const fieldLabels = {
  [DrivingLicenseKeys.given_name]: 'Vorname',
  [DrivingLicenseKeys.family_name]: 'Familienname',
  [DrivingLicenseKeys.birth_date]: 'Geburtsdatum',
  [DrivingLicenseKeys.document_number]: 'Führerscheinnummer',
  [DrivingLicenseKeys.issuing_authority]: 'Ausstellende Behörde',
  [DrivingLicenseKeys.expiry_date]: 'Gültig bis',
  [DrivingLicenseKeys.issue_date]: 'Letztes Update',
  [DrivingLicenseKeys.issuing_country]: 'Ausstellungsland',
  [DrivingLicenseKeys.un_distinguishing_sign]: 'Länderkennzeichen',
  [DrivingLicenseKeys.driving_privileges]: 'Führerscheinrechte',
}

LogBox.ignoreAllLogs()
export const DrivingLicenseCard: React.FC<{
  drivingLicense: DrivingLicenseData
}> = ({ drivingLicense }) => {
  const { showPopup } = usePopupMenu()
  const { t } = useTranslation()
  const { deleteDrivingLicense } = useDrivingLicense()
  const redirect = useRedirect()

  const fields: DisplayVal[] = Object.entries(fieldLabels).map(
    ([key, label]) => {
      let value = drivingLicense[key as keyof DrivingLicenseData]

      if (key === DrivingLicenseKeys.driving_privileges) {
        value = (value as DrivingPrivilege[]).reduce((acc, value) => {
          return acc + ' ' + value.vehicle_category_code
        }, '')
      }

      return {
        key,
        label,
        value: value as string,
        mime_type: ClaimMimeType.text_plain,
      }
    },
  )

  const previewFieldsList = [
    'birth_date',
    'expiry_date',
    'document_number',
    'issuing_country',
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
    'https://cdn.icon-icons.com/icons2/1694/PNG/512/eueuropeanunionflag_111740.png',
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
