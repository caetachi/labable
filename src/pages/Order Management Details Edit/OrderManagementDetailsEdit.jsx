import './order-management-details-edit.css'
import labableLogo from '../../assets/labable-black.svg'
import SearchLogo from '../../assets/search.svg'
import PantsLogo from '../../assets/pants.svg'
import BigPantsLogo from '../../assets/pants-big.svg'
import ShirtLogo from '../../assets/shirt.svg'
import SkirtLogo from '../../assets/skirt.svg'
import DressLogo from '../../assets/dress.svg'
import { useEffect, useState } from 'react'
import "leaflet/dist/leaflet.css";
import Leaflet from '../../components/Leaflet/Leaflet'
import Buttons from '../../components/Buttons - Edit Details/Buttons'
import { useParams } from 'react-router'
import { getInventoryItem, getOrder, getServiceType, getWashableItem, getWashableItems } from '../../scripts/get'
import WashableItem from '../../components/Washable Item - Create Order/WashableItem'
import OrderItem from '../../components/Order Item - Create Order/OrderItem'

export default function OrderManagementDetailsEdit(){
    const {toEdit, id} = useParams();
    const [editDetail, setEditDetail] = useState(toEdit);
    const [order, setOrder] = useState();
    const [inventoryItem, setInventoryItem] = useState();
    const [serviceType, setServiceType] = useState();
    const [washableItem, setWashableItem] = useState();
    // order, schedule, inventory
    const [coordinates, setCoordinates] = useState([]);
    const [locationName, setLocationName] = useState("Malolos");
    const [orderItems, setOrderItems] = useState([]);
    const [washableItems, setWashableItems] = useState([]);

    useEffect(()=>{
        async function getStuff() {
            const washablesList = await getWashableItems();
            
            let washables = [];
            
            for(let i = 0; i < washablesList.length; i++){
                if(washablesList[i][0] != 'washables_counter'){
                    washables.push(washablesList[i]);
                }
            }
            setWashableItems(washables);
        }
        getStuff();
    }, [])
    

    useEffect(()=>{
        if(editDetail == 'order' || editDetail == 'schedule'){
            async function getOrderList(id) {
                if(id){
                    const currOrder = await getOrder(String(id));
                    setOrder(currOrder);
                    setOrderItems(currOrder[1].order_items);
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
                    setServiceType(await getServiceType(String(id)));
                }
            }
            gettingServiceType(id)
        }
        if(editDetail == 'washable-item'){
            async function gettingWashableItem(id) {
                if(id){
                    setWashableItem(await getWashableItem(String(id)));
                }
            }
            gettingWashableItem(id)
        }
    }, [editDetail])
    useEffect(()=>{
        console.log(orderItems);
        
    }, [orderItems])

    function addToOrderItems(washableItemUid, washableItemName, itemPerKg){
        setOrderItems(prevOrderItems => {
            const existingItemIndex = prevOrderItems.findIndex( // check kung existing na
                item => item.washable_item_id === washableItemUid
            );
            if (existingItemIndex > -1) { // -1 pag wala
                return prevOrderItems.map((item, index) => {
                    if (index === existingItemIndex) {
                        return { ...item, quantity: item.quantity + 1, total_kilo: Number((item.quantity + 1) / itemPerKg)}; // update quantity and total kilo
                    }
                    return item;
                });
            }else { // add
                return [
                    ...prevOrderItems,
                    {
                        washable_item_id: washableItemUid,
                        washable_item_name: washableItemName,
                        quantity: 1,
                        total_kilo:Number( 1 / itemPerKg),
                        item_per_kilo: Number(itemPerKg)
                    }
                ];
            }
        });
    }

    function decrementQuantity(decrementIndex) {
        setOrderItems(prevOrderItems =>{
            const item = prevOrderItems[decrementIndex];
            if(item.quantity > 1){
                return prevOrderItems.map((current, index) => {
                    if (index === decrementIndex) {
                        if(item.quantity > 1){
                            return { ...current, quantity: current.quantity - 1 }; // update quantity
                        }
                        return prevOrderItems;
                    }
                    return current;
                });
            }else{
                return prevOrderItems.filter((current, index) => index != decrementIndex);
            }
        })
    }
    
    function remove(removeIndex) {
        setOrderItems(prevOrderItems =>{
            return prevOrderItems.filter((current, index) => index != removeIndex);
        })
    }

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
                editDetail == 'order'  && order &&
                <div className="details-edit gray-border">
                    <div className="details-title-container">
                        <p className='details-title'>Order Details</p>
                        <p className='subtext'>Update Order Details</p>
                    </div>
                    <div className="small-container">
                        <p className='small-container-title'>Customer</p>
                        <div className="small-container-input-container">
                            <i className='ti ti-user input-icon left-icon'></i>
                            <input className='small-container-input gray-border' type="text" defaultValue={order[1].customer_name}/>
                            <i className='ti ti-search input-icon right-icon'></i>
                        </div>
                    </div>
                    <div className="small-container">
                        <p className='small-container-title'>Address</p>
                        <div className="small-container-input-container">
                            <i className='ti ti-map-pin input-icon left-icon'></i>
                            <input className='small-container-input gray-border' type="text" defaultValue={order[1].address}/>
                            <i className='ti ti-map-2 input-icon right-icon'></i>
                        </div>
                    </div>
                    <div className="small-container">
                        <p className='small-container-title'>Service Type</p>
                        <div className="small-container-input-container">
                            <i className="ti ti-wash-machine input-icon left-icon"></i>
                            <input className='small-container-input gray-border' type="text" defaultValue={order[1].service_name}/>
                            <i className="hgi hgi-stroke hgi-arrow-down-01 input-icon right-icon"></i>
                        </div>
                    </div>
                    <div className="small-container">
                        <p className='small-container-title'>Payment Method</p>
                        <div className="small-container-input-container">
                            
                            <i className="hgi hgi-stroke hgi-money-01 input-icon left-icon"></i>
                            <input className='small-container-input gray-border' type="text" defaultValue={order[1].payment_method}/>
                            <i className="hgi hgi-stroke hgi-arrow-down-01 input-icon right-icon"></i>
                        </div>
                    </div>
                    <div className="small-container">
                        <p className='small-container-title'>Amount</p>
                        <div className="small-container-input-container">
                            <i className="hgi hgi-stroke hgi-money-01 input-icon left-icon"></i>
                            <input className='small-container-input gray-border' type="text" defaultValue={order[1].amount}/>
                            <i className="hgi hgi-stroke hgi-arrow-down-01 input-icon right-icon"></i>
                        </div>
                    </div>
                    <div className="order-items-container">
                        <div className="washable-items-container gray-border">
                            <p className='section-title washable-items-title'>Select Washable Item</p>
                            <div className="select-items">
                                <div className="search-container">
                                    <input className='select-search gray-border' type="text" placeholder='Search Washable Items.......'/>
                                    <img className='select-search-logo' src={SearchLogo} alt=""  />
                                </div>
                                <div className="items-container">
                                    {washableItems && washableItems.map((washable)=>{
                                        return <WashableItem id={washable[0]} imgUrl={PantsLogo} itemName={washable[1].washable_item_name} onClick={() => addToOrderItems(washable[0], washable[1].washable_item_name, washable[1].item_per_kilo)}/>
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="orders-list-container gray-border">
                            <p className='section-title'>Your Order</p>
                            <div className="orders-list-headers-container">
                                <p className='subtext'>Item</p>
                                <p className='subtext'>Quantity</p>
                                <p className='subtext'>Action</p>
                            </div>
                            {orderItems && orderItems.map((orderItem, index)=>{
                                return <OrderItem imgUrl={BigPantsLogo} itemName={orderItem.washable_item_name} quantity={orderItem.quantity} increment={()=>addToOrderItems(orderItem.washable_item_id, orderItem.washable_item_name, orderItem.item_per_kilo)} decrement={()=>decrementQuantity(index)} remove={() => remove(index)}/>
                            })}                       
                        </div>
                    </div>
                    <div className="small-container">
                        <p className='small-container-title'>Status</p>
                        <div className="small-container-input-container">
                            <i className="ti ti-circle-check input-icon left-icon"></i>
                            <input className='small-container-input gray-border' type="text" placeholder='Washing'/>
                            <i className="hgi hgi-stroke hgi-arrow-down-01 input-icon right-icon"></i>
                        </div>
                    </div>
                    <div className="small-container">
                        <p className='small-container-title'>Mode of Transfer</p>
                        <div className="small-container-input-container">
                            <i className="hgi hgi-stroke hgi-shipping-truck-01 input-icon left-icon"></i>
                            <input className='small-container-input gray-border' type="text" defaultValue={order[1].mode_of_transfer}/>
                            <i className="hgi hgi-stroke hgi-arrow-down-01 input-icon right-icon"></i>
                        </div>
                    </div>
                    <div className="small-container">
                        <p className='small-container-title'>Mode of Claiming</p>
                        <div className="small-container-input-container">
                            <i className="hgi hgi-stroke hgi-shipping-truck-01 input-icon left-icon"></i>
                            <input className='small-container-input gray-border' type="text" defaultValue={order[1].mode_of_claiming}/>
                            <i className="hgi hgi-stroke hgi-arrow-down-01 input-icon right-icon"></i>
                        </div>
                    </div>
                    <div className="small-container">
                        <p className='small-container-title'>Order Date</p>
                        <div className="small-container-input-container">
                            <input className='small-container-input gray-border' type="text" defaultValue={order[1].created_at}/>
                            <i className="ti ti-calendar-week input-icon right-icon"></i>
                        </div>
                    </div>
                    <div className="small-container">
                        <p className='small-container-title'>Laundry Transfer Date Time</p>
                        <div className="small-container-input-container">
                            <input className='small-container-input gray-border' type="text" defaultValue={order[1].transfer_date}/>
                            <i className="ti ti-calendar-week input-icon right-icon"></i>
                        </div>
                    </div>
                    <div className="small-container">
                        <p className='small-container-title'>Arrival Date</p>
                        <div className="small-container-input-container">
                            <input className='small-container-input gray-border' type="text" defaultValue={order[1].arrival_date}/>
                            <i className="ti ti-calendar-week input-icon right-icon"></i>
                        </div>
                    </div>
                    <div className="small-container">
                        <p className='small-container-title'>Notes</p>
                        <div className="small-container-input-container">
                            <input className='small-container-input gray-border' type="text" defaultValue={order[1].notes.order_notes}/>
                        </div>
                    </div>
                    <Buttons/>
                </div>
            }
            {
                editDetail == 'schedule'  && order &&
                <div className="details-edit gray-border">
                    <div className="details-title-container">
                        <p className='details-title'>Schedule Details</p>
                        <p className='subtext'>Update Schedule Details</p>
                    </div>
                    <div className="small-container">
                        <p className='small-container-title'>Customer</p>
                        <div className="small-container-input-container">
                            <i className='ti ti-user input-icon left-icon'></i>
                            <input className='small-container-input gray-border' type="text" defaultValue={order[1].address}/>
                            <i className='ti ti-search input-icon right-icon'></i>
                        </div>
                    </div>
                    <div className="small-container">
                        <p className='small-container-title'>Address</p>
                        <div className="small-container-input-container">
                            <i className='ti ti-map-pin input-icon left-icon'></i>
                            <input className='small-container-input gray-border' type="text" defaultValue={order[1].address}/>
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
                            <input className='small-container-input gray-border' type="text" defaultValue={order[1].mode_of_claiming}/>
                            <i className="hgi hgi-stroke hgi-arrow-down-01 input-icon right-icon"></i>
                        </div>
                    </div>
                    <div className="small-container">
                        <p className='small-container-title'>Status</p>
                        <div className="small-container-input-container">
                            <i className="ti ti-circle-check input-icon left-icon"></i>
                            <input className='small-container-input gray-border' type="text" placeholder='Out for Delivery'/>
                            <i className="hgi hgi-stroke hgi-arrow-down-01 input-icon right-icon"></i>
                        </div>
                    </div>
                    <div className="small-container">
                        <p className='small-container-title'>Schedule Date</p>
                        <div className="small-container-input-container">
                            <i className="hgi hgi-stroke hgi-money-01 input-icon left-icon"></i>
                            <input className='small-container-input gray-border' type="text" placeholder='10/24/25'/>
                            <i className="ti ti-calendar-week input-icon right-icon"></i>
                        </div>
                    </div>
                    <div className="small-container">
                        <p className='small-container-title'>Delivery/Pickup Date</p>
                        <div className="small-container-input-container">
                            <i className="hgi hgi-stroke hgi-money-01 input-icon left-icon"></i>
                            <input className='small-container-input gray-border' type="text" placeholder='10/24/25'/>
                            <i className="ti ti-calendar-week input-icon right-icon"></i>
                        </div>
                    </div>
                    <div className="small-container">
                        <p className='small-container-title'>Time to Pickup/Delivery</p>
                        <div className="small-container-input-container">
                            <i className="hgi hgi-stroke hgi-money-01 input-icon left-icon"></i>
                            <input className='small-container-input gray-border' type="text" placeholder='7:00 AM'/>
                            <i className="ti ti-clock input-icon right-icon"></i>
                        </div>
                    </div>
                    <Buttons/>
                </div>
            }
            {
                editDetail == 'inventory'  && inventoryItem &&
                <div className="details-edit gray-border">
                    <div className="small-container">
                        <p className='small-container-title'>Item Name</p>
                        <div className="small-container-input-container">
                            <i className="hgi hgi-stroke hgi-menu-square input-icon left-icon"></i>
                            <input className='small-container-input gray-border' type="text" defaultValue={inventoryItem[1].inventory_item_name}/>
                        </div>
                    </div>
                    <div className="small-container">
                        <p className='small-container-title'>Quantity</p>
                        <div className="small-container-input-container">
                            <i className="hgi hgi-stroke hgi-shopping-cart-check-out-02 input-icon left-icon"></i>
                            <input className='small-container-input gray-border' type="text" defaultValue={inventoryItem[1].quantity}/>
                        </div>
                    </div>
                    <div className="small-container">
                        <p className='small-container-title'>Status</p>
                        <div className="small-container-input-container">
                            <i className='ti ti-circle-check input-icon left-icon'></i>
                            <input className='small-container-input gray-border' type="text" defaultValue={inventoryItem[1].status}/>
                            <i className="hgi hgi-stroke hgi-arrow-down-01 input-icon right-icon"></i>
                        </div>
                    </div>
                    <div className="small-container">
                        <p className='small-container-title'>Unit</p>
                        <div className="small-container-input-container">
                            <i className='ti ti-ruler-2 input-icon left-icon'></i>
                            <input className='small-container-input gray-border' type="text" defaultValue={inventoryItem[1].unit_name}/>
                            <i className="hgi hgi-stroke hgi-arrow-down-01 input-icon right-icon"></i>
                        </div>
                    </div>
                    <div className="small-container">
                        <p className='small-container-title'>Last Restock Date</p>
                        <div className="small-container-input-container">
                            <input className='small-container-input gray-border' type="text" defaultValue={inventoryItem[1].last_restocked}/>
                            <i className="ti ti-calendar-week input-icon right-icon"></i>
                        </div>
                    </div>
                    <Buttons/>
                </div>
            }
            {
                editDetail == 'service'  && serviceType &&
                <div className="details-edit gray-border">
                    <div className="small-container">
                        <p className='small-container-title'>Service Name</p>
                        <div className="small-container-input-container">
                            <i className="hgi hgi-stroke hgi-menu-square input-icon left-icon"></i>
                            <input className='small-container-input gray-border' type="text" defaultValue={serviceType[1].service_name}/>
                        </div>
                    </div>
                    <div className="small-container">
                        <p className='small-container-title'>Services included</p>
                        <div className="small-container-input-container">
                            <i className="hgi hgi-stroke hgi-shopping-cart-check-out-02 input-icon left-icon"></i>
                            <input className='small-container-input gray-border' type="text" defaultValue={serviceType[1].services}/>
                        </div>
                    </div>
                    <div className="small-container">
                        <p className='small-container-title'>Price</p>
                        <div className="small-container-input-container">
                            <i className='ti ti-circle-check input-icon left-icon'></i>
                            <input className='small-container-input gray-border' type="text" defaultValue={serviceType[1].service_price}/>
                            <i className="hgi hgi-stroke hgi-arrow-down-01 input-icon right-icon"></i>
                        </div>
                    </div>
                    <Buttons/>
                </div>
            }
            {
                editDetail == 'washable-item'  && washableItem &&
                <div className="details-edit gray-border">
                    <div className="small-container">
                        <p className='small-container-title'>Item Name</p>
                        <div className="small-container-input-container">
                            <i className="hgi hgi-stroke hgi-menu-square input-icon left-icon"></i>
                            <input className='small-container-input gray-border' type="text" defaultValue={washableItem[1].washable_item_name}/>
                        </div>
                    </div>
                    <div className="small-container">
                        <p className='small-container-title'>Item/Kg</p>
                        <div className="small-container-input-container">
                            <i className="hgi hgi-stroke hgi-shopping-cart-check-out-02 input-icon left-icon"></i>
                            <input className='small-container-input gray-border' type="text" defaultValue={washableItem[1].item_per_kilo}/>
                        </div>
                    </div>
                   
                    <Buttons/>
                </div>
            }
        </div>
    )
}