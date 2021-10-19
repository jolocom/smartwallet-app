import React, { useState } from 'react'

import ScreenContainer from '~/components/ScreenContainer'
import IdentityCredentials from './IdentityCredentials'
import IdentityTabs from './tabs'
import { IdentityTabIds } from './types'
import useTranslation from '~/hooks/useTranslation'
import Tabs from '~/components/Tabs/Tabs'
import TabsContainer from '~/components/Tabs/Container'

const Identity = () => {
  const { t } = useTranslation()
  const tabs = [
    { id: 'identity', value: 'Your Identity' },
    { id: 'credentials', value: 'Credentials' },
  ]

  return (
    <ScreenContainer
      testID="home-self-issued-credentials"
      customStyles={{
        justifyContent: 'flex-start',
        paddingHorizontal: 0,
      }}
    >
      <Tabs tabs={tabs} initialActiveTab={tabs[0]}>
        <ScreenContainer.Padding>
          <TabsContainer customStyles={{ marginBottom: 12 }}>
            {tabs.map((t) => (
              <Tabs.Tab key={t.id} tab={t} />
            ))}
          </TabsContainer>
        </ScreenContainer.Padding>
        <Tabs.Panel>
          {() => (
            <>
              <Tabs.Page id={'identity'}></Tabs.Page>
              <Tabs.Page id={'credentials'}>
                <IdentityCredentials />
              </Tabs.Page>
            </>
          )}
        </Tabs.Panel>
      </Tabs>
    </ScreenContainer>
  )
}

export default Identity
