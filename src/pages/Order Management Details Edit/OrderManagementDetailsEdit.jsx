import './order-management-details-edit.css'
import labableLogo from '../../assets/labable-black.svg'

import { useEffect, useState } from 'react'
import "leaflet/dist/leaflet.css";
import { useParams } from 'react-router'
import { getInventoryItem, getOrder, getServiceType, getUser, getWashableItem } from '../../scripts/get'
import WashableEdit from './WashableEdit'
import ServiceEdit from './ServiceEdit'
import InventoryEdit from './InventoryEdit'
import ScheduleEdit from './ScheduleEdit'
import OrderEdit from './OrderEdit'
import CustomerEdit from './CustomerEdit';  

export default function OrderManagementDetailsEdit(){
    const {toEdit, id} = useParams();
    const [inventoryItem, setInventoryItem] = useState();
    const [serviceType, setServiceType] = useState();
    const [washableItem, setWashableItem] = useState();
    const [customer, setCustomer] = useState();
    const [coordinates, setCoordinates] = useState([]);
    const [locationName, setLocationName] = useState("Malolos");

    useEffect(()=>{
        if(toEdit == 'order' || toEdit == 'schedule'){
            async function getOrderList(id) {
                if(id){
                    await getOrder(String(id));
                }
            }
            getOrderList(id)
        }
        if(toEdit == 'inventory'){
            async function gettingInventoryItem(id) {
                if(id){
                    setInventoryItem(await getInventoryItem(String(id)));
                }
            }
            gettingInventoryItem(id)
        }
        if(toEdit == 'service'){
            async function gettingServiceType(id) {
                if(id){
                    setServiceType(await getServiceType(String(id)));
                }
            }
            gettingServiceType(id)
        }
        if(toEdit == 'washable'){
            async function gettingWashableItem(id) {
                if(id){
                    setWashableItem(await getWashableItem(String(id)));
                }
            }
            gettingWashableItem(id)
        }
        if(toEdit == 'customer'){
            async function getingCustomer(id) {
                if(id){
                    setCustomer(await getUser(String(id)));
                }
            }
            getingCustomer(id)
        }

    }, [toEdit])

    function onCoordinateChange(newCoordinates){
        setCoordinates(newCoordinates);
    }

    function onLocationNameChange(newLocationName){
        setLocationName(newLocationName);
    }
    return (
        <>
            <div className="details-edit-container">
                <div className="logo">
                    <img src={labableLogo} alt="Labable" className='logo'/>
                    <h1><span>Laba</span><span className='highlight-tag'>ble</span></h1>
                </div>
                {
                    toEdit == 'order'  &&
                    <OrderEdit id={id} />
                }
                {
                    toEdit == 'schedule'  &&
                    <ScheduleEdit id={id} locationName={locationName} coordinates={coordinates} onCoordinateChange={onCoordinateChange} onLocationNameChange={onLocationNameChange} />
                }
                {
                    toEdit == 'inventory'  && inventoryItem &&
                    <InventoryEdit inventoryItem={inventoryItem}/>
                }
                {
                    toEdit == 'service'  && serviceType &&
                    <ServiceEdit serviceType={serviceType}/>
                }
                {
                    toEdit == 'washable'  && washableItem &&
                    <WashableEdit washableItem={washableItem}/>
                }
                {
                    toEdit == 'customer' && customer &&
                    <CustomerEdit customer={customer}/>
                }
            </div>
        </>

    )
}