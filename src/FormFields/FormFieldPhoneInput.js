import FormFieldStyles from './FormField.module.scss'
import {FormField} from '@components/shared/FormFields/FormField'
import React from 'react'
import { providerLookupReducer } from '@store/reducer/providerLookupReducer'
import { formatPhoneNumber } from 'src/helpers'

export default function FormFieldInput(props) {
    const {labelColumnWidth=undefined, ignoreformfieldchild=false, addRequiredLabel=false, readonly=false, error} = props

    const onInputChange = (elm)=>{
        if(!readonly) {
            let formattedPhoneNumber = formatPhoneNumber(elm.currentTarget.value)
            if (props.fieldName && props.setFormField) {
                let obj = {}
                obj[props.fieldName] = formattedPhoneNumber
                props.setFormField(obj)
            }
        }
    }

    return (
        <FormField label={props.label} labelColumnWidth={labelColumnWidth} ignoreformfieldchild={ignoreformfieldchild} addRequiredLabel={addRequiredLabel} error={error}>
            {!readonly && <input type="text" value={props.value}
                onChange={(e) => onInputChange(e)}
                maxLength={props?.maxLength}/>}
            {readonly && <input className={FormFieldStyles.readonlyinput} type="text" value={props.value}
                onChange={(e) => onInputChange(e)}
                maxLength={props?.maxLength}/>}
        </FormField>
    )
}