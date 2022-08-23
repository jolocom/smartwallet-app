import { useDispatch, useSelector } from "react-redux"
import { Document } from "~/hooks/documents/types"
import useSettings, { SettingKeys } from "~/hooks/settings"
import { addFavoriteDocument, deleteFavoriteDocument, setFavoriteDocuments } from "~/modules/credentials/actions"
import { getFavoriteDocuments } from "~/modules/credentials/selectors"

export const useFavoriteDocuments = () => {
  //NOTE: using the "settings" API temporarily until we set up the application storage
  const settings = useSettings()
  const dispatch = useDispatch()
  // @ts-expect-error
  const favorites = useSelector(getFavoriteDocuments) as Document[]

  const addFavorite = async (id: string) => {
    await settings.set(SettingKeys.favoriteDocuments, {
      all: [...[], id]
    })
    dispatch(addFavoriteDocument(id))
  }

  const getFavorites = async () => {
   const favorites = await settings.get(SettingKeys.favoriteDocuments) as { all: string[] }
   
   dispatch(setFavoriteDocuments(favorites.all))
   return favorites.all
  }

  const deleteFavorite = async (id: string) => {
    const filtered = favorites.filter(f => f !== id)
    await settings.set(SettingKeys.favoriteDocuments, {
      all:filtered 
    })
    dispatch(deleteFavoriteDocument(id))
  }

  return {
    favorites,
    addFavorite,
    getFavorites,
    deleteFavorite
  }
}