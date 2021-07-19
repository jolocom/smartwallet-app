import React from 'react'
import InteractionCardOther from '~/assets/svg/InteractionCardOther'
import Space from '~/components/Space'
import useTranslation from '~/hooks/useTranslation'
import ResponsiveCard from '../../ResponsiveCard'
import {
  BodyContainer,
  BodyFieldsContainer,
  BodyFieldsGroup,
  EmptyContainer,
  HelperDescription,
  HelperTitle,
  HeaderContainer,
  OtherContainer,
  CredentialName,
  FieldLabel,
} from '../styled'
import { IIncomingRequestDocCardProps } from '../types'

const MAX_FIELD_OTHER = 3

export const IncomingRequestOther: React.FC<IIncomingRequestDocCardProps> = ({
  name,
  properties,
}) => {
  const { t } = useTranslation()

  const handleChildVisibility = (
    child: React.ReactNode,
    idx: number,
    lines: Record<number, number>,
  ) => {
    if (idx + 1 > MAX_FIELD_OTHER) {
      /* 1. Do not display anything that is more than max */
      return null
    } else if (lines[0] && lines[1] && lines[0] + lines[1] > 2 && idx > 1) {
      /* 2. If the sum of first and second field values is greater than 2 do not display anything later*/
      return null
    }
    return child
  }

  /* NOTE: in other cards we can allow to display 2 lines
    constantly no matter how many lines are in the first value
  */
  const handleNumberOfValueLinesToDisplay = (idx: number) => {
    return 2
  }

  return (
    <ResponsiveCard>
      <ResponsiveCard.Container>
        <InteractionCardOther>
          <OtherContainer>
            <HeaderContainer customStyles={{ flex: 0, marginBottom: 10 }}>
              <CredentialName
                numberOfLines={2}
                customStyles={{ textAlign: 'left' }}
              >
                {!!name.length ? name : t('General.unknown')}
              </CredentialName>
            </HeaderContainer>
            {properties.length ? (
              <BodyContainer customStyles={{ flex: 0, alignSelf: 'flex-end' }}>
                <BodyFieldsContainer isStretched>
                  <ResponsiveCard.FieldsCalculator
                    cbFieldsVisibility={handleChildVisibility}
                  >
                    {properties.map((p, idx) => (
                      <BodyFieldsGroup>
                        {/* NOTE: Compared to Credential Request Document, these need additional spacing */}
                        <Space height={4} />
                        <FieldLabel>{p.label}</FieldLabel>
                        <ResponsiveCard.FieldValue
                          idx={idx}
                          onNumberOfFieldLinesToDisplay={
                            handleNumberOfValueLinesToDisplay
                          }
                        >
                          {p.value}
                        </ResponsiveCard.FieldValue>
                      </BodyFieldsGroup>
                    ))}
                  </ResponsiveCard.FieldsCalculator>
                </BodyFieldsContainer>
              </BodyContainer>
            ) : (
              <EmptyContainer>
                <HelperTitle>{t('CredentialOffer.cardInfoHeader')}</HelperTitle>
                <HelperDescription>
                  {t('CredentialOffer.cardNoPreview')}
                </HelperDescription>
              </EmptyContainer>
            )}
          </OtherContainer>
        </InteractionCardOther>
      </ResponsiveCard.Container>
    </ResponsiveCard>
  )
}
