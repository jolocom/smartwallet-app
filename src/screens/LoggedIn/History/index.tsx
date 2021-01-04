import { FlowType } from '@jolocom/sdk';
import React, { useCallback } from 'react';
import ScreenContainer from '~/components/ScreenContainer';
import TabsContainer from '~/components/Tabs/Container';
import Tabs from '~/components/Tabs/Tabs';
import { IPreLoadedInteraction } from '~/hooks/history/types';
import { groupBySection } from '~/hooks/history/utils';
import { strings } from '~/translations';
import Record from './components/Record';

const SUBTABS = [
    { id: 'all', value: strings.ALL },
    { id: 'shared', value: strings.SHARED },
    { id: 'received', value: strings.RECEIVED },
]

const History = () => {
    const getGroupedInteractions = (
        appliedFn: (interact: IPreLoadedInteraction[]) => IPreLoadedInteraction[],
    ) =>
        useCallback((loadedInteractions) => groupBySection(appliedFn(loadedInteractions)), [])

    const groupedAllInteractions = getGroupedInteractions((n) => n)
    const groupedShareInteractions = getGroupedInteractions((n) =>
        n.filter((g) => g.type === FlowType.CredentialShare),
    )
    const groupedReceiveInteractions = getGroupedInteractions((n) =>
        n.filter((g) => g.type === FlowType.CredentialOffer),
    )

    return (
        <ScreenContainer customStyles={{ justifyContent: 'flex-start' }}>
            <Record>
                {/* Body will take care of displaying placeholder if there are no interactions */}
                <Record.Body>
                    <Record.Header />
                    <Tabs initialActiveSubtab={SUBTABS[0]}>
                        <TabsContainer>
                            {SUBTABS.map((st) => (
                                <Tabs.Subtab key={st.id} tab={st} />
                            ))}
                        </TabsContainer>
                        <Tabs.Panel>
                            {({ activeSubtab }) => (
                                <>
                                    <Tabs.PersistChildren isContentVisible={activeSubtab?.id === 'all'}>
                                        <Record.ItemsList sectionGetter={groupedAllInteractions} />
                                    </Tabs.PersistChildren>
                                    <Tabs.PersistChildren isContentVisible={activeSubtab?.id === 'shared'}>
                                        <Record.ItemsList sectionGetter={groupedShareInteractions} />
                                    </Tabs.PersistChildren>
                                    <Tabs.PersistChildren isContentVisible={activeSubtab?.id === 'received'}>
                                        <Record.ItemsList sectionGetter={groupedReceiveInteractions} />
                                    </Tabs.PersistChildren>

                                </>
                            )}
                        </Tabs.Panel>
                    </Tabs>
                </Record.Body>
            </Record>
        </ScreenContainer>
    )
}

export default History;