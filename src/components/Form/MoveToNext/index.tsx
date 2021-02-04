import React, { MutableRefObject, useRef, useState } from 'react';
import { TextInput } from 'react-native';
import { useCustomContext } from '~/hooks/context';

interface IMoveToNextComposition {
  InputsCollector: React.FC
}
interface IMoveToNextContext {
  inputs: MutableRefObject<TextInput[]>
}
const MoveToNextContext = React.createContext<IMoveToNextContext>({inputs: {current: []}});
MoveToNextContext.displayName = 'MoveToNextContext';

const useMoveToNext = useCustomContext(MoveToNextContext)

const MoveToNext: React.FC & IMoveToNextComposition = ({children}) => {
  const inputs = useRef<TextInput[]>([])
  
  return (
    <MoveToNextContext.Provider value={{inputs}} children={children} />
  )
}

const InputsCollector: React.FC = ({ children }) => {
  const {inputs} = useMoveToNext();
  const [elIdx, setElIdx] = useState<number>(0) // this state keeps track of idx of a give element in inputs.current array

  const count = useRef(-1)

  const additionalProps = {
    onSubmitEditing: () => {       
        if (inputs.current[elIdx + 1]) {
          inputs.current[elIdx + 1].focus()
        }
        // NOTE: there is a possibility to add onSubmit here, not sure how useful is this use case
      },
      blurOnSubmit: !Boolean(inputs.current[elIdx + 1]),
      // because belows in an inline function, it will get called twice during updates, therefore limiting it to one call only
      ref: (ref: TextInput) => {
        ++count.current;
        if (!count.current) {
          setElIdx(inputs.current.length);
          inputs.current[inputs.current.length] = ref
        }
      }
  }
  
  const handleUpdateChildProps = (child) => {
    return React.cloneElement(child, additionalProps);    
  }
  return React.Children.map(children, handleUpdateChildProps);
}

MoveToNext.InputsCollector = InputsCollector;

export default MoveToNext;