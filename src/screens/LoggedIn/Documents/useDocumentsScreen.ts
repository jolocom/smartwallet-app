import { useMemo } from 'react'
import { LayoutAnimation } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import { StackData } from '~/components/CardStack'
import { useDocuments } from '~/hooks/documents'
import { Document } from '~/hooks/documents/types'
import { useRedirect } from '~/hooks/navigation'
import useTranslation from '~/hooks/useTranslation'
import { setOpenedStack } from '~/modules/credentials/actions'
import { getOpenedStack } from '~/modules/credentials/selectors'
import { DocumentStacks } from '~/modules/credentials/types'
import { ScreenNames } from '~/types/screens'
import { useDocumentMenu } from './useDocumentMenu'
import { useFavoriteDocuments } from './useFavoriteDocuments'

export interface StackExtraData {
  name: string
  title: string
  subtitle: string
}

export const useDocumentsScreen = () => {
  const { validDocuments: documents, expiredDocuments } = useDocuments()
  const { t } = useTranslation()
  const redirect = useRedirect()
  const {favorites: favoriteDocuments} = useFavoriteDocuments()
  const openedStack = useSelector(getOpenedStack)
  const dispatch = useDispatch()

  const onHandleMore = useDocumentMenu()

  const handlePressDetails = (id: string) => {
    redirect(ScreenNames.Main, {
      screen: ScreenNames.FieldDetails,
      params: {
        id,
      },
    })
  }

  const handlePressMenu = (c: Document) => {
    onHandleMore({
      id: c.id,
    })
  }

  const stackData = useMemo<StackData<Document, StackExtraData>[]>(
    () => [
      {
        stackId: DocumentStacks.Favorites,
        data: favoriteDocuments,
        extra: {
          name: t('Documents.favoriteSection'),
          title: t('Documents.favoritePlaceholderTitle'),
          subtitle: t('Documents.favoritePlaceholderSubtitle'),
        },
      },
      {
        stackId: DocumentStacks.All,
        data: documents,
        extra: {
          name: t('Documents.allSection'),
          title: t('Documents.allPlaceholderTitle'),
          subtitle: t('Documents.allPlaceholderSubtitle'),
        },
      },
      {
        stackId: DocumentStacks.Expired,
        data: expiredDocuments,
        extra: {
          name: t('Documents.expiredSection'),
          title: t('Documents.expiredPlaceholderTitle'),
          subtitle: t('Documents.expiredPlaceholderSubtitle'),
        },
      },
    ],
    [documents, expiredDocuments, favoriteDocuments],
  )

  const handleStackPress = (stackId: DocumentStacks) => {
    // NOTE: Not applying the "updated" configuration because it always animates the hiding with scaling,
    // which looks weird. In case the hiding animation has to be added, it must be custom made instead of LayoutAnimation.
    LayoutAnimation.configureNext({
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
    })
    if (openedStack === stackId) {
      dispatch(setOpenedStack(null))
    } else {
      dispatch(setOpenedStack(stackId))
    }
  }

  return {
    stackData,
    handleStackPress,
    openedStack,
    handlePressDetails,
    handlePressMenu,
  }
}
