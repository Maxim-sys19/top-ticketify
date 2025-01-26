import React, {JSX, memo} from 'react';
import {ListGroup} from "react-bootstrap";
import UsersCompanyModal from "../../../Components/Modal/BaseModal";

interface ICompanyUsers<T> {
  data: T[] | null
  show: boolean
  onClose: () => void
}

function BaseList<T extends Record<string, any>>({data, onClose, show}: ICompanyUsers<T>) {
  return (
    <UsersCompanyModal title="users" show={show} onHide={onClose}>
      {
        data?.length !== 0 ?
          <ListGroup>
            {data?.map((row) => <ListGroup.Item key={row.id}>{row.name}</ListGroup.Item>)}
          </ListGroup> :
          <p>no users...</p>
      }
    </UsersCompanyModal>
  );
}

const MemoBaseList = memo(BaseList) as <T>(
  props: ICompanyUsers<T>
) => JSX.Element

export default MemoBaseList