import moment from 'moment'
import { useState } from 'react'
import { DrivingPrivilege } from 'react-native-mdl'

import { SinglePrivilegesFieldKeys } from './types'
import { useDocuments } from '~/hooks/documents'
import { Document, DocumentProperty } from '~/hooks/documents/types'

const useDrivingPrivileges = (document: Document) => {
  const { getExtraProperties } = useDocuments()

  const [showPrivileges, setShowPrivileges] = useState(false)

  const togglePrivileges = () => {
    setShowPrivileges(!showPrivileges)
  }

  const mdlDocument =
    document.type[1] === 'DrivingLicenseCredential' ? { ...document } : null

  const isDocumentMdl = Boolean(mdlDocument)

  const parsedDrivingPrivileges: DrivingPrivilege[] = JSON.parse(
    mdlDocument!.properties.filter((f) => f.key === '$.driving_privileges')[0]
      .value,
  )

  const vehicleCategoryCodes = parsedDrivingPrivileges
    .map((f) => f['vehicle_category_code'])
    .sort()
    .join(', ')

  const mdlProperties = mdlDocument!.properties.map((f) => {
    if (f.key !== '$.driving_privileges') {
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

  const generateSinglePrivilegesField = parsedDrivingPrivileges.map(
    (field) => ({
      [SinglePrivilegesFieldKeys.Title]: field.vehicle_category_code.startsWith(
        'A',
      )
        ? 'Moped and Motorcycle'
        : field.vehicle_category_code.startsWith('B')
        ? 'Passenger Car'
        : field.vehicle_category_code.startsWith('C')
        ? 'Truck'
        : field.vehicle_category_code.startsWith('D')
        ? 'Bus'
        : field.vehicle_category_code.startsWith('L')
        ? 'Tractor and Forklift'
        : field.vehicle_category_code.startsWith('T')
        ? 'Tractor and Forklift'
        : null,
      [SinglePrivilegesFieldKeys.VehicleCode]: field.vehicle_category_code,
      [SinglePrivilegesFieldKeys.IssueDate]: moment(field.issue_date).format(
        'DD.MM.YYYY',
      ),
      [SinglePrivilegesFieldKeys.Restrictions]: '-',
      [SinglePrivilegesFieldKeys.ExpiryDate]: '-',
    }),
  )

  return {
    mdlDocument,
    isDocumentMdl,
    mdlFields,
    togglePrivileges,
    showPrivileges,
    generateSinglePrivilegesField,
  }
}

export default useDrivingPrivileges
