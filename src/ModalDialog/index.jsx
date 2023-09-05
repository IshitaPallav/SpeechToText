import React, { Component } from 'react'
import styles from './ModalDialog.module.css'
import classNames from 'classnames'

const nextZIndex = (() => {
    let lastUsedModalZIndex = 1000
    return {
        next: () => {
            return { zIndex: (lastUsedModalZIndex + 1) }
        },
        pop: () => {
            lastUsedModalZIndex = lastUsedModalZIndex - 1
        }
    }
})()

export const MODAL_STATES = {
    INVALID: 'INVALID',
    OPENED: 'OPENED',
    CLOSING: 'CLOSING',
    CLOSED: 'CLOSED'
}

export const MODAL_CLOSE_ACTION = {
    X_BUTTON: 'XBUTTON',
    CANCEL_BUTTON: 'CANCEL_BUTTON'
}

class ModalDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            canCloseModalHandler: (closeModal) => {
                closeModal(true)
            },
            activeDrags: 0,
            deltaPosition: {
                x: 0, y: 0
            },
            controlledPosition: {
                x: -400, y: 200
            },
            titleRequestedByChild: ''
        }
    }
    beforeModalClose = (canCloseModalHandler) => {
        this.state.canCloseModalHandler = canCloseModalHandler
    };
    
    confirmModalClose = (foreClose, closeArgs) => {
        if (closeArgs && !closeArgs.ModalCloseAction) {
            closeArgs.ModalCloseAction = MODAL_CLOSE_ACTION.CANCEL_BUTTON
        }
        let args = closeArgs ? [MODAL_STATES.CLOSED].concat(closeArgs) : [MODAL_STATES.CLOSED]
        if (foreClose) { /* closing forcefully */
            nextZIndex.pop()
            this.props.onModalStateChange.apply(this, args)
        } else {
            this.state.canCloseModalHandler((closeModalConfirmed) => {
                if (closeModalConfirmed) {
                    nextZIndex.pop()
                    this.props.onModalStateChange.apply(this, args)
                }
            })
        }
    };
    
    HandleCloseModal = (foreClose, closeArgs) => {
        this.confirmModalClose(foreClose, closeArgs)
    };
    

    render() {
        const { children, title, hideCloseButton, show } = this.props
        let closeButtonHidden = false
        if (hideCloseButton) {
            closeButtonHidden = true
        }
        let sty = {}
        if (this.props.width) {
            sty['width'] = this.props.width
        } else {
            sty['width'] = '30vw'
        }
        if (!show()) {
            return <></>
        }

        return (
            <div className={styles.overlay} data-testid="modal-dialog">
                <div className={styles.content} style={sty}>
                <div className={classNames(styles.titlebar, 'dragmodalhandle')}>
                            {(!closeButtonHidden && <img alt="Close" src="/images/remove-x.svg" style={{ cursor: 'unset' }} onClick={() => { this.HandleCloseModal(false, { ModalCloseAction: MODAL_CLOSE_ACTION.X_BUTTON }) }} />)}
                            <span className={styles.title}>{this.state.titleRequestedByChild && this.state.titleRequestedByChild != "" ? this.state.titleRequestedByChild : title}</span>
                        </div>
                        <div className={styles.modalchild}>
                            {React.cloneElement(children, {
                                beforeModalClose: this.beforeModalClose,
                                closeModal: this.HandleCloseModal,
                                changeModalDialogTitle: (newTitle) => { this.setState({ titleRequestedByChild: newTitle }) }
                            })}
                        </div>
                </div>
            </div>
        )
    }
}

export default ModalDialog