import { useState } from 'react'
import { DrivingPrivilege } from 'react-native-mdl'

import { Category, VehicleTypes } from './types'
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

  const drivingPrivilegesCategories: Category[] = [
    {
      title: VehicleTypes.MopedAndMotorcycle,
      classes: ['AM', 'A1', 'A2', 'A'],
      data: {
        vehicleCode: [],
        issueDate: '',
        restrictions: '-',
        expiryDate: '-',
      },
    },
    {
      title: VehicleTypes.PassengerCar,
      classes: ['B', 'BF17', 'B96', 'BE'],
      data: {
        vehicleCode: [],
        issueDate: '',
        restrictions: '-',
        expiryDate: '-',
      },
    },
    {
      title: VehicleTypes.TractorAndForklift,
      classes: ['T', 'L'],
      data: {
        vehicleCode: [],
        issueDate: '',
        restrictions: '-',
        expiryDate: '-',
      },
    },
    {
      title: VehicleTypes.Bus,
      classes: ['D1', 'D1E', 'D', 'DE'],
      data: {
        vehicleCode: [],
        issueDate: '',
        restrictions: '-',
        expiryDate: '-',
      },
    },
    {
      title: VehicleTypes.Truck,
      classes: ['C1', 'C1E', 'C', 'CE'],
      data: {
        vehicleCode: [],
        issueDate: '',
        restrictions: '-',
        expiryDate: '-',
      },
    },
  ]

  const mdlFieldData = parsedDrivingPrivileges.map((field) => ({
    title: field.vehicle_category_code.startsWith('A')
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
    'Issue Date': field.issue_date,
    'Vehicle Code': field.vehicle_category_code,
    'Expiry Date': '-',
    Restrictions: '-',
  }))

  return {
    mdlDocument,
    isDocumentMdl,
    mdlProperties,
    mdlFields,
    parsedDrivingPrivileges,
    drivingPrivilegesCategories,
    togglePrivileges,
    showPrivileges,
    mdlFieldData,
  }
}

export default useDrivingPrivileges
