import React from 'react'
import { useSelector } from 'react-redux'
import { getSelectedShareCredentials } from '~/modules/interaction/selectors'
import Widget from '.'
import Field, { IWidgetField } from './Field'

interface IProps {
  onCreate: (attrKey: string) => void
  onSelect: (attrKey: string, id: string) => void
  fields: IWidgetField[]
  attrKey: string
}

const InteractionAttributesWidget: React.FC<IProps> = ({
  onCreate,
  onSelect,
  fields,
  attrKey,
}) => {
  const selectedCredentials = useSelector(getSelectedShareCredentials)
  return (
    <Widget onCreate={onCreate}>
      <Widget.Header>
        <Widget.Header.Name value={attrKey} />
        <Widget.Header.Action.CreateNew />
      </Widget.Header>
      {!fields.length ? (
        <Field.Empty />
      ) : (
        fields.map((field) => (
          <Field.Selectable
            key={field.id}
            value={field.value}
            onSelect={() => onSelect(attrKey, field.id)}
            isSelected={
              selectedCredentials
                ? selectedCredentials[attrKey] === field.id
                : false
            }
          />
        ))
      )}
    </Widget>
  )
}

export default InteractionAttributesWidget
