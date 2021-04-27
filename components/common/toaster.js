import { toast } from 'react-toastify';
import { ErrorToast, SucessToast } from './index';

export default function Toaster(message, isError) {
    if (isError) {
        toast.error(<ErrorToast message={message} />, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    } else {
        toast.info(<SucessToast message={message} />, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }
}