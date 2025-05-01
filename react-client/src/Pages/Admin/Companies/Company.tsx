import React, {memo, useCallback, useState} from 'react';
import {
  useDeleteAllCompaniesMutation,
  useGetCompaniesQuery
} from "../../../redux/api/admin/company/company.api.service";
import {Button} from "react-bootstrap";
import CreateCompany from "./CreateCompany";
import CompanyPagination from "../../../Components/Pagination/BasePagination";
import CompanyUsers from "./CompanyUsers";
import EditCompany from "./EditCompany";
import {useGsapRemove} from "../../../hooks/useGsapRemove";
import {useAppSelector} from "../../../hooks/useApiHooks";
import useOpenModal from "../../../hooks/useOpenModal";
import CompanyTable from "./CompanyTable";
import useSelectedIds, {useSelectRow} from '../../../hooks/useSelectedIds';
import { useSafePagination } from '../../../hooks/useSafePagination';
import { useRoles } from '../../../hooks/useRoles';

export interface Company {
  id: number;
  name: string;
  description: string;
  users: SelectedUsersRowType[];
}

export type SelectedUsersRowType = {
  id: string | number
  name: string
  email: string
}

function CompanyPage() {
  const {isAdmin} = useRoles()
  const [currPage, setCurrPage] = useState(1)
  const {addElement, removeElements} = useGsapRemove()
  const {selectRow, setSelectedRow, clearSelectedRow} = useSelectRow<Pick<Company, "name" | "description">>({
    name: '',
    description: '',
  })
  const {
    selectRow: selectUsersRow,
    setSelectedRow: selectCompanyUsersRow,
    clearSelectedRow: clearCompanyUsersRow
  } = useSelectRow<SelectedUsersRowType[]>([])
  const isAdminUser = isAdmin()
  const [deleteAllCompanies] = useDeleteAllCompaniesMutation()
  const {data, isLoading} = useGetCompaniesQuery({limit: 5, page: currPage})
  const {selectIds, toggleIdSelection, clearSelection} = useSelectedIds<number>([])
  const meta = data?.meta
  const companies = data?.data
  const {open, close, show} = useOpenModal()
  const {notifyDeleted} = useSafePagination({data: companies, total: meta?.totalPages, currPage, setCurrPage, isLoading})
  const handleCheckCompany = (id: number) => {
    toggleIdSelection(id)
  }
  const handleEdit = (company: any) => {
    const data = {
      id: company.id,
      name: company.name,
      description: company.description
    }
    setSelectedRow(data)
    open('edit')
  }
  const handleDelete = async () => {
    let body = {
      ids: Array.from(selectIds)
    }
    removeElements(selectIds)
    await deleteAllCompanies(body).unwrap().then((res) => {
      if (res) {
        clearSelection()
        notifyDeleted()
      }
    }).catch((err) => {
      console.log('error', err)
    })
  }
  const handleShowUsers = (users: SelectedUsersRowType[]) => {
    open('read')
    selectCompanyUsersRow(users)
  }
  const handleClose = useCallback(() => {
    close()
    clearSelectedRow()
    clearCompanyUsersRow()
  }, [close])


  return (
    <>
      {isLoading && <p>loading...</p>}
      <CompanyUsers<SelectedUsersRowType> data={selectUsersRow} show={show === 'read'} onClose={handleClose} />
      {isAdminUser && <CreateCompany />}
      {
        selectIds.size !== 0 &&
        <Button className="btn btn-danger float-lg-end" onClick={handleDelete}>
          Delete
        </Button>
      }
      {selectRow && <EditCompany<Omit<Company, 'id' | 'users'>> show={show === 'edit'} onClose={handleClose} entity={selectRow} />}
      <CompanyTable<Company>
        checked={selectIds}
        handleCheck={handleCheckCompany}
        handleEdit={handleEdit}
        title="Companies"
        role={isAdminUser}
        addElement={addElement}
        handleShowUsers={handleShowUsers}
        variant="secondary"
        data={companies}
      />
      {meta?.totalItems >= 5 &&
        <CompanyPagination
          meta={meta}
          setCurrPage={setCurrPage}
          totalPages={meta?.totalPages}
          currentPage={currPage}
        />}
    </>
  );
}

export default memo(CompanyPage);