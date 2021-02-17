import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { LayoutAnimation, PanResponder, StyleSheet, View } from 'react-native'
import { isPointWithinArea, moveArrayElement } from './utils'
import { TagObject, GestureState } from './types'
import Pill from './Pill'

interface PropsI {
  tags: string[]
  animationDuration?: number
  updateTags: (phrase: string[]) => void
}

const Pills: React.FC<PropsI> = ({
  tags,
  updateTags,
  animationDuration = 300,
}) => {
  const [keys, setKeys] = useState<TagObject[]>(() =>
    tags.map((title: string) => ({ title })),
  )

  const [dndEnabled, setDndEnabled] = useState(true)
  const [tagBeingDragged, setTagBeingDragged] = useState<TagObject | undefined>(
    undefined,
  )

  const [wordsAreVisible, setWordsVisibility] = useState(false)

  // NOTO: there is an issue with Pill measurement not being calculated correctly initially
  // delaying rendering of Pill-s solves it
  useEffect(() => {
    setTimeout(() => {
      setWordsVisibility(true)
    }, 100)
  }, [])

  useEffect(() => {
    enableDndAfterAnimating()
  }, [JSON.stringify(keys)])

  useEffect(() => {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.easeInEaseOut,
      duration: animationDuration,
    })
  })

  // Find out if we need to start handling tag dragging gesture
  const onMoveShouldSetPanResponder = (gestureState: GestureState) => {
    const { dx, dy, moveX, moveY, numberActiveTouches } = gestureState

    // Do not set pan responder if a multi touch gesture is occurring
    if (numberActiveTouches !== 1) {
      return false
    }

    // or if there was no movement since the gesture started
    if (dx === 0 && dy === 0) {
      return false
    }

    // Find the tag below user's finger at given coordinates
    const tag = findTagAtCoordinates(moveX, moveY)

    if (tag) {
      setTagBeingDragged(tag)
      // and tell PanResponder to start handling the gesture by calling `onPanResponderMove`
      return true
    }

    return false
  }

  // Called when gesture is granted
  const onPanResponderGrant = () => {
    if (tagBeingDragged) {
      updateTagState(tagBeingDragged, { isBeingDragged: true })
    }
  }

  // Handle drag gesture
  const onPanResponderMove = (gestureState: GestureState) => {
    const { moveX, moveY } = gestureState
    // Do nothing if dnd is disabled
    if (!dndEnabled) {
      return
    }
    // Find the tag we're dragging the current tag over
    const draggedOverTag = findTagAtCoordinates(moveX, moveY, tagBeingDragged)
    if (draggedOverTag && tagBeingDragged) {
      swapTags(tagBeingDragged, draggedOverTag)
    }
  }

  // Called after gesture ends
  const onPanResponderEnd = () => {
    // if (tagBeingDragged.current) {
    if (tagBeingDragged) {
      updateTagState(tagBeingDragged, { isBeingDragged: false })
    }
    setTagBeingDragged(undefined)
  }

  const enableDndAfterAnimating = () => {
    setTimeout(() => setDndEnabled(true), animationDuration)
  }

  //Find the tag at given coordinates
  const findTagAtCoordinates = useCallback(
    (x: number, y: number, exceptTag?: TagObject) => {
      return keys.find(
        (tag) =>
          tag.tlX &&
          tag.tlY &&
          tag.brX &&
          tag.brY &&
          isPointWithinArea(x, y, tag.tlX, tag.tlY, tag.brX, tag.brY) &&
          (!exceptTag || exceptTag.title !== tag.title),
      )
    },
    [JSON.stringify(keys)],
  )

  // Swap two tags
  const swapTags = useCallback(
    (draggedTag: TagObject, anotherTag: TagObject): void => {
      setKeys((prevState) => {
        const draggedTagIndex = prevState.findIndex(
          ({ title }) => title === draggedTag.title,
        )
        const anotherTagIndex = prevState.findIndex(
          ({ title }) => title === anotherTag.title,
        )
        const newKeys = moveArrayElement(
          prevState,
          draggedTagIndex,
          anotherTagIndex,
        )
        updateTags(newKeys.map((k) => k.title))
        return newKeys
      })
      setDndEnabled(false)
    },
    [],
  )

  // Update the tag in the state with given props
  const updateTagState = useCallback((tag: TagObject, props: Object) => {
    setKeys((prevState) => {
      const index = prevState.findIndex(({ title }) => title === tag.title)

      return [
        ...prevState.slice(0, index),
        {
          ...prevState[index],
          ...props,
        },
        ...prevState.slice(index + 1),
      ]
    })
  }, [])

  // Update tag coordinates in the state
  const onRenderTag = useCallback(
    (
      tag: TagObject,
      screenX: number,
      screenY: number,
      width: number,
      height: number,
    ): void => {
      updateTagState(tag, {
        tlX: screenX,
        tlY: screenY,
        brX: screenX + width,
        brY: screenY + height,
      })
    },
    [],
  )

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        // Handle drag gesture
        onMoveShouldSetPanResponder: (_, gestureState: GestureState) =>
          onMoveShouldSetPanResponder(gestureState),
        onPanResponderGrant: () => onPanResponderGrant(),
        onPanResponderMove: (_, gestureState: GestureState) =>
          onPanResponderMove(gestureState),
        // Handle drop gesture
        onPanResponderRelease: () => onPanResponderEnd(),
        onPanResponderTerminate: () => onPanResponderEnd(),
      }),
    [JSON.stringify(keys), dndEnabled, JSON.stringify(tagBeingDragged)],
  )

  return (
    <View {...panResponder.panHandlers} style={styles.container}>
      {wordsAreVisible
        ? keys.map((tag) => (
            <Pill
              key={tag.title}
              tag={tag}
              onRender={onRenderTag}
              isActive={tagBeingDragged?.title === tag.title}
            />
          ))
        : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default Pills
