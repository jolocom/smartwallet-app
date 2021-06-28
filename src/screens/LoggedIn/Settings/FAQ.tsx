import React from 'react'

import ScreenContainer from '~/components/ScreenContainer'
import BlockExpanded from '~/components/BlockExpanded'
// @ts-ignore
import faqJson from '~/translations/faq.json'
import { strings } from '~/translations/strings'
import CollapsibleClone from '~/components/CollapsibleClone'

type FAQArray = Array<{ question: string; answer: string }>

const FAQ = () => {
  const faqArray = faqJson as FAQArray

  const handleExpand = (index: number) => {
    // TODO: focus on block
  }

  return (
    <ScreenContainer
      customStyles={{ justifyContent: 'flex-start', paddingHorizontal: 0 }}
    >
      <CollapsibleClone renderHeader={() => <CollapsibleClone.Header />}>
        <ScreenContainer.Padding>
          <CollapsibleClone.Title text={strings.POPULAR_QUESTIONS} />
          {faqArray.map((item, idx) => (
            <BlockExpanded
              key={idx}
              title={item.question}
              expandedText={item.answer}
              onExpand={() => handleExpand(idx)}
            />
          ))}
        </ScreenContainer.Padding>
      </CollapsibleClone>
    </ScreenContainer>
  )
}

export default FAQ
