import React, {memo, useState} from 'react';
import CreateTransport from "./CreateTransport";
import TransportPagination from '../../../Components/Pagination/BasePagination'
import {useDeleteAllTransportsMutation, useGetTransportsQuery} from "../../../redux/api/admin/transport/transport.api.service";
import {TransportTable} from "./TransportTable";
import {useAppSelector} from "../../../hooks/useApiHooks";
import {isAdmin} from "../../../helpers/isAdmin";
import EditTransport from "./EditTransport";
import useOpenModal from "../../../hooks/useOpenModal";
import { useGsapRemove } from '../../../hooks/useGsapRemove';


export interface Transport {
  id: number
  name: string
  description?: string
  capacity: number
  isActive: boolean
  company: string
}

function TransportPage() {
  // console.log('Transport Page')
  const [deleteAllTransports] = useDeleteAllTransportsMutation()
  const {addElement, removeElements} = useGsapRemove()
  const {user} = useAppSelector(state => state.profile)
  const [selectedTransport, setSelectedTransport] = useState<Transport | null>(null)
  const {open, close, show} = useOpenModal()
  const isAdminUser = user && isAdmin(user.roles)
  const [currPage, setCurrPage] = useState(1)
  const {data} = useGetTransportsQuery({limit: 5, page: currPage})
  const {meta} = data !== undefined && data
  const [selectIds, setSelectIds] = useState<number[]>([])
  const transports = data?.data
  const handleTransportCheck = (id: number) => {
    setSelectIds((prev) => prev.includes(id) ? prev.filter((selId) => selId !== id) : [...prev, id])
  }
  const handleEdit = (transport: Transport) => {
    const data = {
      id: transport.id,
      name: transport.name,
      description: transport.description,
      capacity: transport.capacity,
      isActive: transport.isActive,
      company: transport.company
    }
    setSelectedTransport(data)
    open('edit')
  }
  const handleClose = () => {
    close()
    setSelectedTransport(null)
  }
  const handleDelete = async () => {
    const data = {ids: selectIds}
    await deleteAllTransports(data).unwrap().then((success) => {
      success && setSelectIds([])
    })
    removeElements(data.ids)
  }
  return (
    <>
      {isAdminUser && <CreateTransport />}
      {selectedTransport && <EditTransport transport={selectedTransport} show={show} onClose={handleClose} />}
      <TransportTable<Transport>
        role={isAdminUser}
        addElement={addElement}
        handleDelete={handleDelete}
        data={transports}
        title="Transports"
        variant="secondary"
        handleCheck={handleTransportCheck}
        checked={selectIds}
        handleEdit={handleEdit}
      />
      {
        meta?.totalItems >= 5 &&
        <TransportPagination
          currentPage={currPage}
          meta={meta}
          totalPages={meta.totalPages}
          setCurrPage={setCurrPage}
        />
      }
    </>
  );
}

export default memo(TransportPage);