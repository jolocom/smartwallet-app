import React, {useRef } from 'react'
import {StyleSheet, View } from 'react-native'

import { Colors } from '~/utils/colors'
import WordPill from '../components/WordPill'
import type { TagObject } from './types'

type Props = {
  tag: TagObject
  onRender: (
    tag: TagObject,
    screenX: number,
    screenY: number,
    width: number,
    height: number,
  ) => void
}

const Pill: React.FC<Props> = ({ tag, onRender }) => {
  const { title } = tag
  const containerRef = useRef<View>(null)

  const onMeasure = (
    x: number,
    y: number,
    width: number,
    height: number,
    screenX: number,
    screenY: number,
  ) => {
    onRender(tag, screenX, screenY, width, height)
  }

  const onLayout = () => {
    setTimeout(() => {
        containerRef &&
          containerRef.current &&
        containerRef.current.measure(onMeasure)

      }, 100)
    }
    
  return (      
        <View ref={containerRef} style={styles.container} onLayout={onLayout}>
          <WordPill customContainerStyles={{shadowColor: Colors.white21, shadowOffset: {width: -3,height: -2}, shadowOpacity: 0.4}} customTextStyles={{color: Colors.serenade}}>
        {title}
            </WordPill> 
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginRight: 2,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bastille,
    borderRadius: 17,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  pillBeingDragged: {
    backgroundColor: Colors.disco,
    borderStyle: 'dashed',
  },
})

export default Pill
