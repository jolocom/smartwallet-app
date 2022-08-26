import { useDispatch, useSelector } from "react-redux"
import useSettings, { SettingKeys } from "~/hooks/settings"
import { useToasts } from "~/hooks/toasts"
import { addFavoriteDocument, deleteFavoriteDocument, setFavoriteDocuments, setOpenedStack } from "~/modules/credentials/actions"
import { getFavoriteDocuments } from "~/modules/credentials/selectors"
import { DocumentStacks } from "~/modules/credentials/types"

const MAX_FAVORITES = 5

export const useFavoriteDocuments = () => {
  //NOTE: using the "settings" API temporarily until we set up the application storage
  const settings = useSettings()
  const dispatch = useDispatch()
  const favorites = useSelector(getFavoriteDocuments)
  const {scheduleInfo} = useToasts()

  const addFavorite = async (id: string) => {
    if(favorites.length >= MAX_FAVORITES) {
      scheduleInfo({
        title: "Wow wow!",
        message: `You can't have more than ${MAX_FAVORITES} favorites`,
      })

      return
    }

    await settings.set(SettingKeys.favoriteDocuments, {
      all: [...[], id]
    })
    dispatch(addFavoriteDocument(id))
    dispatch(setOpenedStack(DocumentStacks.Favorites))
  }

  const getFavorites = async () => {
   const favorites = await settings.get(SettingKeys.favoriteDocuments) as { all: string[] }
   
   dispatch(setFavoriteDocuments(favorites.all))
   return favorites.all
  }

  const deleteFavorite = async (id: string) => {
    const filtered = favorites.filter(f => f.id !== id)
    await settings.set(SettingKeys.favoriteDocuments, {
      all:filtered 
    })
    dispatch(deleteFavoriteDocument(id))
    if(filtered.length === 1) {
      dispatch(setOpenedStack(DocumentStacks.All))
    }
  }

  return {
    favorites,
    addFavorite,
    getFavorites,
    deleteFavorite
  }
}