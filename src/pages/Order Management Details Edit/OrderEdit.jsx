import { useEffect, useState } from "react";
import { getItemPerKg, getOrder, getServiceUid, getWashableItems } from "../../scripts/get";

import SearchLogo from '../../assets/search.svg'
import PantsLogo from '../../assets/pants.svg'
import BigPantsLogo from '../../assets/pants-big.svg'
import ShirtLogo from '../../assets/shirt.svg'
import SkirtLogo from '../../assets/skirt.svg'
import DressLogo from '../../assets/dress.svg'
import Buttons from "../../components/Buttons - Edit Details/Buttons";
import OrderItem from "../../components/Order Item - Create Order/OrderItem";
import WashableItem from "../../components/Washable Item - Create Order/WashableItem";
import { updateOrderDetails } from "../../scripts/update";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

export default function OrderEdit({id}){    
    
    const [orderItems, setOrderItems] = useState([]);
    const [washableItems, setWashableItems] = useState([]);
    const [order, setOrder] = useState([]);

    const [customerName, setCustomerName] = useState("");
    const [address, setAddress] = useState("");
    const [serviceName, setServiceName] = useState("");
    const [serviceType, setServiceType] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [amount, setAmount] = useState("");
    const [status, setStatus] = useState("");
    const [modeOfTransfer, setModeOfTransfer] = useState("");
    const [modeOfClaiming, setModeOfClaiming] = useState("");
    const [orderDate, setOrderDate] = useState("");
    const [laundryTransferDateTime, setLaundryTransferDateTime] = useState("");
    const [arrivalDate, setArrivalDate] = useState("");
    const [notes, setNotes] = useState("");
    const navigate = useNavigate();


    async function addToOrderItems(washableItemUid, washableItemName, itemPerKg){
        console.log(itemPerKg);
        const itemPerKgNum = await getItemPerKg(washableItemUid);
        setOrderItems(prevOrderItems => {
            const existingItemIndex = prevOrderItems.findIndex( // check kung existing na
                item => item.washable_item_id === washableItemUid
            );
            if (existingItemIndex > -1) { // -1 pag wala
                return prevOrderItems.map((item, index) => {
                    if (index === existingItemIndex) {
                        return { ...item, quantity: item.quantity + 1, total_kilo: Number((item.quantity + 1) / itemPerKgNum)}; // update quantity and total kilo
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
                        total_kilo:Number( 1 / itemPerKgNum),
                        item_per_kilo: Number(itemPerKgNum)
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

    useEffect(()=>{
        console.log("Order Items:", orderItems);
    }, [orderItems])

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
        async function getOrderList() {
            const currOrder = await getOrder(String(id));
            setOrder(currOrder);
            console.log(currOrder[1].order_items);
            setOrderItems(currOrder[1].order_items);
        }
        getOrderList();
        getStuff();
    }, [])

    useEffect(()=>{
        setCustomerName(order[1]?.customer_name || "");
        setAddress(order[1]?.address || "");
        setServiceName(order[1]?.service_name || "");
        setPaymentMethod(order[1]?.payment_method || "");
        setAmount(order[1]?.amount || "");
        setStatus(order[1]?.status || "");
        setModeOfTransfer(order[1]?.mode_of_transfer || "");
        setModeOfClaiming(order[1]?.mode_of_claiming || "");
        setOrderDate(order[1]?.created_at || "");
        setLaundryTransferDateTime(order[1]?.transfer_date || "");
        setArrivalDate(order[1]?.arrival_date || "");
        setNotes(order[1]?.notes?.order_notes || "");
    }, [order])

    useEffect(()=>{
        async function fetchServiceType() {
            const serviceUid = await getServiceUid(serviceName);
            setServiceType(serviceUid);
        }
        fetchServiceType();
    }, [serviceName])

    if (order.length === 0 || !order[1]) {
        return <div className="order-edit-loading">Loading Order Details...</div>;
    }

    async function update(){
        await updateOrderDetails(id, customerName, address, serviceType, serviceName, paymentMethod, amount, orderItems, status, modeOfTransfer, modeOfClaiming, orderDate, laundryTransferDateTime, arrivalDate, notes).then(()=>{
            toast.success("Order Updated Successfully!");
        }).catch((error)=>{
            toast.error("Error updating order: " + error.message);
        });
        
        navigate('/admin/order');
    }

    return( 
        <div className="details-edit gray-border">
            <div className="details-title-container">
                <p className='details-title'>Order Details</p>
                <p className='subtext'>Update Order Details</p>
            </div>
            <div className="small-container">
                <p className='small-container-title'>Customer</p>
                <div className="small-container-input-container">
                    <i className='ti ti-user input-icon left-icon'></i>
                    <input className='small-container-input gray-border' type="text" defaultValue={order[1].customer_name} onChange={(e)=>setCustomerName(e.target.value)}/>
                    <i className='ti ti-search input-icon right-icon'></i>
                </div>
            </div>
            <div className="small-container">
                <p className='small-container-title'>Address</p>
                <div className="small-container-input-container">
                    <i className='ti ti-map-pin input-icon left-icon'></i>
                    <input className='small-container-input gray-border' type="text" defaultValue={order[1].address ? order[1].address : "N/A" } onChange={(e)=>setAddress(e.target.value)}/>
                    <i className='ti ti-map-2 input-icon right-icon'></i>
                </div>
            </div>
            <div className="small-container">
                <p className='small-container-title'>Service Type</p>
                <div className="small-container-input-container">
                    <i className="ti ti-wash-machine input-icon left-icon"></i>
                    <input className='small-container-input gray-border' type="text" defaultValue={order[1].service_name} onChange={(e)=>setServiceName(e.target.value)}/>
                    <i className="hgi hgi-stroke hgi-arrow-down-01 input-icon right-icon"></i>
                </div>
            </div>
            <div className="small-container">
                <p className='small-container-title'>Payment Method</p>
                <div className="small-container-input-container">
                    <i className="hgi hgi-stroke hgi-money-01 input-icon left-icon"></i>
                    <select className='small-container-input gray-border' defaultValue={order[1].payment ? order[1].payment.payment_method : "N/A"} onChange={(e)=>setPaymentMethod(e.target.value)}>
                        <option value="Cash">Cash</option>
                        <option value="GCash">GCash</option>
                    </select>
                </div>
            </div>
            <div className="small-container">
                <p className='small-container-title'>Amount</p>
                <div className="small-container-input-container">
                    <i className="hgi hgi-stroke hgi-money-01 input-icon left-icon"></i>
                    <input className='small-container-input gray-border' type="text" defaultValue={order[1].amount} onChange={(e)=>setAmount(e.target.value)}/>
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
                    <input className='small-container-input gray-border' type="text" defaultValue={order[1].status} onChange={(e)=>setStatus(e.target.value)}/>
                    <i className="hgi hgi-stroke hgi-arrow-down-01 input-icon right-icon"></i>
                </div>
            </div>
            <div className="small-container">
                <p className='small-container-title'>Mode of Transfer</p>
                <div className="small-container-input-container">
                    <i className="hgi hgi-stroke hgi-shipping-truck-01 input-icon left-icon"></i>
                    <input className='small-container-input gray-border' type="text" defaultValue={order[1].mode_of_transfer} onChange={(e)=>setModeOfTransfer(e.target.value)}/>
                    <i className="hgi hgi-stroke hgi-arrow-down-01 input-icon right-icon"></i>
                </div>
            </div>
            <div className="small-container">
                <p className='small-container-title'>Mode of Claiming</p>
                <div className="small-container-input-container">
                    <i className="hgi hgi-stroke hgi-shipping-truck-01 input-icon left-icon"></i>
                    <input className='small-container-input gray-border' type="text" defaultValue={order[1].mode_of_claiming} onChange={(e)=>setModeOfClaiming(e.target.value)}/>
                    <i className="hgi hgi-stroke hgi-arrow-down-01 input-icon right-icon"></i>
                </div>
            </div>
            <div className="small-container">
                <p className='small-container-title'>Order Date</p>
                <div className="small-container-input-container">
                    <input className='small-container-input gray-border' type="text" defaultValue={order[1].created_at} onChange={(e)=>setOrderDate(e.target.value)}/>
                    <i className="ti ti-calendar-week input-icon right-icon"></i>
                </div>
            </div>
            <div className="small-container">
                <p className='small-container-title'>Laundry Transfer Date Time</p>
                <div className="small-container-input-container">
                    <input className='small-container-input gray-border' type="text" defaultValue={order[1].transfer_date} onChange={(e)=>setTransferDate(e.target.value)}/>
                    <i className="ti ti-calendar-week input-icon right-icon"></i>
                </div>
            </div>
            <div className="small-container">
                <p className='small-container-title'>Arrival Date</p>
                <div className="small-container-input-container">
                    <input className='small-container-input gray-border' type="text" defaultValue={order[1].arrival_date} onChange={(e)=>setArrivalDate(e.target.value)}/>
                    <i className="ti ti-calendar-week input-icon right-icon"></i>
                </div>
            </div>
            <div className="small-container">
                <p className='small-container-title'>Notes</p>
                <div className="small-container-input-container">
                    <input className='small-container-input gray-border' type="text" defaultValue={order[1].notes ? order[1].notes.order_notes : ""} onChange={(e)=>setOrderNotes(e.target.value)}/>
                </div>
            </div>
            <Buttons onClick={update}/>
        </div>
    )
}