import React from 'react';
import Pills from './draggable/Pills';

interface IProps {
 tags: string[]
}

const Dnd: React.FC<IProps> = ({tags}) => {
 return (
  <Pills tags={tags}/>
 )
}

export default Dnd;