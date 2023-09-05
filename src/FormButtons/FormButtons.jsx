import React, { Component } from 'react'
import styles from './FormButtons.module.css'
// import { Button } from '@components/shared/AddButton/AddButton'

class FormButtons extends Component {
    constructor(props) {
        super(props)
        this.state = { 'submitButtonEnabled': true }
        props.setSubmitButtonState && props.setSubmitButtonState((state) => {
            this.state.submitButtonEnabled = state
        })
    }

    onCancelButtonClick = () => {
        if (this.props.OnCancelButtonClick) {
            this.props.OnCancelButtonClick()
        } else {
            this.props.closeModal(false)
        }
    };

    onCancelButton2Click = () => {
        if (this.props.OnCancelButton2Click) {
            this.props.OnCancelButton2Click()
        } else {
            this.props.closeModal(false)
        }
    };

    render() {
        const { buttonText, onButtonClick, inlineStyles = {} } = this.props
        let CancelButtonLeftImageSrc = this.props.CancelButtonLeftImageSrc
        let SubmitButtonRightImageSrc = this.props.SubmitButtonRightImageSrc

        let CancelButtonProps = {
            IsCancelButton: true,
            onButtonClick: this.onCancelButtonClick,
            title: (this.props.CancelButtonName ? this.props.CancelButtonName : 'Cancel'),
            Disabled: (this.props.DisableCancelButton ? this.props.DisableCancelButton : false)
        }

        let CancelButton2Props = {
            IsCancelButton: true,
            onButtonClick: this.onCancelButton2Click,
            title: (this.props.CancelButton2Name ? this.props.CancelButton2Name : 'Cancel'),
            Disabled: (this.props.DisableCancelButton ? this.props.DisableCancelButton : false)
        }

        if (CancelButtonLeftImageSrc) {
            CancelButtonProps['LeftImage'] = CancelButtonLeftImageSrc
        }
        if (this.props.CancelButtonClassName) {
            CancelButtonProps['ClassName'] = this.props.CancelButtonClassName
        }
        if (this.props.CancelButton2ClassName) {
            CancelButton2Props['ClassName'] = this.props.CancelButton2ClassName
        }
        let SubmitButtonProps = {
            IsCancelButton: false,
            onButtonClick: this.props.onButtonClick,
            title: (this.props.buttonText ? this.props.buttonText : 'Submit'),
            Disabled: (this.props.DisableSubmitButton ? this.props.DisableSubmitButton : false)
        }

        if (SubmitButtonRightImageSrc) {
            SubmitButtonProps['RightImage'] = SubmitButtonRightImageSrc
        }
        if (this.props.SubmitButtonClassName) {
            SubmitButtonProps['ClassName'] = this.props.SubmitButtonClassName
        }
        if (inlineStyles.SubmitButtonStyle) {
            SubmitButtonProps = { ...SubmitButtonProps, inlineStyle: inlineStyles.SubmitButtonStyle }
        }
        if (inlineStyles.CancelButtonStyle) {
            CancelButtonProps = { ...CancelButtonProps, inlineStyle: inlineStyles.CancelButtonStyle }
        }
        if (inlineStyles.CancelButton2Style) {
            CancelButton2Props = { ...CancelButton2Props, inlineStyle: inlineStyles.CancelButton2Style }
        }

        if (this.props.CancelButton2Name) {
            return (
                <div className={styles.buttons}>
                    {React.cloneElement(<button />, { ...CancelButton2Props })}
                    {React.cloneElement(<button />, { ...CancelButtonProps })}
                    {React.cloneElement(<button />, { ...SubmitButtonProps })}
                </div>
            )
        }
        else {
            return (
                <div className={styles.buttons}>
                    {React.cloneElement(<button />, { ...CancelButtonProps })}
                    {React.cloneElement(<button />, { ...SubmitButtonProps })}
                </div>
            )
        }
    }
}

export default FormButtons
