import {UIBinding} from '@components/shared/UIElementBindingsToState/UIElementBindingsToState'
import {FormField} from '@components/shared/FormFields/FormField'
import React from 'react'
import {Specialities} from '../../../Constants'

export default function FormFieldSelect(props) {
    const {label='', value, setFormField=()=>{}, fieldName='', options=[], valueKey, display=()=>('NA'), idKey, emptyoption=false, labelColumnWidth=undefined, ignoreformfieldchild=false, addRequiredLabel=false, error} = props
    return (
        <FormField label={label} labelColumnWidth={labelColumnWidth} ignoreformfieldchild={ignoreformfieldchild} addRequiredLabel={addRequiredLabel} error={error}>
            <select value={value}
                    onChange={UIBinding.selectToState(fieldName, setFormField)}>
                { emptyoption && <option value="-1" key="-1" id="-1" ></option> }
                {
                    (options.map((item, index) => {
                        return (
                            <option key={props.optionkey && item[props.optionkey]?item[props.optionkey]: index} value={item[idKey]}
                                    id={props.idKey}>{display(item)}</option>
                        )
                    }))
                }
            </select>
        </FormField>
    )
}