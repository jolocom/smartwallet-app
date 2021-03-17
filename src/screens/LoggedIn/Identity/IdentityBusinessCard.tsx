import React, { useMemo } from 'react'
import { View } from 'react-native'
import { useSelector } from 'react-redux'

import Dots from '~/components/Dots'
import { useSICActions } from '~/hooks/attributes'
import { useToasts } from '~/hooks/toasts'
import { getBusinessCardId } from '~/modules/attributes/selectors'
import { strings } from '~/translations'
import { Colors } from '~/utils/colors'
import BusinessCardCredential from './components/businessCard/BusinessCardCredential'
import BusinessCardPlaceholder from './components/businessCard/BusinessCardPlaceholder'
import BusinessCardStyled from './components/BusinessCardStyled'
import IdentityTabs from './tabs'
import { useRedirect } from '~/hooks/navigation'
import { ScreenNames } from '~/types/screens'

const BusinessCard: React.FC = () => {
  const redirect = useRedirect()
  const { handleDeleteCredentialSI } = useSICActions()

  const businessCardId = useSelector(getBusinessCardId)
  const { scheduleWarning } = useToasts()

  const isPlaceholder = !Boolean(businessCardId)

  const handleDeleteBC = async () => {
    if (businessCardId) {
      try {
        await handleDeleteCredentialSI(businessCardId)
      } catch (e) {
        scheduleWarning({
          title: 'Could not delete',
          message: 'Failed to delete business card',
        })
      }
    } else {
      throw new Error('Cannot perform delete on non existent business card')
    }
  }

  const popupOptions = useMemo(
    () => [
      {
        title: strings.EDIT,
        onPress: () => redirect(ScreenNames.BusinessCardForm),
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

  return (
    <View style={{ marginTop: !isPlaceholder ? 30 : 0 }}>
      <IdentityTabs.Styled.Placeholder show={!businessCardId}>
        {strings.YOUR_INFO_IS_QUITE_EMPTY}
      </IdentityTabs.Styled.Placeholder>
      <BusinessCardStyled.Container>
        <Dots
          color={Colors.white}
          customStyles={{ right: -10, top: -12 }}
          options={popupOptions}
        />
        {isPlaceholder ? (
          <BusinessCardPlaceholder />
        ) : (
          <BusinessCardCredential />
        )}
      </BusinessCardStyled.Container>
    </View>
  )
}

export default BusinessCard
