import React from 'react';
import JoloText from '~/components/JoloText';

interface IProps {
 tags: string[]
}

const Dnd: React.FC<IProps> = ({tags}) => {
 return (
  <JoloText>Coming soon ...</JoloText>
 )
}

export default Dnd;