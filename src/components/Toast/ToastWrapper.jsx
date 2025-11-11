import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './toast.css';

function ToastWrapper() {
  return (
    <>
      <ToastContainer
        position="bottom-left"
        autoClose={2500} // closes in 2.5 seconds
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick = {true}
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

export default ToastWrapper;
