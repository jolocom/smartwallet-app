import React from 'react'

import ScreenContainer from '~/components/ScreenContainer'
import IdentityIntro from './IdentityIntro'
import { getAttributes } from '~/modules/attributes/selectors'
import { useSelector } from 'react-redux'
import IdentityCredentials from './IdentityCredentials'
import IdentityTabs from './tabs'
import { View } from 'react-native'
import { debugView } from '~/utils/dev'

const Identity = () => {
  const attributes = useSelector(getAttributes)
  const showIdentityIntro = !Boolean(Object.keys(attributes).length)

  return (
    <ScreenContainer isFullscreen>
      {showIdentityIntro ? (
        <IdentityIntro />
      ) : (
        <View
          style={{
            paddingHorizontal: '5%',
            paddingTop: 100,
            width: '100%',
            flex: 1,
          }}
        >
          <IdentityTabs initialTab="credentials">
            <IdentityTabs.Header>
              <IdentityTabs.Tab id="credentials">
                <IdentityTabs.Tab.Icon>
                  <View
                    style={{ width: 55, height: 55, backgroundColor: 'red' }}
                  />
                </IdentityTabs.Tab.Icon>
                <IdentityTabs.Tab.Title>Credentials</IdentityTabs.Tab.Title>
              </IdentityTabs.Tab>
              <IdentityTabs.Tab id="business-card">
                <IdentityTabs.Tab.Icon>
                  <View
                    style={{ width: 55, height: 55, backgroundColor: 'red' }}
                  />
                </IdentityTabs.Tab.Icon>
                <IdentityTabs.Tab.Title>Business Card</IdentityTabs.Tab.Title>
              </IdentityTabs.Tab>
            </IdentityTabs.Header>
          </IdentityTabs>
        </View>
      )}
    </ScreenContainer>
  )
}
/* <IdentityCredentials /> */

export default Identity
