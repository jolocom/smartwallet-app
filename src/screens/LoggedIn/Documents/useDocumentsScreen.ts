import React, { useMemo } from "react"
import { LayoutAnimation } from "react-native"

import { StackData } from "~/components/CardStack"
import { useDocuments } from "~/hooks/documents"
import { Document } from "~/hooks/documents/types"
import { useRedirect } from "~/hooks/navigation"
import useTranslation from "~/hooks/useTranslation"
import { ScreenNames } from "~/types/screens"
import { useDocumentMenu } from "./useDocumentMenu"

export enum DocumentStacks {
  Favorites = 'favorites',
  All = 'all',
  Expired = 'expired',
}

export interface StackExtraData {
  name: string
  title: string
  subtitle: string
}

export const useDocumentsScreen = () => {
  const { documents, expiredDocuments } = useDocuments()
  const { t } = useTranslation()
  const redirect = useRedirect()

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
        data: [],
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
    [documents],
  )
  const [openedStack, setOpenedStack] = React.useState<DocumentStacks | null>(
    DocumentStacks.Favorites,
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
      setOpenedStack(null)
    } else {
      setOpenedStack(stackId)
    }
  }

  return { stackData, handleStackPress, openedStack, handlePressDetails, handlePressMenu }
}
