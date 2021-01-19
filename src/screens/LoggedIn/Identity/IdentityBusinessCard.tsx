import React from 'react';
import { useSelector } from 'react-redux';
import { getBusinessCardAttributes } from '~/modules/attributes/selectors';
import EmptyPlaceholder, { IdentityPlaceholderTypes } from './components/EmptyPlaceholder';

const IdentityBusinessCard = () => {
 const attributes = useSelector(getBusinessCardAttributes);

 if (!attributes) {
  return (
   <EmptyPlaceholder type={IdentityPlaceholderTypes.businessCard} />
  )
 }
 return null
}

export default IdentityBusinessCard;