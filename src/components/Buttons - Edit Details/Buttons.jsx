import { useNavigate } from 'react-router';
import './buttons.css'
export default function Buttons(prop) {
    const navigate = useNavigate();
    return(
        <div className="action-buttons-containers">
            <button className="back-action-button" onClick={()=>navigate(-1)}>Back</button>
            <button className="update-action-button" onClick={prop.onClick}>Update</button>
        </div>
    )
}