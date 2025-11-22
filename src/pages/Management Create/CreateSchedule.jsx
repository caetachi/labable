import { useState } from 'react';
import './management-create.css'
import { newSchedule } from '../../scripts/create';
import AIAssistant from '../../components/AI Assistant/AIAssistant';

export default function CreateSchedule() {

    const[orderID, setOrderID] = useState("");
    const[scheduleType, setScheduleType] = useState("");
    const[date, setDate] = useState("");
    const[time, setTime] = useState("");

    function submit(){
        newSchedule(orderID, scheduleType, date, time);
    }

    function onOrderIDChange(e){
        const temp = e.target.value;
        const error = document.getElementById('orderIdErrorMessage');
        setOrderID(null)

        if (!temp.trim()) {
            error.innerHTML = 'Order ID is required';
        }else if(!temp.match(/^ORD-\d{1,6}$/)){
            error.innerHTML = 'Invalid Order ID format. Expected format: ORD-XXXX';
        } else {
            error.innerHTML = '';
            setOrderID(temp);
        }
    }

    function onDateChange(e){
        const temp = e.target.value;
        const error = document.getElementById('dateErrorMessage');
        setDate(null)

        if (!temp.trim()) {
            error.innerHTML = 'Date is required';
        } else {
            error.innerHTML = '';
            setDate(temp);
        }
    }

    return(
        <div className="management-container">
            <div className="form">
                <div className="form-header">
                    <h2>Create Schedule</h2>
                    <p>Create a new schedule by filling out the form below.</p>
                </div>
                <div className="input-field">
                    <label>Order ID</label>
                    <input type="text" placeholder="Enter order ID" onChange={(e)=>onOrderIDChange(e)} />
                    <p className='error-message' id='orderIdErrorMessage'></p>
                </div>
                <div className="input-field">
                    <label>Type</label>
                    <select name="schedule-type" id="schedule_type" defaultValue={""} onChange={(e)=>setScheduleType(e.target.value)}>
                        <option value="" disabled selected hidden>Select type</option>
                        <option value="delivery">Delivery</option>
                        <option value="pickup">Pickup</option>
                    </select>
                    <p className='error-message' id='dateErrorMessage'></p>
                </div>
                <div className="input-group">
                    <div className="input-field">
                        <label>Delivery/Pickup Date</label>
                        <input type="date" onChange={(e)=>onDateChange(e)} />
                    </div>
                    <div className="input-field">
                        <label>Delivery/Pickup Time</label>
                        <input type="time" onChange={(e)=>setTime(e.target.value)} />
                    </div>
                </div>
                <div className="button-group">
                    <button className="cancel-button" onClick={()=>window.history.back()}>Cancel</button>
                    {orderID && scheduleType && date && time ?
                    <button className="create-button" onClick={submit}>Create Schedule</button>
                    :
                    <button className="create-button disabled" disabled>Create Schedule</button>
                    }
                </div>
            </div>
            <AIAssistant/>
        </div>
    )
}