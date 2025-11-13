import './order-create.css'
import EditLogo from '../../assets/edit.svg'
import SearchLogo from '../../assets/search.svg'
import PantsLogo from '../../assets/pants.svg'
import BigPantsLogo from '../../assets/pants-big.svg'
import GCashLogo from '../../assets/gcash.svg'
import { useNavigate } from 'react-router'
import WashableItem from '../../components/Washable Item - Create Order/WashableItem'
import OrderItem from '../../components/Order Item - Create Order/OrderItem'
import { useEffect, useState } from 'react'
import { getServicePrice, getServices, getWashableItems } from '../../scripts/get'
import ServiceType from '../../components/Service Type - Create Order/ServiceType'
import { toast } from 'react-toastify'
import BigNumber from 'bignumber.js'

export default function CreateOrder() {
    const [address, setAddress] = useState();
    const [service, setService] = useState();
    const [orderItems, setOrderItems] = useState([]);
    const [modeTransfer, setModeTransfer] = useState();
    const [transferDate, setTransferDate] = useState();
    const [modeClaim, setModeClaim] = useState();
    const [payment, setPayment] = useState();
    const [notes, setNotes] = useState();
    const [pricePerKg, setPricePerKg] = useState();
    const [washableItems, setWashableItems] = useState([]);
    const [serviceTypes, setServiceTypes] = useState([]);
    const [amount, setAmount] = useState();
    const [minDate, setMinDate] = useState();
    const navigate = useNavigate();

    function setupServices(){
        const services = document.querySelectorAll('.create-service-type-card');
        services.forEach(function(serviceCard){ // parang radio-group galing ko talaga
            const icons = document.querySelectorAll('.create-service-type-icon');
            serviceCard.addEventListener('click', () =>{
                icons.forEach(icon => {
                    icon.classList.remove('service-selected');
                });
                const icon = serviceCard.querySelector('.create-service-type-icon');
                const serviceId = serviceCard.getAttribute('id');
                setService(serviceId);
                icon.classList.add('service-selected');
            });
        });
    }

    function getMinDateTime(hoursAhead) {
        let now = new Date();
        now.setHours(now.getHours()+hoursAhead);

        const offset = now.getTimezoneOffset() * 60000; 
        const localTime = new Date(now.getTime() - offset);
        return localTime.toISOString().slice(0, 16);
    }

    function addOnChange(){
        const input = document.getElementById('input-transfer');
        input.addEventListener('change', () => { //para yung order pwede i-set kahapon
            if (input.value < input.min) {
                input.value = input.min;
            }
            setTransferDate(input.value);
        });
    }
    
    useEffect(()=>{
        setMinDate(getMinDateTime(2));
        async function getStuff(params) {
            const washablesList = await getWashableItems();
            const serviceList = await getServices();
            
            let washables = [];
            let services = [];
            
            for(let i = 0; i < washablesList.length; i++){
                if(washablesList[i][0] != 'washables_counter'){
                    washables.push(washablesList[i]);
                }
            }
            for(let i = 0; i < serviceList.length; i++){
                if(serviceList[i][0] != 'service_counter'){
                    services.push(serviceList[i]);
                }
            }
            setWashableItems(washables);
            setServiceTypes(services);
        }
        getStuff();
        addOnChange();
        const transfers = document.getElementsByName('transfer-mode');
        transfers.forEach(element => {
            element.addEventListener('click', ()=>{
                setModeTransfer(element.value)
            })
        });
        const receives = document.getElementsByName('receive-mode');
        receives.forEach(element => {
            element.addEventListener('click', ()=>{
                setModeClaim(element.value)
            })
        });
        const payments = document.getElementsByName('payment-method');
        payments.forEach(element => {
            element.addEventListener('click', ()=>{
                setPayment(element.value)
            })
        });
    }, [])

    useEffect(()=>{
        setupServices();
    }, [serviceTypes])

    useEffect(()=>{
        async function settingServicePrice() {
            if(service){
                setPricePerKg(await getServicePrice(service));                
            }
        }
        settingServicePrice();
    }, [service])

    useEffect(()=>{
        if(orderItems && pricePerKg){
            let total_kilo = new BigNumber(0);
            for(let i = 0; i < orderItems.length; i++){
                total_kilo  = total_kilo.plus(orderItems[i].total_kilo);
            }
            setAmount(Number(total_kilo * pricePerKg).toFixed(2));
        }
    },[orderItems, pricePerKg])


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
                            orderItems[decrementIndex].total_kilo = Number((item.quantity - 1) / item.item_per_kilo);
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

    async function submit(){
        const draft = {
            serviceUid: service,
            address: address,
            paymentMethod: payment,
            transferMode: modeTransfer,
            transferDate: transferDate,
            arrivalDate: transferDate,
            claimMode: modeClaim,
            note: notes,
            orders: orderItems,
            amount: amount
        };

        const checks = [
            [!address, 'No address indicated.'],
            [!service, 'No service selected.'],
            [!payment, 'No payment method selected.'],
            [!transferDate, 'No transfer date indicated.'],
            [!modeTransfer, 'No mode of transfer selected.'],
            [!modeClaim, 'No mode of claiming selected.'],
            [(orderItems?.length ?? 0) === 0, 'Order list is empty.']
        ];

        for (const [failed, message] of checks) {
            if (failed) {
                toast.error(message);
                return;
            }
        }

        navigate('/order-summary', { state: { orderData: draft } });
    }
        
    return(
        <div className='create-order-container'>
            <div className="title-container">
                <p className='create-order-title'>Create Your Order</p>
                <p className='create-order-subtitle'>Fill in the details below to schedule your laundry service</p>
            </div>
            <div className="draft-container gray-border">
                <p className='drafts-title'>Drafts</p>
                <div className="drafts-container">
                    <div className="draft gray-border">
                        <p className="draft-title">Title</p>
                        <p className="subtext">Description</p>
                    </div>
                    <div className="draft gray-border">
                        <p className="draft-title">Title</p>
                        <p className="subtext">Description</p>
                    </div>
                    <div className="draft gray-border">
                        <p className="draft-title">Title</p>
                        <p className="subtext">Description</p>
                    </div>
                </div>
            </div>
            <div className="order-details-container gray-border">
                <p className="order-details-title">Order Details</p>
                <div className="address-container">
                    <svg className='location-icon' width="27" height="30" viewBox="0 0 27 30" fill="black" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M13.125 0C16.606 0 19.9444 1.38281 22.4058 3.84422C24.8672 6.30564 26.25 9.64403 26.25 13.125C26.25 17.6079 23.8058 21.2771 21.2304 23.9094C19.9437 25.2103 18.5397 26.3897 17.0363 27.4327L16.415 27.8556L16.1233 28.0496L15.5735 28.3996L15.0835 28.6985L14.4769 29.0515C14.0651 29.2865 13.5991 29.4101 13.125 29.4101C12.6509 29.4101 12.1849 29.2865 11.7731 29.0515L11.1665 28.6985L10.4081 28.2319L10.1281 28.0496L9.53021 27.6515C7.9083 26.5541 6.39757 25.3008 5.01958 23.9094C2.44417 21.2756 0 17.6079 0 13.125C0 9.64403 1.38281 6.30564 3.84422 3.84422C6.30564 1.38281 9.64403 0 13.125 0ZM13.125 2.91667C10.4176 2.91667 7.82105 3.99218 5.90662 5.90662C3.99218 7.82105 2.91667 10.4176 2.91667 13.125C2.91667 16.5112 4.77167 19.4833 7.10354 21.8692C8.10619 22.8842 9.18992 23.8157 10.344 24.6546L11.0119 25.13C11.2277 25.2807 11.4353 25.4207 11.6346 25.55L12.2033 25.9146L12.7035 26.2194L13.125 26.4658L13.7885 26.0735L14.3237 25.7381C14.6086 25.5573 14.9134 25.3546 15.2381 25.13L15.906 24.6546C17.0601 23.8157 18.1438 22.8842 19.1465 21.8692C21.4783 19.4848 23.3333 16.5112 23.3333 13.125C23.3333 10.4176 22.2578 7.82105 20.3434 5.90662C18.4289 3.99218 15.8324 2.91667 13.125 2.91667ZM13.125 7.29167C14.6721 7.29167 16.1558 7.90625 17.2498 9.00021C18.3438 10.0942 18.9583 11.5779 18.9583 13.125C18.9583 14.6721 18.3438 16.1558 17.2498 17.2498C16.1558 18.3438 14.6721 18.9583 13.125 18.9583C11.5779 18.9583 10.0942 18.3438 9.00021 17.2498C7.90625 16.1558 7.29167 14.6721 7.29167 13.125C7.29167 11.5779 7.90625 10.0942 9.00021 9.00021C10.0942 7.90625 11.5779 7.29167 13.125 7.29167ZM13.125 10.2083C12.3515 10.2083 11.6096 10.5156 11.0626 11.0626C10.5156 11.6096 10.2083 12.3515 10.2083 13.125C10.2083 13.8985 10.5156 14.6404 11.0626 15.1874C11.6096 15.7344 12.3515 16.0417 13.125 16.0417C13.8985 16.0417 14.6404 15.7344 15.1874 15.1874C15.7344 14.6404 16.0417 13.8985 16.0417 13.125C16.0417 12.3515 15.7344 11.6096 15.1874 11.0626C14.6404 10.5156 13.8985 10.2083 13.125 10.2083Z" />
                    </svg>
                    <p className='section-title'>Address</p>
                </div>
                <div className="address-input-container">
                    <input className='create-address-input gray-border' type="text" placeholder='454, Sitio Uli-Ulit, Pinalagdan, Paombong, Bulacan' onChange={(e)=>setAddress(e.target.value)}/>
                    <img className='address-edit' src={EditLogo} alt="" />
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
                                {washableItems.map((washable)=>{
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
            
            <div className="service-types-containter gray-border">
                <p className='section-title'>Type of Service</p>
                <div className="services-container">
                    {serviceTypes && serviceTypes.map((service)=>{
                        return <ServiceType icon='shirt' imgUrl={service[1].image_url} name={service[1].service_name} id={service[0]}/>
                    })}
                </div>
            </div>
            <div className="transfer-details-container">
                <div className="transfer-mode-container gray-border">
                    <p className='section-title'>Mode of Laundry Transfer</p>
                    <div className="radio-container">
                        <div>
                            <input className='radio' type="radio" name="transfer-mode" id="pick-up-transfer" value={'Pick-up'}/>
                        </div>
                        <label className='radio-label' htmlFor="pick-up-transfer">
                            Pickup (Collected from your address)
                        </label>
                    </div>
                    <div className="radio-container">
                        <label className='radio-label' htmlFor="deliver-transfer">
                            <input className='radio' type="radio" name="transfer-mode" id="deliver-transfer" value={'Deliver'}/>
                            Deliver
                        </label>
                    </div>
                </div>
                <div className="transfer-date-container gray-border">
                    <p className='section-title'>Laundry Transfer Date</p>
                    <input className='transfer-date-input gray-border' type="datetime-local" id="input-transfer" min={minDate} onChange={(e) => setTransferDate(e.target.value)}/>
                </div>
            </div>
            <div className="receive-mode-container section gray-border">
                <p className='section-title'>How would you like to receive your clean laundry?</p>
                <div className="radio-container">
                    <input className='radio' type="radio" name="receive-mode" id="pick-up-receive" value={'Pick-up'}/>
                    <label className='radio-label' htmlFor="pick-up-receive">
                        Pickup
                    </label>
                </div>
                <div className="radio-container">
                    <input className='radio' type="radio" name="receive-mode" id="drop-off-receive" value={'Deliver'}/>
                    <label className='radio-label' htmlFor="drop-off-receive">
                        Deliver
                    </label>
                </div>
            </div>
            <div className="payment-method-container section gray-border">
                <p className='section-title'>Payment Method</p>
                <div className="radio-container">
                    <label className='radio-label' htmlFor="cash-payment">
                        <input className='radio' type="radio" name="payment-method" id="cash-payment" value={'Cash'}/>
                        Cash
                    </label>
                </div>
                <div className="radio-container">
                    <label className='radio-label' htmlFor="gcash-payment">
                        <input className='radio' type="radio" name="payment-method" id="gcash-payment" value={'GCash'}/>
                        GCash <img src={GCashLogo}/>
                    </label>
                </div>
            </div>
            <div className="additional-notes-container section gray-border">
                <p className='section-title'>Additional Notes (Optional)</p>
                <textarea className='additional-textarea gray-border' name="notes" id="" placeholder='Any special instructions...' onChange={(e) => setNotes(e.target.value)}></textarea>
            </div>
            <p className='section-title'>Estimated Cost: Php {amount ? amount : Number(0).toFixed(2)}</p>
            <div className="action-buttons">
                <button className='action-button draft-button' onClick={() => submit()}>Save as Draft</button>
                <button className='action-button summary-button' onClick={() => submit()}>Review Order Summary <p className='summary-number'>{orderItems.length}</p></button>
            </div>
            </div>
        </div>
    )
}