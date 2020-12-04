import React from 'react'
import Widget from '.'
import Field from './Field'

const InteractionWidget: React.FC = () => {
  const props = {
    name: 'Name',
    onCreate: () => console.log('Creating new cred in widget'),
    fields: [
      { id: 'abc', value: 'Sveta' },
      { id: 'def', value: 'Sveta Buben' },
      { id: 'ghi', value: 'sbub' },
    ],
  }
  return (
    <Widget onCreate={props.onCreate}>
      <Widget.Header>
        <Widget.Header.Name children={props.name} />
        <Widget.Header.Action.CreateNew />
      </Widget.Header>
      {props.fields.map((field) => (
        <Field.ValueDisplay key={field.id} children={field.value} />
      ))}
    </Widget>
  )
}

export default InteractionWidget
