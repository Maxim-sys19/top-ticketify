import React, {JSX, memo} from 'react';
import {ListGroup} from "react-bootstrap";
import UsersCompanyModal from "../../../Components/Modal/BaseModal";

interface ICompanyUsers<T> {
  data: T[] | null
  show: {modalCase: number, open: boolean}
  onClose: () => void
}

function BaseList<T extends Record<string, any>>({data, onClose, show}: ICompanyUsers<T>) {
  return (
    <UsersCompanyModal title="users" show={show.modalCase === 1 && show.open} onHide={onClose}>
      <ListGroup>
        {data?.map((row) => <ListGroup.Item key={row.id}>{row.name}</ListGroup.Item>)}
      </ListGroup>
    </UsersCompanyModal>
  );
}

const MemoBaseList = memo(BaseList) as <T>(
  props: ICompanyUsers<T>
) => JSX.Element

export default MemoBaseList