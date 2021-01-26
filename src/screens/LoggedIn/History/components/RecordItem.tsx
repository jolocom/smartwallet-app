import React, { useEffect, useState } from 'react'
import { LayoutAnimation, TouchableOpacity } from 'react-native'

import { useHistory } from '~/hooks/history'
import { IRecordDetails } from '~/types/records'
import { useToasts } from '~/hooks/toasts'
import { IRecordItemProps } from '../Record'
import RecordItemHeader from './RecordItemHeader'
import RecordItemDetails from './RecordItemDetails'

const RecordItem: React.FC<IRecordItemProps> = ({ id, onDropdown }) => {
  const [itemDetails, setItemDetails] = useState<IRecordDetails | null>(null)
  const [isOpen, setOpen] = useState(false)

  const { getInteractionDetails } = useHistory()

  const handlePress = () => {
    if (itemDetails) {
      !isOpen && onDropdown()
      LayoutAnimation.configureNext({
        ...LayoutAnimation.Presets.easeInEaseOut,
        duration: 200,
      })
      setOpen((prev) => !prev)
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
    <TouchableOpacity activeOpacity={0.8} onPress={handlePress}>
      <RecordItemHeader details={itemDetails} />
      {isOpen && itemDetails && <RecordItemDetails details={itemDetails} />}
    </TouchableOpacity>
  )
}

export default RecordItem
