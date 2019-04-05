// TODO UPDATE WITH ENZYME
import React from 'react'
import { Block } from 'src/ui/structure/'
import { StyleSheet } from 'react-native'

const ShallowRenderer = require('react-test-renderer/shallow')

describe('generic block component', () => {
  it('matches the snapshot with no extra props', () => {
    const renderer = new ShallowRenderer()
    const rendered = renderer.render(<Block> null </Block>)
    expect(rendered).toMatchSnapshot()
  })

  it('matches snapshot with flex prop', () => {
    const renderer = new ShallowRenderer()
    const rendered = renderer.render(<Block flex={0.1}> null </Block>)
    expect(rendered).toMatchSnapshot()
  })

  it('matches the snapshot with debug prop', () => {
    const renderer = new ShallowRenderer()
    const rendered = renderer.render(<Block debug> null </Block>)
    expect(rendered).toMatchSnapshot()
  })

  it('matches the snapshot with style prop', () => {
    const renderer = new ShallowRenderer()
    const styles = StyleSheet.create({
      block: {
        width: '30%',
        backgroundColor: 'blue',
      },
    })

    const rendered = renderer.render(
      <Block style={styles.block} onTouch={() => {}}>
        null
      </Block>,
    )
    expect(rendered).toMatchSnapshot()
  })
})
