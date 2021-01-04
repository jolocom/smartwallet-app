import React from 'react';
import { useRecord } from './Record';

const RecordExpose = ({children}) => {
    const context = useRecord();
    return children(context);
}

export default RecordExpose;