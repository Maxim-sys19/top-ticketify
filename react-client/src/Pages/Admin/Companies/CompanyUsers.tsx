import React, {JSX, memo} from 'react';
import BaseList, { IBaseList } from '../../../Components/Lists/BaseList';
import UsersCompanyModal from "../../../Components/Modal/BaseModal";

interface ICompanyUsersList<T> extends IBaseList<T>{
  show: boolean
  onClose: () => void
}

function CompanyUsersList<T extends Record<string, any>>({data, onClose, show}: ICompanyUsersList<T>) {
  return (
    <UsersCompanyModal title="users" show={show} onHide={onClose}>
      <BaseList<T>
        data={data}
        renderItem={(item: T) => <>{item.name}</>}
        keyExtractor={(item) => item.id}
      />
    </UsersCompanyModal>
  );
}

const MemoCompanyUsersList = memo(CompanyUsersList) as <T>(
  props: ICompanyUsersList<T>
) => JSX.Element

export default MemoCompanyUsersList