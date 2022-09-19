import { useState } from 'react'
import { DrivingPrivilege } from 'react-native-mdl'
import { useDocuments } from '~/hooks/documents'
import { Document, DocumentProperty } from '~/hooks/documents/types'

const useDrivingPrivileges = (document: Document) => {
  const { getExtraProperties } = useDocuments()

  const [showPrivileges, setShowPrivileges] = useState(false)

  const togglePrivileges = () => {
    setShowPrivileges(!showPrivileges)
  }

  enum PriviligesKeys {
    VehicleCode = 'Vehicle Code',
    IssueDate = 'Issue Date',
    Restrictions = 'Restrictions',
    ExpiryDate = 'Expiry Date',
  }

  const mdlDocument =
    document.type[1] === 'DrivingLicenseCredential' ? { ...document } : null

  const isDocumentMdl = Boolean(mdlDocument)

  const parsedDrivingPrivileges: string = JSON.parse(
    document.properties.filter((f) => {
      if (f.key === '$.driving_privileges') {
        return f.value
      }
    })[0].value,
  )
    .map((f: DrivingPrivilege) => f['vehicle_category_code'])
    .join(', ')

  let mdlProperties = mdlDocument?.properties.map((f) => {
    if (f.key !== '$.driving_privileges') {
      return f
    } else {
      return {
        key: f.key,
        label: f.label,
        value: parsedDrivingPrivileges,
      } as DocumentProperty
    }
  })

  const mdlFields = [...mdlProperties!, ...getExtraProperties(mdlDocument!)]

  const vehicleFields = JSON.parse(
    mdlDocument!.properties.filter((f) => f.key === '$.driving_privileges')[0]
      .value,
  )

  const catergories = [
    {
      title: 'Moped and Motorcycle',
      icon: null,
      classes: ['AM', 'A1', 'A2', 'A'],
      data: {
        'Vehicle Code': [],
        'Issue Date': '02.02.2002',
        Restrictions: '-',
        'Expiry Date': '02.02.2002',
      },
    },
    {
      title: 'Passenger Car',
      icon: null,
      classes: ['B', 'BF17', 'B96', 'BE'],
      data: {
        'Vehicle Code': [],
        'Issue Date': '02.02.2002',
        Restrictions: '-',
        'Expiry Date': '02.02.2002',
      },
    },
    {
      title: 'Tractor and Forklift',
      icon: null,
      classes: ['T', 'L'],
      data: {
        'Vehicle Code': [],
        'Issue Date': '02.02.2002',
        Restrictions: '-',
        'Expiry Date': '02.02.2002',
      },
    },
    {
      title: 'Bus',
      icon: null,
      classes: ['D1', 'D1E', 'D', 'DE'],
      data: {
        'Vehicle Code': [],
        'Issue Date': '02.02.2002',
        Restrictions: '-',
        'Expiry Date': '02.02.2002',
      },
    },
    {
      title: 'Truck',
      icon: null,
      classes: ['C1', 'C1E', 'C', 'CE'],
      data: {
        'Vehicle Code': [],
        'Issue Date': '02.02.2002',
        Restrictions: '-',
        'Expiry Date': '02.02.2002',
      },
    },
  ]

  vehicleFields.map((field) => {
    catergories.map((category) => {
      if (category.classes.includes(field.vehicle_category_code)) {
        category.data['Vehicle Code'].push(field.vehicle_category_code)
        return {
          ...category,
          ...category.classes,
          ...category.data,
          ...category.data['Vehicle Code'],
        }
      }
    })
  })

  return {
    mdlDocument,
    isDocumentMdl,
    parsedDrivingPrivileges,
    mdlProperties,
    mdlFields,
    vehicleFields,
    catergories,
    togglePrivileges,
    showPrivileges,
    PriviligesKeys,
  }
}

export default useDrivingPrivileges
