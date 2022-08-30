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
  const { scheduleInfo } = useToasts()
  const { t } = useTranslation()

  const animateLayout = () => {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.easeInEaseOut,
      duration: 200,
    })
  }

  const addFavorite = async (id: string) => {
    if (favorites.length > MAX_FAVORITES - 1) {
      scheduleInfo({
        title: t('Toasts.documentsFavoritesLimitTitle'),
        message: t('Toasts.documentsFavoritesLimitMsg', { max: MAX_FAVORITES }),
      })

      return
    }

    const updatedFavorites = [...favorites.map((d) => d.id), id]

    await settings.set(SettingKeys.favoriteDocuments, {
      all: updatedFavorites,
    })

    animateLayout()
    dispatch(addFavoriteDocument(id))
  }

  const getFavorites = async () => {
    const favorites = (await settings.get(SettingKeys.favoriteDocuments)) as {
      all: string[]
    }

    dispatch(setFavoriteDocuments(favorites.all))
    return favorites.all
  }

  const deleteFavorite = async (id: string) => {
    const filtered = favorites.filter((f) => f.id !== id)
    await settings.set(SettingKeys.favoriteDocuments, {
      all: filtered,
    })
    animateLayout()
    dispatch(deleteFavoriteDocument(id))
    if (filtered.length === 0) {
      dispatch(setOpenedStack(DocumentStacks.All))
    }
  }

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
