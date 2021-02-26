import React from 'react'
import { useSelector } from 'react-redux'
import { getSelectedShareCredentials } from '~/modules/interaction/selectors'
import Widget from '.'
import Field from './Field'
import { AttributeTypes } from '~/types/credentials'
import { IWidgetField } from './types'

interface IProps {
  onAdd: () => void
  onSelect: (attrType: AttributeTypes, id: string) => void
  fields: IWidgetField[]
  name: string
  type: AttributeTypes
}

const InteractionAttributesWidget: React.FC<IProps> = ({
  onAdd,
  onSelect,
  fields,
  name,
  type,
}) => {
  const selectedCredentials = useSelector(getSelectedShareCredentials)
  return (
    <Widget onAdd={onAdd}>
      <Widget.Header>
        <Widget.Header.Name value={name} />
        <Widget.Header.Action.CreateNew />
      </Widget.Header>
      {!fields.length ? (
        <Field.Empty />
      ) : (
        fields.map((field) => (
          <Field.Selectable
            key={field.id}
            value={field.value}
            onSelect={() => onSelect(type, field.id)}
            isSelected={
              selectedCredentials
                ? selectedCredentials[type] === field.id
                : false
            }
          />
        ))
      )}
    </Widget>
  )
}

export default InteractionAttributesWidget
