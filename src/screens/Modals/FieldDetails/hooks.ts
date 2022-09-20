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

  parsedDrivingPrivileges.map((field) => {
    drivingPrivilegesCategories.map((category) => {
      if (category.classes.includes(field.vehicle_category_code)) {
        category.data['vehicleCode'].push(field.vehicle_category_code)
        category.data['issueDate'] = field['issue_date']
        return {
          ...category,
          ...category.classes,
          ...category.data,
          ...category.data['vehicleCode'],
          ...category.data['issueDate'],
        }
      }
    })
  })

  const kartoffel = parsedDrivingPrivileges.map((f) => {
    switch (f.vehicle_category_code) {
      case 'AM':
      case 'A1':
      case 'A2':
      case 'A':
        console.log('moped')
        break
      case 'B':
      case 'BF17':
      case 'B96':
      case 'BE':
        console.log('auto')
      case 'C':
      case 'C1E':
      case 'C1':
      case 'CE':
        console.log('truck')
      case 'D':
      case 'D1E':
      case 'D1':
      case 'DE':
        console.log('bus')
      case 'T':
      case 'L':
        console.log('gabelstapler')
      default:
        break
    }
  })

  console.log({ kartoffel })

  return {
    mdlDocument,
    isDocumentMdl,
    mdlProperties,
    mdlFields,
    parsedDrivingPrivileges,
    drivingPrivilegesCategories,
    togglePrivileges,
    showPrivileges,
  }
}

export default useDrivingPrivileges
