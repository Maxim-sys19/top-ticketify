import React, {memo, useCallback, useState} from 'react';
import CreateTransport from "./CreateTransport";
import TransportPagination from '../../../Components/Pagination/BasePagination'
import {
  useDeleteAllTransportsMutation,
  useGetTransportsQuery
} from "../../../redux/api/admin/transport/transport.api.service";
import {TransportTable} from "./TransportTable";
import {useAppSelector} from "../../../hooks/useApiHooks";
import EditTransport from "./EditTransport";
import useOpenModal from "../../../hooks/useOpenModal";
import {useGsapRemove} from '../../../hooks/useGsapRemove';
import useSelectedIds, {useSelectRow} from '../../../hooks/useSelectedIds';
import {useSafePagination} from '../../../hooks/useSafePagination';
import { useRoles } from '../../../hooks/useRoles';


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
  const {isAdmin} = useRoles()
  const [deleteAllTransports] = useDeleteAllTransportsMutation()
  const {addElement, removeElements} = useGsapRemove()
  const {selectRow, setSelectedRow, clearSelectedRow} = useSelectRow<Transport | null>(null)
  const {open, close, show} = useOpenModal()
  const isAdminUser = isAdmin()
  const [currPage, setCurrPage] = useState(1)
  const {data, isLoading} = useGetTransportsQuery({limit: 5, page: currPage})
  const {meta} = data !== undefined && data
  const {selectIds, clearSelection, toggleIdSelection} = useSelectedIds<number>([])
  const transports = data?.data
  const {notifyDeleted} = useSafePagination({
    data: transports,
    total: meta?.totalPages,
    currPage: currPage,
    setCurrPage,
    isLoading
  })
  const handleTransportCheck = (id: number) => {
    toggleIdSelection(id)
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
    setSelectedRow(data)
    open('edit')
  }
  const handleClose = useCallback(() => {
    close()
    clearSelectedRow()
  }, [])
  const handleDelete = async () => {
    const data = {ids: Array.from(selectIds)}
    await deleteAllTransports(data).unwrap().then((success) => {
      if (success) {
        clearSelection()
        notifyDeleted()
      }
    })
    removeElements(data.ids)
  }
  return (
    <>
      {isAdminUser && <CreateTransport />}
      {selectRow && <EditTransport<Transport> entity={selectRow} show={show === 'edit'} onClose={handleClose} />}
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