import styles from './FormFieldColumnWise.module.css'
import classNames from 'classnames'
import React from 'react'

export default function FormFieldColumnWise(props) {
    const {labelColumnWidth, children, inlineStyle={}} = props
    const childrenWithProps = React.Children.map(children, (child, index) => {
        return React.cloneElement(child, {
           labelColumnWidth
        })
    })
    return (
        <table width="100%" className={styles.formfieldtable} style={{...{tableLayout:'fixed'}, ...inlineStyle}}>
            <tbody>
            {childrenWithProps}
            </tbody>
        </table>
    )
}