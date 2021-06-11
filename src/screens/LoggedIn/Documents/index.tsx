import React, { useEffect, useMemo, useState, useLayoutEffect } from 'react'
import { useSelector } from 'react-redux'
import { ScrollView, View } from 'react-native'
import { useRoute, RouteProp } from '@react-navigation/native'

import ScreenContainer from '~/components/ScreenContainer'
import DocumentCard from '~/components/Card/DocumentCard'
import { useTabs } from '~/components/Tabs/context'
import {
  getCustomCredentialsByCategoriesByType,
  getCustomCredentialsByCategoriesByIssuer,
} from '~/modules/credentials/selectors'
import DocumentTabs, {
  documentTabs,
} from '~/screens/LoggedIn/Documents/DocumentTabs'
import OtherCard from '~/components/Card/OtherCard'
import {
  CredentialCategories,
  DocumentFields,
  DisplayCredentialDocument,
  DisplayCredentialOther,
  CredentialsByType,
  CredentialsByIssuer,
  CredentialsByCategory,
} from '~/types/credentials'
import ScreenPlaceholder from '~/components/ScreenPlaceholder'
import { strings } from '~/translations'
import { getOptionalFields } from './utils'
import AdoptedCarousel from '~/components/AdoptedCarousel'
import { MainTabsParamList } from '../MainTabs'
import { ScreenNames } from '~/types/screens'
import JoloText from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import { Colors } from '~/utils/colors'
import BP from '~/utils/breakpoints'

const CardList: React.FC = ({ children }) => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      overScrollMode={'never'}
      contentContainerStyle={{
        paddingBottom: '40%',
        paddingTop: 32,
      }}
    >
      {children}
    </ScrollView>
  )
}

const DocumentList = () => {
  const [categories, setCategories] =
    useState<
      | CredentialsByCategory<
          CredentialsByType<DisplayCredentialDocument | DisplayCredentialOther>
        >
      | CredentialsByCategory<
          CredentialsByIssuer<
            DisplayCredentialDocument | DisplayCredentialOther
          >
        >
      | null
    >(null)
  const { activeTab, activeSubtab, setActiveTab } = useTabs()
  const route = useRoute<RouteProp<MainTabsParamList, ScreenNames.Documents>>()

  const categoriesByType = useSelector(getCustomCredentialsByCategoriesByType)
  const categoriesByIssuer = useSelector(
    getCustomCredentialsByCategoriesByIssuer,
  )

  // NOTE: changing the active tab when the navigation params changed
  useLayoutEffect(() => {
    const newTabId = route.params.initialTab ?? CredentialCategories.document
    setActiveTab(documentTabs.find((t) => t.id === newTabId)!)
  }, [route])

  useEffect(() => {
    if (activeSubtab?.id === 'type') {
      setCategories(categoriesByType)
    } else if (activeSubtab?.id === 'issuer') {
      setCategories(categoriesByIssuer)
    }
  }, [
    activeSubtab?.id,
    JSON.stringify(categoriesByType),
    JSON.stringify(categoriesByIssuer),
  ])

  const documents = useMemo(
    () =>
      categories !== null ? categories[CredentialCategories.document] : [],
    [JSON.stringify(categories)],
  )
  const other = useMemo(
    () => (categories !== null ? categories[CredentialCategories.other] : []),
    [JSON.stringify(categories)],
  )

  if (categories === null) return null
  return (
    <>
      <View
        style={{
          display:
            activeTab?.id === CredentialCategories.document ? 'flex' : 'none',
          flex: 1,
        }}
        testID="document-cards-container"
      >
        {!documents.length ? (
          <ScreenPlaceholder
            title={strings.ITS_STILL_EMPTY}
            description={strings.YOU_HAVENT_SAVED_ANY_DOCUMENTS_YET}
          />
        ) : (
          <CardList>
            {documents.map((d) => {
              const { credentials, value } = d as
                | CredentialsByType<DisplayCredentialDocument>
                | CredentialsByIssuer<DisplayCredentialDocument>
              return (
                <>
                  <ScreenContainer.Padding>
                    <JoloText
                      size={JoloTextSizes.mini}
                      color={Colors.white90}
                      customStyles={{
                        textAlign: 'left',
                        marginBottom: BP({ default: 30, xsmall: 16 }),
                      }}
                    >
                      {`${value}  • ${credentials.length}`}
                    </JoloText>
                  </ScreenContainer.Padding>
                  <AdoptedCarousel
                    activeSlideAlignment="center"
                    customStyles={{ marginLeft: -4 }}
                    data={credentials}
                    renderItem={({ item: c }) => (
                      <DocumentCard
                        key={c.id}
                        type={c.type}
                        id={c.id}
                        mandatoryFields={[
                          {
                            label: DocumentFields.DocumentName,
                            value: c.name ?? c.type,
                          },
                          {
                            label: strings.SUBJECT_NAME,
                            value: c.holderName,
                          },
                        ]}
                        optionalFields={getOptionalFields(c)}
                        highlight={c.id.slice(0, 14)}
                        photo={c.photo}
                      />
                    )}
                  />
                </>
              )
            })}
          </CardList>
        )}
      </View>
      <View
        style={{
          display:
            activeTab?.id === CredentialCategories.document ? 'none' : 'flex',
          flex: 1,
        }}
        testID="other-cards-container"
      >
        {!other.length ? (
          <ScreenPlaceholder
            title={strings.NOTHING_HERE_YET}
            description={strings.YOU_HAVENT_SAVED_ANYTHING_YET}
          />
        ) : (
          <CardList>
            {other.map((o) => {
              const { credentials, value } = o as
                | CredentialsByType<DisplayCredentialOther>
                | CredentialsByIssuer<DisplayCredentialOther>
              return (
                <>
                  <ScreenContainer.Padding>
                    <JoloText
                      size={JoloTextSizes.mini}
                      color={Colors.white90}
                      customStyles={{
                        textAlign: 'left',
                        marginBottom: BP({ default: 30, xsmall: 16 }),
                      }}
                    >
                      {`${value}  • ${credentials.length}`}
                    </JoloText>
                  </ScreenContainer.Padding>

                  <AdoptedCarousel
                    data={credentials}
                    renderItem={({ item: c }) => (
                      <OtherCard
                        id={c.id}
                        type={c.type}
                        key={c.id}
                        mandatoryFields={[
                          {
                            label: DocumentFields.DocumentName,
                            value: c.name ?? c.type,
                          },
                        ]}
                        optionalFields={getOptionalFields(c)}
                        photo={c.photo}
                      />
                    )}
                  />
                </>
              )
            })}
          </CardList>
        )}
      </View>
    </>
  )
}

const Documents: React.FC = () => {
  return (
    <ScreenContainer
      customStyles={{
        justifyContent: 'flex-start',
        paddingHorizontal: 0,
      }}
    >
      <DocumentTabs>
        <DocumentList />
      </DocumentTabs>
    </ScreenContainer>
  )
}

export default Documents
