import React from 'react'

import ScreenContainer from '~/components/ScreenContainer'
import IdentityCredentials from './IdentityCredentials'
import Tabs from '~/components/Tabs/Tabs'
import TabsContainer from '~/components/Tabs/Container'
import { AusweisIdentity } from './AusweisIdentity'
import { ScrollView } from 'react-native'
import useTranslation from '~/hooks/useTranslation'

const Identity = () => {
  const { t } = useTranslation()
  const tabs = [
    { id: 'identity', value: t('Identity.headerAusweis') },
    { id: 'credentials', value: t('Identity.headerCredentials') },
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
            <ScrollView
              showsVerticalScrollIndicator={false}
              overScrollMode={'never'}
              contentContainerStyle={{
                paddingBottom: '20%',
              }}
            >
              <Tabs.Page id={'identity'}>
                <AusweisIdentity />
              </Tabs.Page>
              <Tabs.Page id={'credentials'}>
                <IdentityCredentials />
              </Tabs.Page>
            </ScrollView>
          )}
        </Tabs.Panel>
      </Tabs>
    </ScreenContainer>
  )
}

export default Identity
