import React from 'react'
import { View } from 'react-native'

import ScreenContainer from '~/components/ScreenContainer'
import IdentityIntro from './IdentityIntro'
import { getAttributes } from '~/modules/attributes/selectors'
import { useSelector } from 'react-redux'
import IdentityCredentials from './IdentityCredentials'
import IdentityTabs from './tabs'
import {
  IdentityTabCredentialsIcon,
  IdentityTabBusinessCardIcon,
} from '~/assets/svg'
import { strings } from '~/translations'

enum IdentityTabIds {
  credentials = 'credentials',
  businessCard = 'businessCard',
}

const Identity = () => {
  const attributes = useSelector(getAttributes)
  const showIdentityIntro = !Boolean(Object.keys(attributes).length)

  // TODO: could we use a modal for the @IdentityIntro (@TopSheet)? Otherwise we
  // lose the functionality of the @ScreenContainer and it's styles, having to manually
  // add the container styles in a nested @View.
  return (
    <ScreenContainer isFullscreen>
      {showIdentityIntro ? (
        <IdentityIntro />
      ) : (
        <View
          style={{
            paddingHorizontal: '5%',
            paddingTop: 20,
            width: '100%',
            flex: 1,
          }}
        >
          <IdentityTabs initialTab={IdentityTabIds.credentials}>
            <IdentityTabs.Header>
              <IdentityTabs.Tab
                id={IdentityTabIds.credentials}
                title={strings.CREDENTIALS}
              >
                <IdentityTabCredentialsIcon />
              </IdentityTabs.Tab>
              <IdentityTabs.Tab
                id={IdentityTabIds.businessCard}
                title={strings.BUSINESS_CARD}
              >
                <IdentityTabBusinessCardIcon />
              </IdentityTabs.Tab>
            </IdentityTabs.Header>
            <IdentityTabs.Content>
              <IdentityTabs.Page id={IdentityTabIds.credentials}>
                <IdentityCredentials />
              </IdentityTabs.Page>
              <IdentityTabs.Page id={IdentityTabIds.businessCard}>
                {/* Business Card components */}
              </IdentityTabs.Page>
            </IdentityTabs.Content>
          </IdentityTabs>
        </View>
      )}
    </ScreenContainer>
  )
}

export default Identity
