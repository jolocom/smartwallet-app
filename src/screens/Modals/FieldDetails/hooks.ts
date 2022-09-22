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
        return 'Moped and Motorcycle'
      case 'B':
        return 'Passenger Car'
      case 'C':
        return 'Truck'
      case 'D':
        return 'Bus'
      case 'L':
      case 'T':
        return 'Tractor and Forklift'
    }
  }

  const mdlPrivileges = drivingPrivileges
    .map((field) => {
      return {
        title: getPrivilegesTitle(field.vehicle_category_code),
        data: {
          [t('mdl.vehicleCode')]: field.vehicle_category_code,
          [t('mdl.issueDate')]: moment(field.issue_date).format('DD.MM.YYYY'),
          [t('mdl.restrictions')]: [
            {
              code: field.codes?.map((c) => c.code).join(', ') || '-',
            },
          ],
          [t('mdl.expiryDate')]: field.expiry_date || '-',
        },
      }
    })
    .sort((a, b) =>
      a.data[t('mdl.vehicleCode')].localeCompare(b.data[t('mdl.vehicleCode')]),
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
