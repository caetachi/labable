import './order-management-details-edit.css'
import labableLogo from '../../assets/labable-black.svg'

import { useEffect, useState } from 'react'
import "leaflet/dist/leaflet.css";
import Leaflet from '../../components/Leaflet/Leaflet'
import Buttons from '../../components/Buttons - Edit Details/Buttons'
import { useParams } from 'react-router'
import { getInventoryItem, getOrder, getServiceType, getWashableItem, getWashableItems } from '../../scripts/get'
import WashableItem from '../../components/Washable Item - Create Order/WashableItem'
import OrderItem from '../../components/Order Item - Create Order/OrderItem'
import WashableEdit from './WashableEdit'
import ServiceEdit from './ServiceEdit'
import InventoryEdit from './InventoryEdit'
import ScheduleEdit from './ScheduleEdit'
import OrderEdit from './OrderEdit'

export default function OrderManagementDetailsEdit(){
    const {toEdit, id} = useParams();
    const [editDetail, setEditDetail] = useState(toEdit);
    const [order, setOrder] = useState();
    const [inventoryItem, setInventoryItem] = useState();
    const [serviceType, setServiceType] = useState();
    const [washableItem, setWashableItem] = useState();
    const [coordinates, setCoordinates] = useState([]);
    const [locationName, setLocationName] = useState("Malolos");

    
    

    useEffect(()=>{
        if(editDetail == 'order' || editDetail == 'schedule'){
            async function getOrderList(id) {
                if(id){
                    const currOrder = await getOrder(String(id));
                }
            }
            getOrderList(id)
        }
        if(editDetail == 'inventory'){
            async function gettingInventoryItem(id) {
                if(id){
                    setInventoryItem(await getInventoryItem(String(id)));
                }
            }
            gettingInventoryItem(id)
        }
        if(editDetail == 'service'){
            async function gettingServiceType(id) {
                if(id){
                    const serviceMo = await getServiceType(String(idprice));
                    console.log("Service "+serviceMo);
                    setServiceType(serviceMo);
                }
            }
            gettingServiceType(id)
        }
        if(editDetail == 'washable'){
            async function gettingWashableItem(id) {
                if(id){
                    setWashableItem(await getWashableItem(String(id)));
                }
            }
            gettingWashableItem(id)
        }
    }, [editDetail])

    function onCoordinateChange(newCoordinates){
        setCoordinates(newCoordinates);
    }

    function onLocationNameChange(newLocationName){
        setLocationName(newLocationName);
    }
    return (
        <div className="details-edit-container">
            <div className="logo">
                <img src={labableLogo} alt="Labable" className='logo'/>
                <h1><span>Laba</span><span className='highlight-tag'>ble</span></h1>
            </div>
            {
                editDetail == 'order'  &&
                <OrderEdit id={id} />
            }
            {
                editDetail == 'schedule'  && order &&
                <ScheduleEdit order={order} locationName={locationName} coordinates={coordinates} onCoordinateChange={onCoordinateChange} onLocationNameChange={onLocationNameChange} />
            }
            {
                editDetail == 'inventory'  && inventoryItem &&
                <InventoryEdit inventoryItem={inventoryItem}/>
            }
            {
                editDetail == 'service'  && serviceType &&
                <ServiceEdit serviceType={serviceType}/>
            }
            {
                editDetail == 'washable'  && washableItem &&
                <WashableEdit washableItem={washableItem}/>
            }
        </div>
    )
}