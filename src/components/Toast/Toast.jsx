import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './toast.css';

function Toast() {
  return (
    <>
      <ToastContainer
        position="bottom-left"
        autoClose={3000} // closes in 3 seconds
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        draggable
        className="toast-container"
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
        theme="colored" // other options: "light", "dark"
      />
    </>
  );
}

export default Toast;
