import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

class ConfirmModal extends Component {
  onConfirm = () => {
    if (typeof this.props.onConfirm === 'function') {
      this.props.onConfirm();
    }
  }

  onCancel = () => {
    if (typeof this.props.onCancel === 'function') {
      this.props.onCancel();
    }
  }

  render() {
    const { type, className, confirmText, title, text, isOpen } = this.props;
    return (
      <Modal isOpen={isOpen} className={'modal-' + type + ' ' + className}>
        <ModalHeader toggle={this.props.toggleModal}>{ title }</ModalHeader>
        <ModalBody>
          { text }
        </ModalBody>
        <ModalFooter>
          <Button color={type} onClick={this.onConfirm}>{confirmText || 'Confirm'}</Button>{' '}
          <Button color="secondary" onClick={this.onCancel}>Cancel</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

export default ConfirmModal;
