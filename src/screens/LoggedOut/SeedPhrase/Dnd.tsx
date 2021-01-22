import React from 'react';
import Pills from './draggable/ios/Pills';
import { IDndProps } from './SeedPhraseRepeat';

const Dnd: React.FC<IDndProps> = ({tags, updateTags}) => {
 return (
  <Pills tags={tags} updateTags={updateTags} />
 )
}

export default Dnd;