import React, {memo, useCallback, useState} from 'react';
import {useGetCompaniesQuery} from "../../../redux/api/company/company.api.service";
import {Button, ListGroup} from "react-bootstrap";
import CompanyTable from '../../../Components/Table/BaseTable'
import CreateCompany from "./CreateCompany";
import UsersCompanyModal from '../../../Components/Modal/BaseModal'
import CompanyPagination from "../../../Components/Pagination/BasePagination";
import CompanyUsers from "./CompanyUsers";

const headerRow = ['#', 'company', 'users of company', 'edit', 'delete']
export type SelectedRowType = {
  id: string | number
  name: string
  email: string
}

function Company() {
  // console.log('Company')
  const [currPage, setCurrPage] = useState(1)
  const {data, isLoading} = useGetCompaniesQuery({limit: 5, page: currPage})
  const meta = data?.meta
  const companies = data?.data
  const [selectedRow, setSelectedRow] = useState<SelectedRowType[] | null>(null)
  const [show, setShow] = useState(false)
  const handleEdit = (id: string) => {
    console.log('Edit :', id)
  }
  const handleDelete = (id: string) => {
    console.log('Delete :', id)
  }
  const handleShowUsers = (users: SelectedRowType[]) => {
    setShow(true)
    setSelectedRow(users)
  }
  const handleClose = useCallback(() => {
    setShow(false)
    setSelectedRow(null)
  }, [])
  const handlePageChange = useCallback((page: number) => {
    if (page > 0 && page <= meta?.totalPages) {
      setCurrPage(page)
    }
  }, [meta?.totalPages])
  const bodyRow = data && companies.map((el: any) =>
    <tbody key={el.id}>
    <tr>
      <td>{el.id}</td>
      <td>{el.name}</td>
      <td>
        <Button onClick={() => handleShowUsers(el.users)}>users</Button>
      </td>
      <td><Button variant="warning" onClick={() => handleEdit(el.id)}>edit</Button></td>
      <td><Button variant="danger" onClick={() => handleDelete(el.id)}>delete</Button></td>
    </tr>
    </tbody>)
  return (
    <>
      {isLoading && <p>loading...</p>}
      <CompanyUsers<SelectedRowType> data={selectedRow} show={show} onClose={handleClose}/>
      <CreateCompany />
      <CompanyTable
        title="Companies"
        variant="secondary"
        headerRow={headerRow}
        bodyRow={bodyRow}
      />
      <CompanyPagination
        onPageChange={handlePageChange}
        totalPages={meta?.totalPages}
        currentPage={currPage}
      />
    </>
  );
}

export default memo(Company);