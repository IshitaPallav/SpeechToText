import React from 'react'
import Styles from './FormField.module.css'
import classNames from 'classnames'

export function FormField(props) {
    // Note: tableFormFieldWidth will be used if we want to show the field in the table format.
    let {children, label, fieldDisabled, labelColumnWidth, addRequiredLabel=false, ignoreformfieldchild=false, error} = props
    let formFieldClasses = fieldDisabled ? classNames(Styles.formfield, Styles.disabledformfield) : classNames(Styles.formfield)
    if (!labelColumnWidth) {
        return (
            <div className={formFieldClasses}>
                <div className={Styles.formfieldlabelcontainer}>
                    <div className={Styles.formfieldlabel}>
                        <label>{label}</label>
                        {(addRequiredLabel ? <span className={Styles.required}>*</span>: null)}
                    </div>
                </div>
                <div className={!ignoreformfieldchild?Styles.formfieldchild: ''}>
                    {children}
                </div>
                {error && <div className={Styles.error}>{error}</div>}
            </div>
        )
    } else {
        return (<tr>
            <td style={{width:labelColumnWidth}}>
                <div className={Styles.formfieldlabelcontainer}>
                    <div className={Styles.formfieldlabel}>                        
                        <label>{label}</label>
                        {(addRequiredLabel ? <span className={Styles.required}>*</span>: null)}
                    </div>
                </div>
            </td>
            <td style={{width: 'calc(100% - ' + labelColumnWidth + ')' }}>
                <div className={!ignoreformfieldchild?Styles.formfieldchild: ''}>
                    {children}
                </div>
                {error && <div className={Styles.error}>{error}</div>}
            </td>
        </tr>)
    }
}