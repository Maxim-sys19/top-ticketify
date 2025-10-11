import React, {useCallback, useState} from 'react';
import CreateRoute from "./CreateRoute";
import RoutesTable from "./RoutesTable";
import {useDeleteRoutesMutation, useGetRoutesQuery} from "../../../redux/api/admin/routes/routes.api.service";
import RoutesPagination from '../../../Components/Pagination/BasePagination'
import useSelectedIds, {useSelectRow} from '../../../hooks/useSelectedIds';
import {Button} from 'react-bootstrap';
import {useGsapRemove} from '../../../hooks/useGsapRemove';
import EditRoute from './EditRoute';
import useOpenModal from '../../../hooks/useOpenModal';
import {useSafePagination} from '../../../hooks/useSafePagination';
import {useRoles} from '../../../hooks/useRoles';
import {CreateRouteInputTypes} from "../../../interfaces/routes/route-handles-interface";

export interface Route {
  id: number;
  routeName: string,
  start_address: string;
  end_address: string;
  distance_meters: {text: string, value: number},
  duration_seconds: {text: string, value: number},
  departureTime: string;
  arrivalTime: string;
  routeCode: string;
}

const RoutesPage = () => {
  const {isAdmin} = useRoles()
  const [currPage, setCurrPage] = useState(1)
  const {data, isLoading} = useGetRoutesQuery({limit: 5, page: currPage})
  const {addElement, removeElements} = useGsapRemove()
  const {open, close, show} = useOpenModal()
  const [deleteRoutes] = useDeleteRoutesMutation()
  const {selectIds, clearSelection, toggleIdSelection} = useSelectedIds<number>([])
  const {selectRow, clearSelectedRow, setSelectedRow} = useSelectRow<Route | null>(null)
  const isAdminUser = isAdmin()
  const meta = data?.meta
  const routes: Route[] = data?.data
  const {notifyDeleted} = useSafePagination<Route>({
    data: routes,
    total: meta?.totalPages,
    currPage,
    setCurrPage,
    isLoading
  })
  const handleCheckRoutes = (id: number) => {
    toggleIdSelection(id)
  }
  const handleEditRoutes = (row: Route) => {
    setSelectedRow(row)
    open('edit')
  }
  const handleCloseRow = useCallback(() => {
    clearSelectedRow()
    close()
  }, [clearSelectedRow, close])
  const handleDeleteRoutes = async () => {
    const body = {
      ids: Array.from(selectIds)
    }
    await deleteRoutes(body)
      .unwrap()
      .then((result) => {
        console.log('unwrap result', result)
        if (result.success === true) {
          clearSelection()
          notifyDeleted()
        }
      }).catch((err) => {
        console.log('unwrap err', err)
      })
    removeElements(body.ids)
  }
  return (
    <>
      {isAdminUser && <CreateRoute />}
      {
        isLoading
          ? <p>loading...</p>
          : <>
            {selectIds.size !== 0 &&
              <Button className="btn btn-danger float-lg-end" onClick={handleDeleteRoutes}>Delete</Button>}
            {selectRow &&
              <EditRoute<Route> show={show === 'edit'} onClose={handleCloseRow}
                                entity={selectRow!} />
            }
            <RoutesTable<Route>
              title="Routes"
              addElement={addElement}
              variant="secondary"
              data={routes}
              role={isAdminUser}
              checked={selectIds}
              handleCheck={handleCheckRoutes}
              handleEdit={handleEditRoutes}
            />
            {
              meta?.totalItems >= 5 &&
              <RoutesPagination
                setCurrPage={setCurrPage}
                currentPage={currPage}
                meta={meta}
                totalPages={meta?.totalPages} />
            }
          </>
      }
    </>
  )
}

export default RoutesPage;