import { useState } from 'react'
import { DrivingPrivilege } from 'react-native-mdl'
import { cat } from 'shelljs'
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
      classes: ['AM', 'A1', 'A2', 'A'],
      data: {
        'Vehicle Code': [],
        'Issue Date': '',
        Restrictions: '-',
        'Expiry Date': '-',
      },
    },
    {
      title: 'Passenger Car',
      classes: ['B', 'BF17', 'B96', 'BE'],
      data: {
        'Vehicle Code': [],
        'Issue Date': '',
        Restrictions: '-',
        'Expiry Date': '-',
      },
    },
    {
      title: 'Tractor and Forklift',

      classes: ['T', 'L'],
      data: {
        'Vehicle Code': [],
        'Issue Date': '',
        Restrictions: '-',
        'Expiry Date': '-',
      },
    },
    {
      title: 'Bus',
      classes: ['D1', 'D1E', 'D', 'DE'],
      data: {
        'Vehicle Code': [],
        'Issue Date': '02.02.2002',
        Restrictions: '',
        'Expiry Date': '-',
      },
    },
    {
      title: 'Truck',
      classes: ['C1', 'C1E', 'C', 'CE'],
      data: {
        'Vehicle Code': [],
        'Issue Date': '',
        Restrictions: '-',
        'Expiry Date': '-',
      },
    },
  ]

  vehicleFields.map((field) => {
    catergories.map((category) => {
      if (category.classes.includes(field.vehicle_category_code)) {
        console.log(field)
        category.data['Vehicle Code'].push(field.vehicle_category_code)
        category.data['Issue Date'] = field['issue_date']
        return {
          ...category,
          ...category.classes,
          ...category.data,
          ...category.data['Vehicle Code'],
          ...category.data['Issue Date'],
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
  }
}

export default useDrivingPrivileges
