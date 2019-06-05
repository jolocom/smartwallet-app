import React from 'react'
import { Text } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { compareDates } from 'src/lib/util'

interface Props {
  expiryDate: Date
}

export const ValiditySummary: React.SFC<Props> = props => (
  <Text style={{ color: checkValidity(props.expiryDate) }}>
    <Icon size={15} name="check-all" color={checkValidity(props.expiryDate)} />
    {` Valid till ${props.expiryDate.toDateString()}`}
  </Text>
)

const checkValidity = (date: Date): string =>
  compareDates(new Date(Date.now()), date) > 1 ? '#28a52d' : 'red'
