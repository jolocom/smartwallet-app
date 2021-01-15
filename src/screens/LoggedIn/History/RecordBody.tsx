import React from 'react';
import Record, { useRecord } from './Record';

const RecordBody: React.FC = ({ children }) => {
 const { loadedInteractions } = useRecord();
 if (!loadedInteractions.length) {
  return (
   <Record.Header />
  )
 }
 return <>{children}</>;
}

export default RecordBody