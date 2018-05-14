import React from 'react'
import { View, Text } from 'react-native'

interface Props {
  typeClaimDetails: string
  toggleClaimDetails: () => void
}

export const ClaimDetails : React.SFC<Props> = (props) => {
  return (
    <View>
      <Text> Claim Details TDB </Text>
    </View>
  )
}
