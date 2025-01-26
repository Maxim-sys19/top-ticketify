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
import {isAdmin} from "../../../helpers/isAdmin";
import useOpenModal from "../../../hooks/useOpenModal";
import CompanyTable from "./CompanyTable";

interface Company {
  id: number
  name: string,
  users: any[]
}

export type SelectedUsersRowType = {
  id: string | number
  name: string
  email: string
}

function CompanyPage() {
  const [currPage, setCurrPage] = useState(1)
  const {addElement, removeElements} = useGsapRemove()
  const [selectedCompanyRow, setSelectedCompanyRow] = useState({
    id: null,
    name: '',
    description: ''
  })
  const {roles} = useAppSelector(state => state.profile.user)
  const isAdminUser = roles && isAdmin(roles)
  const [deleteAllCompanies] = useDeleteAllCompaniesMutation()
  const {data, isLoading} = useGetCompaniesQuery({limit: 5, page: currPage})
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const meta = data?.meta
  const companies = data?.data
  const [selectedRow, setSelectedRow] = useState<SelectedUsersRowType[] | null>(null)
  const {open, close, show} = useOpenModal()
  const handleCheckCompany = (id: number) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((selId) => selId !== id) : [...prev, id])
  }
  const handleEdit = (company: any) => {
    const data = {
      id: company.id,
      name: company.name,
      description: company.description
    }
    setSelectedCompanyRow(data)
    open('edit')
  }
  const handleDelete = async () => {
    let body = {
      ids: selectedIds
    }
    removeElements(selectedIds)
    await deleteAllCompanies(body).unwrap().then((res) => {
      if (res) {
        setSelectedIds([])
      }
    })
  }
  const handleShowUsers = (users: SelectedUsersRowType[]) => {
    open('read')
    setSelectedRow(users)
  }
  const handleClose = useCallback(() => {
    close()
    setSelectedRow(null)
    setSelectedCompanyRow((prev) => ({
      ...prev,
      id: null,
      name: '',
      description: ''
    }))
  }, [close])


  return (
    <>
      {isLoading && <p>loading...</p>}
      <CompanyUsers<SelectedUsersRowType> data={selectedRow} show={show === 'read'} onClose={handleClose} />
      <CreateCompany />
      {
        selectedIds.length !== 0 &&
        <Button className="btn btn-danger float-lg-end" onClick={handleDelete}>
          Delete
        </Button>
      }
      {selectedCompanyRow && <EditCompany show={show === 'edit'} onClose={close} company={selectedCompanyRow} />}
      <CompanyTable<Company>
        checked={selectedIds}
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