import FormFieldStyles from './FormField.module.scss'
import {FormField} from '@components/shared/FormFields/FormField'
import React from 'react'
import { providerLookupReducer } from '@store/reducer/providerLookupReducer'

export default function FormFieldInput(props) {
    const {labelColumnWidth=undefined, ignoreformfieldchild=false, addRequiredLabel=false, readonly=false, error} = props

    const onInputChange = (elm)=>{
        if(!readonly) {
            let value = elm.currentTarget.value
            if (props.InputFilter) {
                if (value === '' || (props.InputFilter(value) && props.fieldName && props.setFormField)) {
                    let obj = {}
                    obj[props.fieldName] = value
                    props.setFormField(obj)
                }
            } else {
                if (props.fieldName && props.setFormField) {
                    let obj = {}
                    obj[props.fieldName] = value
                    props.setFormField(obj)
                }
            }
        }
    }

    return (
        <FormField error={error} label={props.label} labelColumnWidth={labelColumnWidth} ignoreformfieldchild={ignoreformfieldchild} addRequiredLabel={addRequiredLabel}>
            {!readonly && <input type="text" value={props.value}
                   onChange={onInputChange}
                   maxLength={props?.maxLength}/>}
            {readonly && <input className={FormFieldStyles.readonlyinput} type="text" value={props.value}
                                 onChange={onInputChange}
                                 maxLength={props?.maxLength}/>}
        </FormField>
    )
}