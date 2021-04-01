import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { ScrollView, View } from 'react-native'
import Carousel from 'react-native-snap-carousel'

import ScreenContainer from '~/components/ScreenContainer'
import DocumentCard from '~/components/Card/DocumentCard'
import { useTabs } from '~/components/Tabs/context'
import {
  getCustomCredentialsByCategoriesByType,
  getCustomCredentialsByCategoriesByIssuer,
} from '~/modules/credentials/selectors'
import DocumentTabs from '~/screens/LoggedIn/Documents/DocumentTabs'
import OtherCard from '~/components/Card/OtherCard'
import {
  DocumentTypes,
  DocumentFields,
  OtherCategory,
  DisplayCredentialDocument,
  DisplayCredentialOther,
  CredentialsByType,
  CredentialsByIssuer,
} from '~/types/credentials'
import ScreenPlaceholder from '~/components/ScreenPlaceholder'
import { strings } from '~/translations'
import { getOptionalFields } from './utils'
import { CredentialRenderTypes } from 'jolocom-lib/js/interactionTokens/types'
import { SCREEN_WIDTH } from '~/utils/dimensions'
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
  const [categories, setCategories] = useState<
    | CredentialsByType<DisplayCredentialDocument | DisplayCredentialOther>
    | CredentialsByIssuer<DisplayCredentialDocument | DisplayCredentialOther>
    | null
  >(null)
  const { activeTab, activeSubtab } = useTabs()

  const categoriesByType = useSelector(getCustomCredentialsByCategoriesByType)
  const categoriesByIssuer = useSelector(
    getCustomCredentialsByCategoriesByIssuer,
  )

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
      categories !== null ? categories[CredentialRenderTypes.document] : [],
    [JSON.stringify(categories)],
  )
  const other = useMemo(
    () => (categories !== null ? categories[OtherCategory.other] : []),
    [JSON.stringify(categories)],
  )

  if (categories === null) return null
  return (
    <>
      <View
        style={{
          display: activeTab?.id === DocumentTypes.document ? 'flex' : 'none',
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
              const { credentials, value } = d
              return (
                <>
                  <ScreenContainer.Padding>
                    {/* TODO: decide what we do with it, it does not look good */}
                    {/* <JoloText
                      size={JoloTextSizes.mini}
                      color={Colors.white90}
                      customStyles={{
                        textAlign: 'left',
                        marginBottom: BP({ default: 30, xsmall: 16 }),
                      }}
                    >
                      {`${value}  • ${credentials.length}`}
                    </JoloText> */}
                  </ScreenContainer.Padding>
                  <Carousel
                    layoutCardOffset={0}
                    contentContainerCustomStyle={{
                      marginLeft: -4,
                    }}
                    activeSlideAlignment="center"
                    data={credentials}
                    layout="default"
                    sliderWidth={SCREEN_WIDTH}
                    itemWidth={SCREEN_WIDTH * 0.85}
                    inactiveSlideOpacity={0.24}
                    renderItem={({ item: c }) => (
                      <DocumentCard
                        key={c.id}
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
          display: activeTab?.id === DocumentTypes.document ? 'none' : 'flex',
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
              const { credentials } = o
              return credentials.map((c) => (
                <OtherCard
                  id={c.id}
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
              ))
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
