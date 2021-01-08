import React, { useEffect, useState } from 'react'
import { LayoutAnimation, TouchableOpacity } from 'react-native'

import { useHistory } from '~/hooks/history'
import { IRecordDetails } from '~/hooks/history/types'
import { useToasts } from '~/hooks/toasts'
import Record, { IRecordItemProps } from './Record'

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
      .then((details) => {
        return details
      })
      .then((interaction) => {
        LayoutAnimation.configureNext({
          ...LayoutAnimation.Presets.easeInEaseOut,
          duration: 500,
        })
        setItemDetails(interaction)
      })
      .catch(scheduleErrorWarning)
  }, [])

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={handlePress}>
      <Record.Block details={itemDetails} />
      {isOpen && itemDetails && <Record.Dropdown details={itemDetails} />}
    </TouchableOpacity>
  )
}

export default RecordItem
