import { useState } from "react";
import Buttons from "../../components/Buttons - Edit Details/Buttons";
import Leaflet from "../../components/Leaflet/Leaflet";
import { updateScheduleDetails } from "../../scripts/update";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

export default function ScheduleEdit({order, locationName, coordinates, onCoordinateChange, onLocationNameChange}){

    const [customerName, setCustomerName] = useState(order[1].customer_name);
    const [address, setAddress] = useState(order[1].address);
    const [modeOfClaiming, setModeOfClaiming] = useState(order[1].mode_of_claiming);
    const [status, setStatus] = useState(order[1].status);
    const [laundryClaimDateTime, setLaundryClaimDateTime] = useState(order[1].schedule ? order[1].schedule.delivery.scheduled_date : "");
    const [orderUid, setOrderUid] = useState(order[0]);
    const navigate = useNavigate();

    async function update() {
        await updateScheduleDetails(orderUid, customerName, address, status, modeOfClaiming, laundryClaimDateTime).then(()=>{
            toast.success("Schedule Updated Successfully!");
        }).catch((error)=>{
            toast.error("Error updating schedule: " + error.message);
        });
        navigate('/admin/schedule');
    }

    return(
        <div className="details-edit gray-border">
            <div className="details-title-container">
                <p className='details-title'>Schedule Details</p>
                <p className='subtext'>Update Schedule Details</p>
            </div>
            <div className="small-container">
                <p className='small-container-title'>Customer</p>
                <div className="small-container-input-container">
                    <i className='ti ti-user input-icon left-icon'></i>
                    <input className='small-container-input gray-border' type="text" defaultValue={order[1].customer_name} onChange={(e) => setCustomerName(e.target.value)} />
                    <i className='ti ti-search input-icon right-icon'></i>
                </div>
            </div>
            <div className="small-container">
                <p className='small-container-title'>Address</p>
                <div className="small-container-input-container">
                    <i className='ti ti-map-pin input-icon left-icon'></i>
                    <input className='small-container-input gray-border' type="text" defaultValue={order[1].address ? order[1].address : "N/A"} onChange={(e) => setAddress(e.target.value)} />
                    <i className='ti ti-map-2 input-icon right-icon'></i>
                </div>
            </div>
            <p className='subtext'>You can specified your address in the map by dragging the red icon</p>
            <p>{locationName}</p>
            <p>{coordinates}</p>
            <Leaflet 
                coordinates={coordinates} 
                location_name={locationName} 
                onCoordinateChange={onCoordinateChange} 
                onLocationNameChange={onLocationNameChange} />
                
            <div className="small-container">
                <p className='small-container-title'>Type</p>
                <div className="small-container-input-container">
                    <i className="hgi hgi-stroke hgi-shipping-truck-01 input-icon left-icon"></i>
                    <input className='small-container-input gray-border' type="text" defaultValue={order[1].mode_of_claiming} onChange={(e) => setModeOfClaiming(e.target.value)} />
                    <i className="hgi hgi-stroke hgi-arrow-down-01 input-icon right-icon"></i>
                </div>
            </div>
            <div className="small-container">
                <p className='small-container-title'>Status</p>
                <div className="small-container-input-container">
                    <i className="ti ti-circle-check input-icon left-icon"></i>
                    <input className='small-container-input gray-border' type="text" defaultValue={order[1].status} onChange={(e) => setStatus(e.target.value)} />
                    <i className="hgi hgi-stroke hgi-arrow-down-01 input-icon right-icon"></i>
                </div>
            </div>
            <div className="small-container">
                <p className='small-container-title'>Schedule Date</p>
                <div className="small-container-input-container">
                    <i className="hgi hgi-stroke hgi-money-01 input-icon left-icon"></i>
                    <input className='small-container-input gray-border' type="datetime-local" value={laundryClaimDateTime} onChange={(e) => setLaundryClaimDateTime(e.target.value)} />
                    {/* <i className="ti ti-calendar-week input-icon right-icon"></i> */}
                </div>
            </div>
            {/* <div className="small-container">
                <p className='small-container-title'>Delivery/Pickup Date</p>
                <div className="small-container-input-container">
                    <i className="hgi hgi-stroke hgi-money-01 input-icon left-icon"></i>
                    <input className='small-container-input gray-border' type="text" placeholder='10/24/25'/>
                    <i className="ti ti-calendar-week input-icon right-icon"></i>
                </div>
            </div> */}
            {/* <div className="small-container">
                <p className='small-container-title'>Time to Pickup/Delivery</p>
                <div className="small-container-input-container">
                    <i className="hgi hgi-stroke hgi-money-01 input-icon left-icon"></i>
                    <input className='small-container-input gray-border' type="text" placeholder='7:00 AM'/>
                    <i className="ti ti-clock input-icon right-icon"></i>
                </div>
            </div> */}
            <Buttons onClick={update}/>
        </div>
    )
}