import React, { useState } from 'react'
import ScreenContainer from '~/components/ScreenContainer'
import Collapsible from '~/components/Collapsible'
import JoloText from '~/components/JoloText'
import Section from '../components/Section'
import NavigationHeader, { NavHeaderType } from '~/components/NavigationHeader'
import SingleSelectBlock from '~/components/SingleSelectBlock'
import { View } from 'react-native'
import { debugView } from '~/utils/dev'

enum HeaderType {
  default = 'default',
  animated = 'animated',
}
const CollapsibleTest = () => {
  const [headerType, setHeaderType] = useState<HeaderType>(HeaderType.default)
  const Header =
    headerType === 'animated' ? Collapsible.AnimatedHeader : Collapsible.Header

  return (
    <Collapsible>
      <Header height={62}>
        <NavigationHeader type={NavHeaderType.Back}>
          <Collapsible.HeaderText>@HeaderText</Collapsible.HeaderText>
        </NavigationHeader>
      </Header>
      <ScreenContainer>
        <Collapsible.ScrollView>
          <Collapsible.HidingScale>
            <JoloText customStyles={{ marginTop: 50 }}>
              This is the @HidingScale component, which hides together with
              scrolling
            </JoloText>
          </Collapsible.HidingScale>
          <Collapsible.HidingTextContainer>
            <Section.Title>@HidingTextContainer</Section.Title>
          </Collapsible.HidingTextContainer>
          <View style={{ paddingVertical: 20 }}>
            <SingleSelectBlock
              selection={[
                { id: HeaderType.default, value: '@Header' },
                { id: HeaderType.animated, value: '@AnimatedHeader' },
              ]}
              initialSelect={{ id: HeaderType.default, value: '@Header' }}
              onSelect={(header) => setHeaderType(header.id as HeaderType)}
            />
          </View>
          <JoloText customStyles={{ textAlign: 'left' }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
            cursus augue at interdum viverra. Sed rutrum eget est at
            sollicitudin. Praesent auctor lorem lacinia, dignissim justo eget,
            condimentum risus. Quisque id lectus a purus pellentesque lacinia.
            Nunc venenatis commodo molestie. Donec ornare urna a vulputate
            vulputate. Praesent consequat viverra libero euismod auctor. Nam et
            pulvinar dui. Phasellus dictum sodales ligula, in suscipit eros
            viverra a. Praesent tristique libero at sodales scelerisque. Cras
            nec laoreet nisl. Curabitur sed nisl congue, tincidunt ante non,
            interdum nisl. In eleifend nisi id scelerisque blandit. Praesent
            pulvinar tellus et eros vehicula tristique. Nam vel diam quis massa
            tempus finibus. Nunc non ultricies nisi, eget ornare mauris.
            Praesent convallis aliquam mi a laoreet. Nulla facilisis convallis
            lacus sed dictum. Pellentesque diam lectus, pharetra eu lacus vitae,
            tincidunt vulputate ex. Nunc nec pellentesque ligula. Nunc pulvinar,
            nulla nec porta mollis, neque ante efficitur ante, sed scelerisque
            velit massa quis elit. Integer faucibus est ac elit consectetur
            porttitor. Mauris vulputate lacus felis, nec varius urna accumsan
            non. Morbi ut posuere arcu. Nulla facilisi. Pellentesque varius
            lectus purus, eget varius mi sodales vel. Nullam eget tellus
            euismod, semper arcu quis, ultricies quam. Sed velit velit, gravida
            ornare imperdiet non, condimentum eu ligula. Lorem ipsum dolor sit
            amet, consectetur adipiscing elit. Ut auctor turpis vulputate eros
            luctus, non dictum libero maximus. Donec tempor semper lacinia. Sed
            in suscipit arcu. Suspendisse potenti. Aliquam dictum lobortis
            justo, id suscipit odio euismod vel. In tempor pretium auctor.
            Integer egestas bibendum nulla, vel elementum eros aliquam vitae.
            Phasellus in est eget eros accumsan pretium. Integer ac quam eu
            felis imperdiet gravida cursus at elit. Class aptent taciti sociosqu
            ad litora torquent per conubia nostra, per inceptos himenaeos. Sed
            euismod non velit vitae mollis. Proin justo nunc, aliquam vitae
            rhoncus nec, volutpat eu nisl. Nulla facilisi. In hac habitasse
            platea dictumst.
          </JoloText>
        </Collapsible.ScrollView>
      </ScreenContainer>
    </Collapsible>
  )
}

export default CollapsibleTest
