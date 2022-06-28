import { useState, useEffect } from 'react'
import { Image } from 'react-native'

const useRenderIcon = (issuerIcon: string | undefined) => {
  const [renderIcon, setRenderIcon] = useState(false)

  const shouldRenderIcon = async (icon: string) => {
    let result
    try {
      result = (await Image.prefetch(icon)) as boolean
    } catch (e) {
      setRenderIcon(false)
    }
    setRenderIcon(result as boolean)
  }

  useEffect(() => {
    issuerIcon && shouldRenderIcon(issuerIcon)
  }, [])

  return { renderIcon }
}

export default useRenderIcon
