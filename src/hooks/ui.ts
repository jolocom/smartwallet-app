import { useEffect, useState } from "react"
import { LayoutAnimation } from "react-native";

type onFn = () => void
interface IToggleExpand {
  onExpand?: onFn,
  onCollapse?: onFn
}

export const useToggleExpand = ({onExpand, onCollapse}: IToggleExpand = {}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handelToggleExpand = () => {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.easeInEaseOut,
      duration: 200,
    })
    setIsExpanded(prev => !prev);
  }

  useEffect(() => {
    if(isExpanded) {
      onExpand && onExpand()
    } else {
      onCollapse && onCollapse()
    }
  }, [isExpanded])

  return {
    isExpanded,
    onToggleExpand: handelToggleExpand
  }

}