import {UIBinding} from '@components/shared/UIElementBindingsToState/UIElementBindingsToState'
import {FormField} from '@components/shared/FormFields/FormField'
import React from 'react'
import {Specialities} from '../../../Constants'
import {RadioButtonGroup} from '@components/shared/RadioButtonGroup'

export default function FormFieldRadioBtns(props) {
    const {label='', radios=[], defaultValue=undefined, onChange=()=>{}, alignTextLeft=true, horizontalAlignment = true,labelColumnWidth=undefined, ignoreformfieldchild=false, addRequiredLabel=false, getLabelText=(item)=>('Set getLabelText property to remove this'), getRadioBtnValue=(item)=>('')} = props
    return (
        <FormField label={label} labelColumnWidth={labelColumnWidth} ignoreformfieldchild={ignoreformfieldchild} addRequiredLabel={addRequiredLabel}>
            <RadioButtonGroup radios={radios} defaultValue={defaultValue} alignTextLeft={alignTextLeft} horizontalAlignment={horizontalAlignment} onChange={onChange} getLabelText={getLabelText} getRadioBtnValue={getRadioBtnValue}/>
        </FormField>
    )
}