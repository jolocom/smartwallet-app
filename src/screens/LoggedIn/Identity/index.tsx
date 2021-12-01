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
  const subtabs = [
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
      <Tabs subtabs={subtabs} initialActiveSubtab={subtabs[0]}>
        <ScreenContainer.Padding>
          <ScreenContainer.Header customStyles={{ marginBottom: 18 }}>
            {t('BottomBar.identity')}
          </ScreenContainer.Header>
          <TabsContainer customStyles={{ marginBottom: 12 }}>
            {subtabs.map((st) => (
              <Tabs.Subtab key={st.id} tab={st} />
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
