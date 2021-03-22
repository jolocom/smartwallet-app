import { OfferedCredential, OfferedCredentialDisplay, OtherCategory } from '~/types/credentials'
import { IIncomingCard } from '~/screens/Modals/Interaction/InteractionFlow/components/card/types'
import { CredentialRenderTypes } from 'jolocom-lib/js/interactionTokens/types';

export const separateIntoSections = <T extends IIncomingCard>(
  categories: Record<CredentialRenderTypes.document | OtherCategory.other, OfferedCredential[]>,
  details: T[] | null,
) => {
  console.log({details});
  if(details === null) {
    return Object.keys(categories).reduce<Record<CredentialRenderTypes.document | OtherCategory.other, OfferedCredentialDisplay[]>>((categoriesCustom, cName) => {
      const categoryName = cName as CredentialRenderTypes.document | OtherCategory.other;
      categoriesCustom[categoryName] = categories[categoryName].map(c => ({...c, properties: []}))
      return categoriesCustom;
    }, {[CredentialRenderTypes.document]: [], [OtherCategory.other]: []})
  }
  
  return Object.keys(categories).reduce<Record<CredentialRenderTypes.document | OtherCategory.other, OfferedCredentialDisplay[]>>((categoriesCustom, cName) => {
    const categoryName = cName as CredentialRenderTypes.document | OtherCategory.other;
    const updatedCategory = categories[categoryName].map(offeredC => {
      const displayDetails = details?.find(d => d.type === offeredC.type[1] && d.name === offeredC.name);
      
      return {
        ...offeredC,
        properties: displayDetails?.properties
      }
    })
    // TODO: fix types
    categoriesCustom[categoryName] = updatedCategory;
    return categoriesCustom;
  }, {[CredentialRenderTypes.document]: [], [OtherCategory.other]: []});
  }
