import { FlowType } from '@jolocom/sdk';
import React, { useCallback } from 'react';
import ScreenContainer from '~/components/ScreenContainer';
import TabsContainer from '~/components/Tabs/Container';
import Tabs from '~/components/Tabs/Tabs';
import { groupBySection } from '~/hooks/history/utils';
import { strings } from '~/translations';
import Record, { IPreLoadedInteraction } from './components/Record';

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
                <Record.Header />
                <Tabs initialActiveSubtab={SUBTABS[0]}>
                    <TabsContainer>
                        {SUBTABS.map((st) => (
                            <Tabs.Subtab key={st.id} tab={st} />
                        ))}
                    </TabsContainer>
                    <Tabs.Panel>
                        {({ activeSubtab }) => {
                            if (activeSubtab?.id === 'all') {
                                return (
                                    <Record.ItemsList sectionGetter={groupedAllInteractions} />
                                )
                            } else if (activeSubtab?.id === 'shared') {
                                return (
                                    <Record.ItemsList sectionGetter={groupedShareInteractions} />
                                )
                            } else if (activeSubtab?.id === 'received') {
                                return (
                                    <Record.ItemsList sectionGetter={groupedReceiveInteractions} />
                                )
                            }

                        }}
                    </Tabs.Panel>
                </Tabs>
            </Record>
        </ScreenContainer>
    )
}

export default History;