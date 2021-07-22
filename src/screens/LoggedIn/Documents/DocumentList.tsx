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
import OtherCard from '~/components/Card/OtherCard'
import {
  CredentialCategories,
  DocumentFields,
  DisplayCredentialDocument,
  DisplayCredentialOther,
  CredentialsByType,
  CredentialsByIssuer,
  CredentialsByCategory,
  CredentialUITypes,
} from '~/types/credentials'
import ScreenPlaceholder from '~/components/ScreenPlaceholder'
import AdoptedCarousel from '~/components/AdoptedCarousel'
import { MainTabsParamList } from '../MainTabs'
import { ScreenNames } from '~/types/screens'
import JoloText from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import { Colors } from '~/utils/colors'
import BP from '~/utils/breakpoints'
import useTranslation from '~/hooks/useTranslation'
import { uiTypesTerms } from '~/hooks/signedCredentials/utils'
import { useCredentialOptionalFields } from '~/hooks/credentials'

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

export const DocumentList = () => {
  const { t } = useTranslation()
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
  const { activeTab, activeSubtab, setActiveTab, tabs } = useTabs()
  const route = useRoute<RouteProp<MainTabsParamList, ScreenNames.Documents>>()
  const { getOptionalFields } = useCredentialOptionalFields()

  const categoriesByType = useSelector(getCustomCredentialsByCategoriesByType)
  const categoriesByIssuer = useSelector(
    getCustomCredentialsByCategoriesByIssuer,
  )

  // NOTE: changing the active tab when the navigation params changed
  useLayoutEffect(() => {
    const newTabId = route.params.initialTab ?? CredentialCategories.document
    setActiveTab(tabs.find((t) => t.id === newTabId)!)
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
            title={t('Documents.placeholderHeader')}
            description={t('Documents.documentsPlaceholderSubheader')}
          />
        ) : (
          <CardList>
            {documents.map((d) => {
              const { credentials, value } = d as
                | CredentialsByType<DisplayCredentialDocument>
                | CredentialsByIssuer<DisplayCredentialDocument>
              /**
               * - if value is defined
               *   and it isn't not a <context.term> pattern: use it as a type;
               * - if value is empty make it unknown
               */
              let uiType: string | undefined =
                uiTypesTerms[value as CredentialUITypes]
              const credentialUIType = uiType
                ? // @ts-expect-error
                  t(uiType)
                : value === ''
                ? // @ts-expect-error
                  t(uiTypesTerms[CredentialUITypes.unknown])
                : value
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
                      {`${credentialUIType}  • ${credentials.length}`}
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
                            value: c.name || t('General.unknown'),
                          },
                          {
                            label: t('Documents.subjectNameField'),
                            // TODO: add new term Anonymous
                            value: c.holderName || t('General.unknown'),
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
            title={t('Documents.othersPlaceholderHeader')}
            description={t('Documents.othersPlaceholderSubheader')}
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
                            value: c.name || t('General.unknown'),
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
