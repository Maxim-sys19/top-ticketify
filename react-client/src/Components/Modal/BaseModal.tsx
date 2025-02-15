import React, {memo} from 'react';
import {Modal} from "react-bootstrap";
import {BaseModalProps} from "@restart/ui/Modal";
import ReactDOM from "react-dom";

interface IBaseModalProps<T> extends BaseModalProps {
  title: string,
  selectedRow?: T | null
  show: boolean
}

function BaseModal<T>({show, onHide, backdrop, children, title}: IBaseModalProps<T>) {
  console.log('BaseModal')
  return ReactDOM.createPortal(
    <Modal show={show} onHide={onHide} backdrop={backdrop}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {children}
      </Modal.Body>
    </Modal>,
    document.body
  )
}

const MemoBaseModal  = memo(BaseModal) as <T>(props: IBaseModalProps<T>) => JSX.Element;
export default MemoBaseModal;