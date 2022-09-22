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

  // convert into Switch statement
  const getPrivilegesTitle = (c: string) => {
    if (c.startsWith('A')) return 'Moped and Motorcycle'
    if (c.startsWith('B')) return 'Passenger Car'
    if (c.startsWith('C')) return 'Truck'
    if (c.startsWith('D')) return 'Bus'
    if (c.startsWith('L')) return 'Tractor and Forklift'
    if (c.startsWith('T')) return 'Tractor and Forklift'
  }

  // create terms for the keys and insert them, get rid of the enum
  const mdlPrivileges: PrivilegesData[] = drivingPrivileges
    .map((field) => {
      return {
        title: getPrivilegesTitle(field.vehicle_category_code),
        data: {
          vehicle_category_code: field.vehicle_category_code,
          issue_date: moment(field.issue_date).format('DD.MM.YYYY'),
          codes: [
            {
              code: field.codes?.map((c) => c.code).join(', ') || '-',
            },
          ],
          expiry_date: '-',
        },
      } as PrivilegesData
    })
    .sort((a, b) =>
      a.data['vehicle_category_code'].localeCompare(
        b.data['vehicle_category_code'],
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
