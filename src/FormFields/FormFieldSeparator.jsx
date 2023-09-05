import Styles from './FormField.module.scss'
import classNames from 'classnames'

export function FormFieldSeparator(props) {
    // Note: tableFormFieldWidth will be used if we want to show the field in the table format.
    let {children, label, fieldDisabled, labelColumnWidth} = props
    let formFieldClasses = fieldDisabled ? classNames(Styles.formfield, Styles.disabledformfield) : classNames(Styles.formfield)
    if (!labelColumnWidth) {
        return (
            <div className={formFieldClasses}>
                <div className={Styles.formfieldseparator} style={{width: '100%', display: 'block'}}>
                    {children}
                </div>
            </div>
        )
    } else {
        return (<tr>
            <td colSpan="2" style={{width: labelColumnWidth}}>
                <div className={Styles.formfieldseparator} style={{width: '100%', display: 'block'}}>
                    {children}
                </div>
            </td>
        </tr>)
    }
}
 