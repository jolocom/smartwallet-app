import React, { useEffect, useMemo, useState, useLayoutEffect } from 'react'
import { useSelector } from 'react-redux'
import { ScrollView, StyleSheet, View } from 'react-native'
import { useRoute, RouteProp } from '@react-navigation/native'
import { TFunction } from 'i18next'
import { DisplayVal } from '@jolocom/sdk/js/credentials'

import ScreenContainer from '~/components/ScreenContainer'
import { useTabs } from '~/components/Tabs/context'
import {
  getCustomCredentialsByCategoriesByType,
  getCustomCredentialsByCategoriesByIssuer,
} from '~/modules/credentials/selectors'
import {
  CredentialCategories,
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
import {
  useCredentialOptionalFields,
  useDeleteCredential,
} from '~/hooks/credentials'
import { useToasts } from '~/hooks/toasts'
import { usePopupMenu } from '~/hooks/popupMenu'
import DocumentSectionDocumentCard from '~/components/Cards/DocumentSectionCards/DocumentSectionDocumentCard'
import DocumentSectionOtherCard from '~/components/Cards/DocumentSectionCards/DocumentSectionOtherCard'

const getCredentialDisplayType = (displayType: string, t: TFunction) => {
  /**
   * - if value is defined
   *   and it isn't not a <context.term> pattern: use it as a type;
   * - if value is empty make it unknown
   */
  const uiType: string | undefined =
    uiTypesTerms[displayType as CredentialUITypes]

  const credentialUIType = uiType
    ? t(uiType)
    : displayType === ''
    ? t(uiTypesTerms[CredentialUITypes.unknown])
    : displayType
  return credentialUIType
}

const useHandleMorePress = () => {
  const { t } = useTranslation()
  const { scheduleErrorWarning } = useToasts()

  const { showPopup } = usePopupMenu()
  const deleteCredential = useDeleteCredential()
  const handleDelete = async (id: string) => {
    try {
      await deleteCredential(id)
    } catch (e) {
      scheduleErrorWarning(e)
    }
  }

  return (
    id: string,
    credentialName: string,
    fields: Array<Required<DisplayVal>>,
    photo?: string,
  ) => {
    const popupOptions = [
      {
        title: t('Documents.infoCardOption'),
        navigation: {
          screen: ScreenNames.CredentialDetails,
          params: {
            fields,
            photo,
            title: credentialName,
          },
        },
      },
      {
        title: t('Documents.deleteCardOption'),
        navigation: {
          screen: ScreenNames.DragToConfirm,
          params: {
            title: `${t('Documents.deleteDocumentHeader', {
              documentName: credentialName,
            })}`,
            cancelText: t('Documents.cancelCardOption'),
            instructionText: t('Documents.deleteCredentialInstruction'),
            onComplete: () => handleDelete(id),
          },
        },
      },
    ]
    showPopup(popupOptions)
  }
}

const CardList: React.FC = ({ children }) => (
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

  const onHandleMore = useHandleMorePress()

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

              const credentialUIType = getCredentialDisplayType(value, t)
              return (
                <View style={styles.sectionContainer}>
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
                    customStyles={{ marginLeft: -12 }}
                    data={credentials}
                    renderItem={({ item: c, index }) => (
                      <DocumentSectionDocumentCard
                        key={`${index}-${c.id}`}
                        credentialName={c.name || t('General.unknown')}
                        holderName={c.holderName || t('General.anonymous')}
                        fields={getOptionalFields(c)}
                        highlight={c.id}
                        photo={c.photo}
                        onHandleMore={() =>
                          onHandleMore(
                            c.id,
                            c.name,
                            [
                              {
                                key: 'subjectName',
                                label: t('Documents.subjectNameField'),
                                value: c.holderName || t('General.anonymous'),
                              },
                              ...getOptionalFields(c),
                            ],
                            c.photo,
                          )
                        }
                      />
                    )}
                  />
                </View>
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
              const credentialUIType = getCredentialDisplayType(value, t)

              return (
                <View style={styles.sectionContainer}>
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
                    data={credentials}
                    customStyles={{ marginLeft: -12 }}
                    renderItem={({ item: c, index }) => {
                      const fields = getOptionalFields(c)
                      return (
                        <DocumentSectionOtherCard
                          key={`${index}-${c.id}`}
                          credentialName={c.name || t('General.unknown')}
                          credentialType={credentialUIType}
                          fields={fields}
                          logo={c.photo}
                          onHandleMore={() =>
                            onHandleMore(c.id, c.name, fields, c.photo)
                          }
                        />
                      )
                    }}
                  />
                </View>
              )
            })}
          </CardList>
        )}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  sectionContainer: {
    paddingBottom: 22,
  },
})
