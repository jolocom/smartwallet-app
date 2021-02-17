import React, { useEffect, useState } from 'react'
import { LayoutAnimation, TouchableOpacity } from 'react-native'

import { useHistory } from '~/hooks/history'
import { IRecordDetails } from '~/types/records'
import { IRecordItemProps } from '../types'
import RecordItemHeader from './RecordItemHeader'
import RecordItemDetails from './RecordItemDetails'

const RecordItem: React.FC<IRecordItemProps> = ({
  id,
  onDropdown,
  isFocused,
}) => {
  const [itemDetails, setItemDetails] = useState<IRecordDetails | null>(null)

  const { getInteractionDetails } = useHistory()

  const handlePress = () => {
    if (itemDetails) {
      onDropdown()
      LayoutAnimation.configureNext({
        ...LayoutAnimation.Presets.easeInEaseOut,
        duration: 200,
      })
    }
  }

  useEffect(() => {
    getInteractionDetails(id)
      .then((interaction) => {
        LayoutAnimation.configureNext({
          ...LayoutAnimation.Presets.easeInEaseOut,
          duration: 500,
        })
        setItemDetails(interaction)
      })
      .catch((e) => {
        console.log('Error occured in RecordItem', e)

        // scheduleErrorWarning(e)
      })
  }, [])

  return (
    <TouchableOpacity
      testID="record-item"
      activeOpacity={0.8}
      onPress={handlePress}
    >
      <RecordItemHeader details={itemDetails} />
      {isFocused && itemDetails && <RecordItemDetails details={itemDetails} />}
    </TouchableOpacity>
  )
}

export default RecordItem
