import './management-create.css'

export default function CreateSchedule() {
    return(
        <div className="management-container">
            <div className="form">
                <div className="form-header">
                    <h2>Create Schedule</h2>
                    <p>Create a new schedule by filling out the form below.</p>
                </div>
                <div className="input-field">
                    <label>Order ID</label>
                    <input type="text" placeholder="Enter order ID" />
                </div>
                <div className="input-field">
                    <label>Type</label>
                    <select name="schedule-type" id="schedule_type">
                        <option value="" disabled selected hidden>Select type</option>
                        <option value="delivery">Delivery</option>
                        <option value="pickup">Pickup</option>
                    </select>
                </div>
                <div className="input-group">
                    <div className="input-field">
                        <label>Delivery/Pickup Date</label>
                        <input type="date" />
                    </div>
                    <div className="input-field">
                        <label>Delivery/Pickup Time</label>
                        <input type="time" />
                    </div>
                </div>
                <div className="button-group">
                    <button className="cancel-button" onClick={()=>window.history.back()}>Cancel</button>
                    <button className="create-button">Create Schedule</button>
                </div>
            </div>
        </div>
    )
}