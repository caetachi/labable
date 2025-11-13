import { useState } from 'react';
import './management-create.css'
import { newSchedule } from '../../scripts/create';

export default function CreateSchedule() {

    const[orderID, setOrderID] = useState("");
    const[scheduleType, setScheduleType] = useState("");
    const[date, setDate] = useState("");
    const[time, setTime] = useState("");

    function submit(){
        newSchedule(orderID, scheduleType, date, time);
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
                    <input type="text" placeholder="Enter order ID" onChange={(e)=>setOrderID(e.target.value)} />
                </div>
                <div className="input-field">
                    <label>Type</label>
                    <select name="schedule-type" id="schedule_type" onChange={(e)=>setScheduleType(e.target.value)}>
                        <option value="" disabled selected hidden>Select type</option>
                        <option value="delivery">Delivery</option>
                        <option value="pickup">Pickup</option>
                    </select>
                </div>
                <div className="input-group">
                    <div className="input-field">
                        <label>Delivery/Pickup Date</label>
                        <input type="date" onChange={(e)=>setDate(e.target.value)} />
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
        </div>
    )
}