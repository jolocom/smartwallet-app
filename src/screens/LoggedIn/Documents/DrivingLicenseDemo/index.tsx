import React from 'react'
import { DrivingLicenseData, DrivingPrivilege } from 'react-native-mdl'

import DocumentSectionDocumentCard from '~/components/Cards/DocumentSectionCards/DocumentSectionDocumentCard'
import { usePopupMenu } from '~/hooks/popupMenu'
import { useToasts } from '~/hooks/toasts'
import useTranslation from '~/hooks/useTranslation'
import { ScreenNames } from '~/types/screens'
import { useDrivingLicense } from './hooks'

const formatLabel = (key: string) => {
    return key.split("_").map((word, i) => {
        if(i === 0) {
            return word.charAt(0).toUpperCase() + word.slice(1)
        }

        return word
    }).join(" ")
}

export const DrivingLicenseCard: React.FC<{drivingLicense: DrivingLicenseData}> = ({drivingLicense}) => {
    const { showPopup } = usePopupMenu()
    const { t } = useTranslation()
    const {scheduleErrorWarning} = useToasts()
    const {deleteDrivingLicense} = useDrivingLicense()

    const fields = Object.entries(drivingLicense).map(([key, value]) => {
        let label = formatLabel(key)

        if(key === "un_distinguishing_sign") {
            label = "UN Distinguishing sign"
        } else if(key === "driving_privileges") {
            value = (value as DrivingPrivilege[]).reduce((acc, value) => {
                return acc + " " + value.vehicle_category_code
            }, "")
        }

        return { key, value, label }
    }).filter(field => field.key !== "portrait")

    const previewFieldsList = ['driving_privileges', "issuing_country", "birth_date"]
    const previewFields = fields.filter(field => previewFieldsList.includes(field.key))

    const photo = `data:image/png;base64,${Buffer.from(drivingLicense.portrait).toString('base64')}`
    const credentialName = "Driving License"

    const handleMorePress = () => {
        showPopup([
            {
                title: t('Documents.infoCardOption'),
                navigation: {
                    screen: ScreenNames.CredentialDetails,
                    params: {
                        fields,
                        photo,
                        title: credentialName
                    }
                }
            },
            {
                title: "Delete",
                navigation: {
                    screen: ScreenNames.DragToConfirm,
                    params: {
                        title: t('Documents.deleteDocumentHeader', {
                            documentName: credentialName,
                            interpolation: { escapeValue: false },
                        }),
                        cancelText: t('Documents.cancelCardOption'),
                        instructionText: t('Documents.deleteCredentialInstruction'),
                        onComplete: deleteDrivingLicense                   }
                }
            }
        ])
    }



    return (
        <DocumentSectionDocumentCard
            credentialName={credentialName}
            holderName={drivingLicense.given_name + " " + drivingLicense.family_name}
            onHandleMore={handleMorePress}
            fields={previewFields}
            highlight={drivingLicense.document_number}
            photo={photo}
         />
    )
}
