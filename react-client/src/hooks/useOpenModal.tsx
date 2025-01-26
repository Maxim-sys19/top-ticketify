import {useCallback, useState} from 'react';

export type ModalType = 'create' | 'read' | 'edit' | 'delete' | null

function useOpenModal() {
  const [show, setShow] = useState<ModalType>(null)
  const open = useCallback((type: ModalType) => setShow(type), [])
  const close = useCallback(() => setShow(null), [])
  const toggle = useCallback((type: ModalType) => setShow((prev) => (prev === type ? null : type)), [])
  return {open, close, show, toggle}
}

export default useOpenModal;