import { useCallback } from 'react'
import { LayoutAnimation } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import useSettings, { SettingKeys } from '~/hooks/settings'
import { useToasts } from '~/hooks/toasts'
import useTranslation from '~/hooks/useTranslation'
import {
  addFavoriteDocument,
  deleteFavoriteDocument,
  setFavoriteDocuments,
  setOpenedStack,
} from '~/modules/credentials/actions'
import { getFavoriteDocuments } from '~/modules/credentials/selectors'
import { DocumentStacks } from '~/modules/credentials/types'

const MAX_FAVORITES = 5

export const useFavoriteDocuments = () => {
  //NOTE: using the "settings" API temporarily until we set up the application storage
  const settings = useSettings()
  const dispatch = useDispatch()
  const favorites = useSelector(getFavoriteDocuments)
  const { scheduleInfo, scheduleErrorWarning } = useToasts()
  const { t } = useTranslation()

  const animateLayout = () => {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.easeInEaseOut,
      duration: 200,
    })
  }

  const addFavorite = async (id: string) => {
    const favorites = await getFavorites()
    if (favorites.length > MAX_FAVORITES - 1) {
      scheduleInfo({
        title: t('Toasts.documentsFavoritesLimitTitle'),
        message: t('Toasts.documentsFavoritesLimitMsg', { max: MAX_FAVORITES }),
      })

      return
    }

    const updatedFavorites = [...favorites.map((docId) => docId), id]

    await settings.set(SettingKeys.favoriteDocuments, {
      all: updatedFavorites,
    })

    animateLayout()
    dispatch(addFavoriteDocument(id))
  }

  const getFavorites = async () => {
    try {
      const favorites = (await settings.get(SettingKeys.favoriteDocuments)) as {
        all: string[]
      }

      dispatch(setFavoriteDocuments(favorites.all))
      return favorites.all
    } catch (e) {
      if (e instanceof TypeError) {
        return []
      } else {
        scheduleErrorWarning(e as Error)
      }
    }
  }

  const deleteFavorite = useCallback(
    async (id: string) => {
      const favorites = await getFavorites()

      const filtered = favorites
        .filter((documentId) => documentId !== id)
        .map((document) => document)

      await settings.set(SettingKeys.favoriteDocuments, {
        all: filtered,
      })
      animateLayout()
      dispatch(deleteFavoriteDocument(id))
      if (filtered.length === 0) {
        dispatch(setOpenedStack(DocumentStacks.All))
      }
    },
    [favorites.length],
  )

  const resetFavorites = async () => {
    await settings.set(SettingKeys.favoriteDocuments, {
      all: [],
    })
  }

  return {
    favorites,
    addFavorite,
    getFavorites,
    deleteFavorite,
    resetFavorites,
  }
}
