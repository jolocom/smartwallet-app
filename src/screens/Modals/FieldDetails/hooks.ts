import moment from 'moment'
import { useState } from 'react'
import { DrivingPrivilege } from 'react-native-mdl'

import { MdlPropertyKeys, MdlCredential, PrivilegesData } from './types'
import { useDocuments } from '~/hooks/documents'
import { Document, DocumentProperty } from '~/hooks/documents/types'
import useTranslation from '~/hooks/useTranslation'

const useDrivingPrivileges = (document: Document) => {
  const { getExtraProperties } = useDocuments()

  const { t } = useTranslation()

  const [showPrivileges, setShowPrivileges] = useState(false)

  const togglePrivileges = () => {
    setShowPrivileges(!showPrivileges)
  }

  const mdlDocument = document.type[1] === MdlCredential.type ? document : null

  const isDocumentMdl = Boolean(mdlDocument)

  const drivingPrivileges: DrivingPrivilege[] = JSON.parse(
    mdlDocument!.properties.filter(
      (f) => f.key === MdlPropertyKeys.drivingPrivileges,
    )[0].value,
  )

  const vehicleCategoryCodes = drivingPrivileges
    .map((f) => f['vehicle_category_code'])
    .sort()
    .join(', ')

  const mdlProperties = mdlDocument!.properties.map((f) => {
    if (f.key !== MdlPropertyKeys.drivingPrivileges) {
      return f
    } else {
      return {
        key: f.key,
        label: f.label,
        value: vehicleCategoryCodes,
      } as DocumentProperty
    }
  })

  const mdlFields = [...mdlProperties!, ...getExtraProperties(mdlDocument!)]

  const getPrivilegesTitle = (c: string) => {
    const firstLetter = c.charAt(0)
    switch (firstLetter) {
      case 'A':
        return t('mdl.mopedAndMotorcycle')
      case 'B':
        return t('mdl.passengerCar')
      case 'C':
        return t('mdl.truck')
      case 'D':
        return t('mdl.bus')
      case 'L':
      case 'T':
        return t('mdl.tractorAndForklift')
    }
  }

  const mdlPrivileges: PrivilegesData[] = drivingPrivileges
    .map((field) => {
      return {
        title: getPrivilegesTitle(field.vehicle_category_code),
        data: [
          {
            vehicle_category_code: field.vehicle_category_code,
            title: t('mdl.vehicleCode'),
          },
          {
            issue_date: moment(field.issue_date).format('DD.MM.YYYY'),
            title: t('mdl.issueDate'),
          },
          {
            codes: [
              {
                code: field.codes?.map((c) => c.code).join(', ') || '-',
              },
            ],
            title: t('mdl.restrictions'),
          },
          {
            expiry_date: field.expiry_date || '-',
            title: t('mdl.expiryDate'),
          },
        ],
      } as PrivilegesData
    })
    .sort((a, b) =>
      a.data[0].vehicle_category_code.localeCompare(
        b.data[0].vehicle_category_code,
      ),
    )

  return {
    mdlDocument,
    isDocumentMdl,
    mdlFields,
    togglePrivileges,
    showPrivileges,
    mdlPrivileges,
  }
}

export default useDrivingPrivileges
