import { useState, useEffect } from 'react'
import { Image } from 'react-native'

const useImagePrefetch = (imageUrl?: string) => {
  const [prefetchedIcon, setPrefetchedIcon] = useState<string>()

  const shouldRenderIcon = (icon: string) => {
    ;(Image.prefetch(icon) as Promise<boolean>)
      .then((success) => {
        if (success) {
          setPrefetchedIcon(icon)
        }
      })
      .catch((err) => {
        console.warn(err)
      })
  }

  useEffect(() => {
    imageUrl && shouldRenderIcon(imageUrl)
  }, [])

  return prefetchedIcon
}

export default useImagePrefetch
