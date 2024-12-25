import React, {memo, useCallback, useState} from 'react';
import {useDeleteAllCompaniesMutation, useGetCompaniesQuery} from "../../../redux/api/company/company.api.service";
import {Button, InputGroup} from "react-bootstrap";
import CompanyTable from '../../../Components/Table/BaseTable'
import CreateCompany from "./CreateCompany";
import CompanyPagination from "../../../Components/Pagination/BasePagination";
import CompanyUsers from "./CompanyUsers";
import EditCompany from "./EditCompany";
import {useGsapRemove} from "../../../hooks/useGsapRemove";

const headerRow = ['#', 'company', 'users of company', 'edit', 'delete']
export type SelectedUsersRowType = {
  id: string | number
  name: string
  email: string
}

function Company() {
  // console.log('Company')
  const [currPage, setCurrPage] = useState(1)
  const {addElement, removeElements} = useGsapRemove()
  const [selectedCompanyRow, setSelectedCompanyRow] = useState({
    id: null,
    name: '',
    description: ''
  })
  const [deleteAllCompanies] = useDeleteAllCompaniesMutation()
  const {data, isLoading} = useGetCompaniesQuery({limit: 5, page: currPage})
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const meta = data?.meta
  const companies = data?.data
  const [selectedRow, setSelectedRow] = useState<SelectedUsersRowType[] | null>(null)
  const [show, setShow] = useState({
    modalCase: 0,
    open: false
  })
  const handleCheck = (id: number) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((selId) => selId !== id) : [...prev, id])
  }
  const handleEdit = (company: any) => {
    const data = {
      id: company.id,
      name: company.name,
      description: company.description
    }
    setSelectedCompanyRow(data)
    setShow((prev) => ({
      ...prev,
      modalCase: 2,
      open: true
    }))
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
    setShow((prev) => ({
      ...prev,
      modalCase: 1,
      open: true
    }))
    setSelectedRow(users)
  }
  const handleClose = useCallback(() => {
    setShow((prev) => ({
      ...prev,
      modalCase: 0,
      open: false
    }))
    setSelectedRow(null)
    setSelectedCompanyRow((prev) => ({
      ...prev,
      id: null,
      name: '',
      description: ''
    }))
  }, [])
  const handlePageChange = useCallback((page: number) => {
    if (page > 0 && page <= meta?.totalPages) {
      setCurrPage(page)
    }
  }, [meta?.totalPages])
  const bodyRow = data && companies.map((el: any) =>
    <tbody key={el.id} ref={(e) => addElement(el.id, e)}>
    <tr>
      <td>{el.id}</td>
      <td>{el.name}</td>
      <td>
        <Button onClick={() => handleShowUsers(el.users)}>users</Button>
      </td>
      <td><Button variant="warning" onClick={() => handleEdit(el)}>edit</Button></td>
      <td>
        <InputGroup>
          <InputGroup.Checkbox
            onChange={() => handleCheck(el.id)}
            type="checkbox"
            id={`cmp_${el.id}`}
            checked={selectedIds.includes(el.id)}
          />
        </InputGroup>
      </td>
    </tr>
    </tbody>)
  return (
    <>
      {isLoading && <p>loading...</p>}
      <CompanyUsers<SelectedUsersRowType> data={selectedRow} show={show} onClose={handleClose} />
      <CreateCompany />
      {
        selectedIds.length !== 0 &&
        <Button className="btn btn-danger float-lg-end" onClick={handleDelete}>
          Delete
        </Button>
      }
      <EditCompany show={show} onClose={handleClose} company={selectedCompanyRow} />
      <CompanyTable
        title="Companies"
        variant="secondary"
        headerRow={headerRow}
        bodyRow={bodyRow}
      />
      {meta?.totalItems >= 5 && <CompanyPagination
        onPageChange={handlePageChange}
        totalPages={meta?.totalPages}
        currentPage={currPage}
      />}
    </>
  );
}

export default memo(Company);