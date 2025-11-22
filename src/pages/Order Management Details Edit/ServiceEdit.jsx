import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Buttons from "../../components/Buttons - Edit Details/Buttons";
import { updateServiceType } from "../../scripts/update";
import { toast } from "react-toastify";
import { getServicesIncluded } from "../../scripts/get";

export default function ServiceEdit({serviceType}){
    const [serviceName, setServiceName] = useState(serviceType[1].service_name);
    const [services, setServices] = useState(serviceType[1].services.join(', '));
    const [price, setPrice] = useState(serviceType[1].service_price);
    const navigate = useNavigate();

    async function update(){
        await updateServiceType(serviceType[0], serviceName, services.split(', '), price).then(()=>{
            toast.success("Service Type Updated Successfully!");
        }).catch((error)=>{
            toast.error("Error updating Service Type: " + error.message);
        });
        navigate('/admin/service');
    }

    function onName(e) {
        const temp = e.target.value;
        const error = document.getElementById('nameError');
        setServiceName(null)
        if (!temp.trim()) {
            error.innerHTML = 'Service name is required';
        } else {
            error.innerHTML = '';
            setServiceName(temp);
        }
    }

    function onServices(e) {
        const temp = e.target.value;
        const error = document.getElementById('servicesError');
        setServices(null)
        if (!temp.trim()) {
            error.innerHTML = 'Services included is required';
        }else if(!temp.match(/^[A-Za-z]+(?:\s*,\s*[A-Za-z]+)*$/)){
            error.innerHTML = 'Please enter valid services';
        } else {
            error.innerHTML = '';
            setServices(temp);
        }
    }   

    useEffect(()=>{
        async function getServiceList() {
            await getServicesIncluded(serviceType[0]);
        }
        getServiceList();
    },)

    return(
        [serviceType && 
            <div className="details-edit gray-border">
            <div className="small-container">
                <p className='small-container-title'>Service Name</p>
                <div className="small-container-input-container">
                    <i className="hgi hgi-stroke hgi-menu-square input-icon left-icon"></i>
                    <input className='small-container-input gray-border' type="text" defaultValue={serviceName} onChange={(e) => onName(e)}/>
                </div>
                <p className="error-message" id="nameError"></p>
            </div>
            <div className="small-container">
                <p className='small-container-title'>Services included</p>
                <div className="small-container-input-container">
                    <i className="hgi hgi-stroke hgi-shopping-cart-check-out-02 input-icon left-icon"></i>
                    <input className='small-container-input gray-border' type="text" defaultValue={services} onChange={(e) => onServices(e)}/>
                </div>
                <p className="error-message" id="servicesError"></p>
            </div>
            <div className="small-container">
                <p className='small-container-title'>Price</p>
                <div className="small-container-input-container">
                    <i className="hgi hgi-stroke hgi-money-02 input-icon left-icon"></i>
                    <input className='small-container-input gray-border' type="text" defaultValue={price} onChange={(e) => setPrice(e.target.value)}/>
                    <i className="hgi hgi-stroke hgi-arrow-down-01 input-icon right-icon"></i>
                </div>
                <p className="error-message" id="priceError"></p>
            </div>
            { serviceName && services && price ?
                <Buttons onClick={update} disabled={false}/>
                :
                <Buttons onClick={update} disabled={true}/>
            }
        </div>
        ]
    )
}