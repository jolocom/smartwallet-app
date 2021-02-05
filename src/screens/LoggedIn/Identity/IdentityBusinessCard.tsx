import React, { useMemo, useState } from 'react'
import { LayoutAnimation } from 'react-native'
import { useSelector } from 'react-redux'
import Dots from '~/components/Dots'
import { useSICActions } from '~/hooks/attributes'
import { useToasts } from '~/hooks/toasts'
import {
  getBusinessCardId,
} from '~/modules/attributes/selectors'
import { strings } from '~/translations'
import { Colors } from '~/utils/colors'
import BusinessCardCredential from './components/businessCard/BusinessCardCredential'
import BusinessCardEdit from './components/businessCard/BusinessCardEdit'
import BusinessCardPlaceholder from './components/businessCard/BusinessCardPlaceholder'
import Styled, { IStyledComposition } from './components/Styled'

enum Modes {
  display = 'display',
  edit = 'edit',
}

interface IBusinessCardComposition {
  Styled: IStyledComposition
}


const BusinessCard: React.FC & IBusinessCardComposition = () => {
  const [mode, setMode] = useState(Modes.display)
  const { handleDeleteCredentialSI } = useSICActions()

  const businessCardId = useSelector(getBusinessCardId)
  const { scheduleWarning } = useToasts()

  const isPlaceholder = !Boolean(businessCardId)

  const transitionMode = (mode: Modes) => {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.easeInEaseOut,
      duration: 200,
    })
    setMode(mode)
  }

  const handleDeleteBC = async () => {
    if (businessCardId) {
      try {
        await handleDeleteCredentialSI(businessCardId)
      } catch (e) {
        scheduleWarning({
          title: 'Could not delete',
          message: 'Failed to delete business card',
        })
      } finally {
        transitionMode(Modes.display)
      }
    } else {
      throw new Error('Cannot perform delete on non existent business card')
    }
  }

  const popupOptions = useMemo(
    () => [
      {
        title: strings.EDIT,
        onPress: () => transitionMode(Modes.edit),
      },
      ...(!isPlaceholder
        ? [
            {
              title: strings.DELETE,
              onPress: handleDeleteBC,
            },
          ]
        : []),
    ],
    [businessCardId],
  )

  if (mode === Modes.edit) {
    return <BusinessCardEdit onCancel={() => transitionMode(Modes.display)} />
  }
  return (
    <BusinessCard.Styled.Container>
      <Dots
        color={Colors.white}
        customStyles={{ right: -10, top: -12 }}
        options={popupOptions}
      />
      {isPlaceholder ? <BusinessCardPlaceholder /> : <BusinessCardCredential />}
    </BusinessCard.Styled.Container>
  )
}

BusinessCard.Styled = Styled

export default BusinessCard
