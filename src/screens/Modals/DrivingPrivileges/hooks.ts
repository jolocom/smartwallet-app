import moment from 'moment'
import { DrivingPrivilege } from 'react-native-mdl'

import { MdlPropertyKeys, PrivilegesData } from './types'
import { Document } from '~/hooks/documents/types'
import useTranslation from '~/hooks/useTranslation'

const useDrivingPrivileges = (mdl: Document) => {
  const { t } = useTranslation()

  const drivingPrivileges: DrivingPrivilege[] = JSON.parse(
    mdl.properties.filter((f) => f.key === MdlPropertyKeys.drivingPrivileges)[0]
      .value,
  )

  const vehicleCategoryCodes = drivingPrivileges
    .map((f) => f['vehicle_category_code'])
    .sort()
    .join(', ')

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
    mdlPrivileges,
    vehicleCategoryCodes,
  }
}

export default useDrivingPrivileges
