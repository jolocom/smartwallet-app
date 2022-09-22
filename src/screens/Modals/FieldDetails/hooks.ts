import moment from 'moment'
import { useState } from 'react'
import { DrivingPrivilege } from 'react-native-mdl'

import {
  SinglePrivilegesFieldKeys,
  VehicleTypes,
  MdlPropertyKeys,
  DrivingPrivilegesKeys,
  MdlCredential,
} from './types'
import { useDocuments } from '~/hooks/documents'
import { Document, DocumentProperty } from '~/hooks/documents/types'

const useDrivingPrivileges = (document: Document) => {
  const { getExtraProperties } = useDocuments()

  const [showPrivileges, setShowPrivileges] = useState(false)

  const togglePrivileges = () => {
    setShowPrivileges(!showPrivileges)
  }

  const mdlDocument =
    document.type[1] === MdlCredential.type ? { ...document } : null

  const isDocumentMdl = Boolean(mdlDocument)

  const parsedDrivingPrivileges: DrivingPrivilege[] = JSON.parse(
    mdlDocument!.properties.filter(
      (f) => f.key === MdlPropertyKeys.drivingPrivileges,
    )[0].value,
  )

  const vehicleCategoryCodes = parsedDrivingPrivileges
    .map((f) => f[DrivingPrivilegesKeys.vehicleCategoryCode])
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
    if (c.startsWith('A')) return VehicleTypes.MopedAndMotorcycle
    if (c.startsWith('B')) return VehicleTypes.PassengerCar
    if (c.startsWith('C')) return VehicleTypes.Truck
    if (c.startsWith('D')) return VehicleTypes.Bus
    if (c.startsWith('L') || c.startsWith('T'))
      return VehicleTypes.TractorAndForklift
    return null
  }

  const mdlPrivileges = parsedDrivingPrivileges
    .map((field) => ({
      [SinglePrivilegesFieldKeys.Title]: getPrivilegesTitle(
        field.vehicle_category_code,
      ),
      [SinglePrivilegesFieldKeys.VehicleCode]: field.vehicle_category_code,
      [SinglePrivilegesFieldKeys.IssueDate]: moment(field.issue_date).format(
        'DD.MM.YYYY',
      ),
      [SinglePrivilegesFieldKeys.Restrictions]: '-',
      [SinglePrivilegesFieldKeys.ExpiryDate]: '-',
    }))
    .sort((a, b) =>
      a[SinglePrivilegesFieldKeys.VehicleCode].localeCompare(
        b[SinglePrivilegesFieldKeys.VehicleCode],
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
