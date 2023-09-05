import StatusOptions from '@components/shared/StatusOptions'
import { FormField } from '@components/shared/FormFields/FormField'
import React from 'react'

export default function FormFieldStatuses(props) {
  const {
    selected,
    statuses = [],
    onSelectionChange,
    noEmptyFilter = false,
    label = 'Status',
    labelColumnWidth = undefined,
    grouping = false,
  } = props

  return (
    <FormField
      label={label}
      labelColumnWidth={labelColumnWidth}
      addRequiredLabel={props.addRequiredLabel}
      error={props.error}
    >
      <StatusOptions
        selected={selected}
        statuses={statuses}
        onClickHandler={onSelectionChange}
        noEmptyFilter={noEmptyFilter}
        grouping={grouping}
      />
    </FormField>
  )
}
