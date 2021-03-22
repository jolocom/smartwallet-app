import React from 'react'
import InteractionCardDoc from '~/assets/svg/InteractionCardDoc'
import { strings } from '~/translations'
import ResponsiveCard from '../../ResponsiveCard'
import {
  BodyContainer,
  BodyFieldsContainer,
  BodyFieldsGroup,
  BodyImageContainer,
  EmptyContainer,
  HelperDescription,
  HelperTitle,
  HeaderContainer,
  CredentialName,
  FieldLabel,
} from '../styled'
import { IIncomingRequestDocCardProps } from '../types'

const MAX_FIELD_DOC = 2

export const IncomingRequestDoc: React.FC<IIncomingRequestDocCardProps> = ({
  name,
  holderName,
  properties,
  highlight,
  photo,
}) => {
  const handleFieldValuesVisibility = (
    child: React.ReactNode,
    idx: number,
    fieldLines: Record<number, number>,
    holderNameLines: number,
  ) => {
    if (idx + 1 > MAX_FIELD_DOC) {
      /* 1. Do not display anything that is more than max */
      return null
    } else if (
      (!!highlight && idx > 0 && fieldLines[0] > 1) ||
      (!!highlight && idx > 0 && holderNameLines > 1)
    ) {
      /* 2. Do not display all the fields besides first if number of lines of the first field is more than 1 and there is a highlight */
      return null
    }
    return child
  }

  const handleNumberOfValueLinesToDisplay = (
    idx: number,
    fieldLines: Record<number, number>,
  ) => {
    return idx !== 0 ? (fieldLines[0] > 1 ? 1 : 2) : 2
  }

  return (
    <ResponsiveCard>
      <ResponsiveCard.Container>
        <InteractionCardDoc>
          <HeaderContainer
            customStyles={{ flex: highlight || !properties.length ? 0 : 0.5 }}
          >
            <CredentialName numberOfLines={1}>{name}</CredentialName>
            {holderName && (
              <ResponsiveCard.HolderName>
                {holderName}
              </ResponsiveCard.HolderName>
            )}
          </HeaderContainer>
          {properties.length ? (
            <BodyContainer>
              <BodyFieldsContainer isStretched={!photo}>
                <ResponsiveCard.FieldsCalculator
                  cbFieldsVisibility={handleFieldValuesVisibility}
                >
                  {properties.map((p, idx) => (
                    <BodyFieldsGroup>
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
              {/* NOTE: this is to enable sort of a wrapper effect around an image */}
              {photo && <BodyImageContainer />}
            </BodyContainer>
          ) : (
            <EmptyContainer>
              <HelperTitle>{strings.INCLUDED_INFO}</HelperTitle>
              <HelperDescription>
                {strings.NO_INFO_THAT_CAN_BE_PREVIEWED}
              </HelperDescription>
            </EmptyContainer>
          )}

          {/* NOTE: absolute values go outside of containers */}
          {photo && <ResponsiveCard.Image imageUrl={photo} />}
          {highlight && (
            <ResponsiveCard.Highlight>{highlight}</ResponsiveCard.Highlight>
          )}
        </InteractionCardDoc>
      </ResponsiveCard.Container>
    </ResponsiveCard>
  )
}
