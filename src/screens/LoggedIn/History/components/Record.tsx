import React, { useEffect, useMemo, useState } from 'react';
import { FlowType } from '@jolocom/sdk';

import { useCustomContext } from '~/hooks/context';
import RecordHeader from './RecordHeader';
import RecordItem from './RecordItem';
import RecordItemsList from './RecordItemsList';
import { useToasts } from '~/hooks/toasts';
import { useHistory } from '~/hooks/history';

interface IRecordContext {
  activeSection: string
  setActiveSection: React.Dispatch<React.SetStateAction<string>>
  setNextPage: React.Dispatch<React.SetStateAction<number>>
}

export interface IRecordItemProps {
  id: string
}

interface IRecordComposition {
  Header: React.FC
  ItemsList: React.FC
  Item: React.FC<IRecordItemProps>
}

export interface IPreLoadedInteraction {
  id: string
  section: string
  type: FlowType
}


const RecordContext = React.createContext<IRecordContext>({
  activeSection: '',
  setActiveSection: () => { },
  setNextPage: () => { }
});
RecordContext.displayName = 'RecordContext'

export const useRecord = useCustomContext(RecordContext);

const ITEMS_PER_PAGE = 4

const Record: React.FC & IRecordComposition = ({ children }) => {
  const [activeSection, setActiveSection] = useState('Today')
  const [page, setPage] = useState(0)
  const [allInteractions, setAllInteractions] = useState<
    IPreLoadedInteraction[]
  >([])
  const [loadedInteractions, setLoadedInteractions] = useState<
    IPreLoadedInteraction[]
  >([])
  const [isLoading, setLoading] = useState(true)

  const setNextPage = () => setPage((prev) => ++prev)

  const { scheduleErrorWarning } = useToasts()
  const { getInteractions } = useHistory()

  useEffect(() => {
    getInteractions()
      .then((all) => {
        setAllInteractions(all)
        setNextPage()
        setLoading(false)
      })
      .catch(scheduleErrorWarning)
  }, [])

  useEffect(() => {
    const pageInteractions = allInteractions.slice(
      ITEMS_PER_PAGE * page,
      ITEMS_PER_PAGE * page + ITEMS_PER_PAGE,
    )
    setLoadedInteractions((prev) => [...prev, ...pageInteractions])
  }, [page])

  const contextValue = useMemo(() => ({
    activeSection,
    setActiveSection,
    setNextPage,
    loadedInteractions
  }), []);
  return (
    <RecordContext.Provider value={contextValue} children={children} />
  )
}

Record.Header = RecordHeader;
Record.ItemsList = RecordItemsList;
Record.Item = RecordItem;

export default Record;