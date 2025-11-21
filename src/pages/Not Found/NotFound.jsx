import './not-found.css'
import notFound from '../../assets/not-found.png'

function NotFound() {
    return(
        <div className="not-found-container">
            <h1>404</h1>
            <h2>Oopps Sorry! Page Not Found</h2>
            <p>Maybe you're not looking in the right place or this page is not meant for you.</p>
            <img src={notFound} alt="Not Found" />
        </div>
    )
}
export default NotFound;