import React, { useEffect, useState } from 'react'
import { LayoutAnimation, TouchableOpacity } from 'react-native'

import { useHistory } from '~/hooks/history'
import { IRecordDetails } from '~/types/records'
import { useToasts } from '~/hooks/toasts'
import { IRecordItemProps } from '../Record'
import RecordItemHeader from './RecordItemHeader'
import RecordItemDetails from './RecordItemDetails'

const RecordItem: React.FC<IRecordItemProps> = ({ id }) => {
  const [itemDetails, setItemDetails] = useState<IRecordDetails | null>(null)
  const [isOpen, setOpen] = useState(false)

  const { scheduleErrorWarning } = useToasts()
  const { getInteractionDetails } = useHistory()

  const handlePress = () => {
    if (itemDetails) {
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
