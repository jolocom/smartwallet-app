import React from 'react'
import { useSelector } from 'react-redux'
import { getSelectedShareCredentials } from '~/modules/interaction/selectors'
import { AttrKeys } from '~/types/credentials'
import Widget from '.'
import Field, { IWidgetField } from './Field'

interface IProps {
  onCreate: (attrKey: AttrKeys) => void
  onSelect: (attrKey: AttrKeys, value: string) => void
  fields: IWidgetField[]
  name: AttrKeys
}

const InteractionAttribbutesWidget: React.FC<IProps> = ({
  onCreate,
  onSelect,
  fields,
  name,
}) => {
  const selectedCredentials = useSelector(getSelectedShareCredentials)
  return (
    <Widget onCreate={onCreate} onSelect={onSelect} name={name}>
      <Widget.Header>
        <Widget.Header.Name children={name} />
        <Widget.Header.Action.CreateNew />
      </Widget.Header>
      {!fields.length ? (
        <Field.Empty />
      ) : (
        fields.map((field) => (
          <Field.Selectable
            key={field.id}
            id={field.id}
            value={field.value}
            isSelected={
              selectedCredentials
                ? selectedCredentials[name] === field.id
                : false
            }
          />
        ))
      )}
    </Widget>
  )
}

export default InteractionAttribbutesWidget
