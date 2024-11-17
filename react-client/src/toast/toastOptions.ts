import {ToastOptions, TypeOptions} from "react-toastify/dist/types";

export const toastOptions = (type: TypeOptions): ToastOptions => {
  return {
    type: type,
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  }
}