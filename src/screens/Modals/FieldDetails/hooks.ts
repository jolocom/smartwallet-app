import { useState } from 'react'
import { DrivingPrivilege } from 'react-native-mdl'
import { useDocuments } from '~/hooks/documents'
import { Document, DocumentProperty } from '~/hooks/documents/types'

const useDrivingPrivileges = (document: Document) => {
  const { getExtraProperties } = useDocuments()

  const mdlDocument =
    document.type[1] === 'DrivingLicenseCredential' ? { ...document } : null

  const [showPrivileges, setShowPrivileges] = useState(false)

  const togglePrivileges = () => {
    setShowPrivileges(!showPrivileges)
  }

  const isDocumentMdl = Boolean(mdlDocument)

  const parsedDrivingPrivileges: string =
    isDocumentMdl &&
    JSON.parse(
      document.properties.filter((f) => {
        if (f.key === '$.driving_privileges') {
          return f.value
        }
      })[0].value,
    )
      .map((f: DrivingPrivilege) => f['vehicle_category_code'])
      .join(', ')

  let mdlProperties =
    isDocumentMdl &&
    mdlDocument!.properties.map((f) => {
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

  const mdlFields = mdlProperties && [
    ...mdlProperties,
    ...getExtraProperties(mdlDocument!),
  ]

  const vehicleFields =
    mdlDocument?.properties &&
    JSON.parse(
      mdlDocument?.properties.filter((f) => f.key === '$.driving_privileges')[0]
        .value,
    )

  const catergories = [
    {
      title: 'Moped and Motorcycle',
      icon: null,
      data: {
        'Vehicle Code': 'AM',
        'Issue Date': '02.02.2002',
        Restrictions: '-',
        'Expiry Date': '02.02.2002',
      },
    },
    {
      title: 'Passenger Car',
      icon: null,
      data: {
        'Vehicle Code': 'AM',
        'Issue Date': '02.02.2002',
        Restrictions: '-',
        'Expiry Date': '02.02.2002',
      },
    },
    {
      title: 'Tractor and Forklift',
      icon: null,
      data: {
        'Vehicle Code': 'AM',
        'Issue Date': '02.02.2002',
        Restrictions: '-',
        'Expiry Date': '02.02.2002',
      },
    },
  ]

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
