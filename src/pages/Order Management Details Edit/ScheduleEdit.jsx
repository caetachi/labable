import { useEffect, useState } from "react";
import Buttons from "../../components/Buttons - Edit Details/Buttons";
import Leaflet from "../../components/Leaflet/Leaflet";
import { updateScheduleDetails } from "../../scripts/update";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { getOrder } from "../../scripts/get";
import { formatMe } from "../../scripts/dateformat";

export default function ScheduleEdit({id, locationName, coordinates, onCoordinateChange, onLocationNameChange}){

    const [customerName, setCustomerName] = useState();
    const [address, setAddress] = useState();
    const [modeOfClaiming, setModeOfClaiming] = useState();
    const [modeOfTransfer, setModeOfTransfer] = useState();
    const [status, setStatus] = useState();
    const [laundryClaimDateTime, setLaundryClaimDateTime] = useState();
    const [laundryTransferDateTime, setLaundryTransferDateTime] = useState();
    const [createdAt, setCreatedAt] = useState();
    const [orderUid, setOrderUid] = useState();
    const [order, setOrder] = useState();
    const [hasPickupBool, setHasPickupBool] = useState(false);
    const [hasDeliveryBool, setHasDeliveryBool] = useState(false);

    const navigate = useNavigate();

    

    async function update() {
        await updateScheduleDetails(orderUid, customerName, address, status, modeOfTransfer, modeOfClaiming, laundryTransferDateTime, laundryClaimDateTime).then(()=>{
            toast.success("Schedule Updated Successfully!");
        }).catch((error)=>{
            toast.error("Error updating schedule: " + error.message);
        });
        navigate('/admin/schedule');
    }

    useEffect(()=>{
        async function getOrderList() {
            console.log("effect");
            const currOrder = await getOrder(String(id));
            setOrder(currOrder);
        }
        getOrderList();
    }, [])
    useEffect(()=>{
        if(order){
            setCustomerName(order[1].customer_name);
            setAddress(order[1].address);
            setModeOfClaiming(order[1].mode_of_claiming);
            setModeOfTransfer(order[1].mode_of_transfer);
            console.log('transfer '+ order[1].mode_of_transfer);
            setStatus(order[1].status);
            setLaundryClaimDateTime(order[1].schedule.delivery ? order[1].schedule.delivery.scheduled_date != "Not yet specified" ? order[1].schedule.delivery.scheduled_date : "" : "");
            setLaundryTransferDateTime(order[1].schedule.pickup ? order[1].schedule.pickup.scheduled_date != "Not yet specified" ? order[1].schedule.pickup.scheduled_date : "" : "");
            setOrderUid(order[0]);
            setHasPickupBool(order[1].schedule.pickup ? true : false);
            setHasDeliveryBool(order[1].schedule.delivery ? true : false);
            setCreatedAt(order[1].created_at);
        }
    }, [order])

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
                    <input className='small-container-input gray-border' type="text" defaultValue={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                    <i className='ti ti-search input-icon right-icon'></i>
                </div>
            </div>
            <div className="small-container">
                <p className='small-container-title'>Address</p>
                <div className="small-container-input-container">
                    <i className='ti ti-map-pin input-icon left-icon'></i>
                    <input className='small-container-input gray-border' type="text" defaultValue={address} onChange={(e) => setAddress(e.target.value)} />
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
                <p className='small-container-title'>Transfer Mode</p>
                <div className="small-container-input-container">
                    {modeOfTransfer &&
                    <>
                        <i className="hgi hgi-stroke hgi-shipping-truck-01 input-icon left-icon"></i>
                        <select className='small-container-input gray-border' type="text" defaultValue={modeOfTransfer} onChange={(e) => setModeOfTransfer(e.target.value)} >
                            <option value="Pick-up">Pickup (Pickup from the custumer address)</option>
                            <option value="Deliver">Delivery (Customer delivers the laundry to the location)</option>
                        </select>
                    </>
                    }
                </div>
            </div>
            <div className="small-container">
                <p className='small-container-title'>Claim Mode</p>
                <div className="small-container-input-container">
                    {modeOfClaiming &&
                    <>
                        <i className="hgi hgi-stroke hgi-shipping-truck-01 input-icon left-icon"></i>
                        <select className='small-container-input gray-border' type="text" defaultValue={modeOfClaiming} onChange={(e) => setModeOfClaiming(e.target.value)} >
                            <option value="Pick-up">Pickup (Customer receives the laundry at the location)</option>
                            <option value="Deliver">Deliver (Laundry is delivered to the customer's address)</option>
                        </select>
                    </>
                    }
                </div>
            </div>
            <div className="small-container">
                <p className='small-container-title'>Status</p>
                <div className="small-container-input-container">
                    <i className="ti ti-circle-check input-icon left-icon"></i>
                    {status && 
                    <select className='small-container-input gray-border' defaultValue={status} onChange={(e) => setStatus(e.target.value)} >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                    }
                </div>
            </div>
            <div className="small-container">
                <p className='small-container-title'>Schedule Date</p>
                <div className="small-container-input-container">
                    <i className="hgi hgi-stroke hgi-money-01 input-icon left-icon"></i>
                    <input className='small-container-input input-date gray-border' type="datetime-local" defaultValue={createdAt && formatMe(createdAt)} onChange={(e) => setLaundryClaimDateTime(e.target.value)} />
                    {/* <i className="ti ti-calendar-week input-icon right-icon"></i> */}
                </div>
            </div>
            {modeOfTransfer == 'Pick-up' ?
            <div className="small-container">
                <p className='small-container-title'>Pickup Date</p>
                <div className="small-container-input-container">
                    <i className="hgi hgi-stroke hgi-money-01 input-icon left-icon"></i>
                    <input className='small-container-input input-date gray-border' type="datetime-local" placeholder='10/24/25' defaultValue={hasPickupBool && laundryTransferDateTime && formatMe(laundryTransferDateTime)} onChange={(e) => setLaundryTransferDateTime(e.target.value)}/>
                </div>
            </div>
            : ""
            }
            {hasDeliveryBool || modeOfClaiming == 'Deliver' ?
            <div className="small-container">
                <p className='small-container-title'>Delivery Date</p>
                <div className="small-container-input-container">
                    <i className="hgi hgi-stroke hgi-money-01 input-icon left-icon"></i>
                    <input className='small-container-input input-date gray-border' type="datetime-local" placeholder='10/24/25' defaultValue={hasDeliveryBool && laundryClaimDateTime && formatMe(laundryClaimDateTime)} onChange={(e) => setLaundryClaimDateTime(e.target.value)}/>
                </div>
            </div>
            : ""
            }
            <Buttons onClick={update}/>
        </div>
    )
}