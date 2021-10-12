import React from 'react'
import { View } from 'react-native'
import { useSafeArea } from 'react-native-safe-area-context'
import Collapsible from '~/components/Collapsible'
import JoloText from '~/components/JoloText'
import { NavHeaderType } from '~/components/NavigationHeader'
import ScreenContainer from '~/components/ScreenContainer'
import Space from '~/components/Space'
import InteractionSection from '~/screens/Modals/Interaction/InteractionFlow/components/InteractionSection'
import InteractionTitle from '~/screens/Modals/Interaction/InteractionFlow/components/InteractionTitle'
import {
  ContainerFAS,
  LogoContainerFAS,
} from '~/screens/Modals/Interaction/InteractionFlow/components/styled'
import { Colors } from '~/utils/colors'
import { useAusweisContext } from '../hooks'
import { AusweisLogo, AusweisTextLink } from '../styled'

const SectionText: React.FC = ({ children }) => (
  <JoloText customStyles={{ textAlign: 'left' }}>{children}</JoloText>
)

export const AusweisProviderDetails = () => {
  const { top } = useSafeArea()
  const {
    certificateIssuerName,
    certificateIssuerUrl,
    providerName,
    providerUrl,
    providerInfo,
  } = useAusweisContext()

  return (
    <View style={{ paddingTop: top, backgroundColor: Colors.mainBlack }}>
      <Collapsible
        renderHeader={() => <Collapsible.Header type={NavHeaderType.Close} />}
        renderScroll={() => (
          <ContainerFAS>
            <Collapsible.Scroll containerStyles={{ paddingBottom: '30%' }}>
              <Collapsible.Scale>
                <LogoContainerFAS>
                  <AusweisLogo />
                </LogoContainerFAS>
              </Collapsible.Scale>
              <Collapsible.Title text={'Provider information'}>
                <InteractionTitle label={'Provider information'} />
              </Collapsible.Title>
              <Space />
              <ScreenContainer.Padding>
                <InteractionSection title="Provider">
                  <SectionText>{providerName}</SectionText>
                  <AusweisTextLink
                    url={providerUrl}
                    customStyles={{ textAlign: 'left' }}
                  />
                </InteractionSection>
                <InteractionSection title="Certificate issuer">
                  <SectionText>{certificateIssuerName}</SectionText>
                  <AusweisTextLink
                    url={certificateIssuerUrl}
                    customStyles={{ textAlign: 'left' }}
                  />
                </InteractionSection>
                <InteractionSection title="Provider info">
                  <SectionText>{providerInfo}</SectionText>
                </InteractionSection>
              </ScreenContainer.Padding>
            </Collapsible.Scroll>
          </ContainerFAS>
        )}
      ></Collapsible>
    </View>
  )
}
