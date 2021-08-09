import React, { useEffect, useState } from 'react'
import { LayoutAnimation, TouchableOpacity } from 'react-native'

import { useHistory } from '~/hooks/history'
import { IRecordDetails } from '~/types/records'
import { IRecordItemProps } from '../types'
import RecordItemHeader from './RecordItemHeader'
import RecordItemDetails from './RecordItemDetails'
import { useSelector } from 'react-redux'
import { getCurrentLanguage } from '~/modules/account/selectors'

const RecordItem: React.FC<IRecordItemProps> = React.memo(
  ({ id, onDropdown, isFocused }) => {
    const [itemDetails, setItemDetails] = useState<IRecordDetails | null>(null)
    const currentLanguage = useSelector(getCurrentLanguage)

    const { assembleInteractionDetails } = useHistory()

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
      assembleInteractionDetails(id)
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
    }, [currentLanguage])

    return (
      <TouchableOpacity
        testID="record-item"
        activeOpacity={0.8}
        onPress={handlePress}
      >
        <RecordItemHeader details={itemDetails} />
        {isFocused && itemDetails && (
          <RecordItemDetails details={itemDetails} />
        )}
      </TouchableOpacity>
    )
  },
  (prevProps, nextProps) =>
    prevProps.isFocused === nextProps.isFocused &&
    prevProps.lastUpdated === nextProps.lastUpdated &&
    JSON.stringify(prevProps.onDropdown) ===
      JSON.stringify(nextProps.onDropdown),
)

export default RecordItem
