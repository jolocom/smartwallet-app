import React from 'react'
import Section from '~/screens/LoggedIn/Settings/components/Section'
import Collapsible from '~/components/Collapsible'
import ScreenContainer from '~/components/ScreenContainer'
import { NavHeaderType } from '~/components/NavigationHeader'

const TermsOfService = () => {
  return (
    <ScreenContainer
      customStyles={{
        justifyContent: 'flex-start',
        paddingTop: 0,
      }}
    >
      <Collapsible
        renderHeader={() => <Collapsible.Header type={NavHeaderType.Back} />}
        renderScroll={() => (
          <ScreenContainer.Padding>
            <Collapsible.Scroll
              containerStyles={{
                paddingBottom: '30%',
              }}
            ></Collapsible.Scroll>
            <Collapsible.Title text={'asdf'}>
              <Section.Title customStyle={{ marginBottom: 16, marginTop: 16 }}>
                insert terms and service text here
              </Section.Title>
            </Collapsible.Title>
          </ScreenContainer.Padding>
        )}
      />
    </ScreenContainer>
  )
}

export default TermsOfService
