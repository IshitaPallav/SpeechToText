import { UIBinding } from '@components/shared/UIElementBindingsToState/UIElementBindingsToState'
import { FormField } from '@components/shared/FormFields/FormField'
import React from 'react'
import TextArea from '../TextArea/index'

export default function FormFieldTextArea(props) {
  const { labelColumnWidth = undefined, ignoreformfieldchild = false } = props
  let sty = {}
  if (props.textareastyle) {
    sty = props.textareastyle
  }
  return (
    <FormField
      label={props.label}
      labelColumnWidth={labelColumnWidth}
      ignoreformfieldchild={ignoreformfieldchild}
    >
      <TextArea
        type="text"
        value={props.value}
        style={sty}
        onChange={UIBinding.inputTextToState(
          props.fieldName,
          props.setFormField
        )}
        maxLength={props?.maxLength}
      />
    </FormField>
  )
}
