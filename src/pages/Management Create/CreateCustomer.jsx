import './management-create.css'

export default function CreateCustomer() {
    return(
        <div className="management-container">
            <div className="form">
                <div className="form-header">
                    <h2>Create Customer</h2>
                    <p>Create a new customer by filling out the form below.</p>
                </div>
                <div className="input-group">
                    <div className="input-field">
                        <label>First Name</label>
                        <input type="text" placeholder="Enter first name" />
                    </div>
                    <div className="input-field">
                        <label>Last Name</label>
                        <input type="text" placeholder="Enter last name" />
                    </div>
                </div>
                <div className="input-field">
                    <label>Email Address</label>
                    <input type="email" placeholder="Enter email address" />
                </div>
                <div className="input-field">
                    <label>Phone Number</label>
                    <input type="tel" placeholder="Enter phone number" />
                </div>
                <div className="input-field">
                    <label>Password</label>
                    <input type="password" placeholder="Enter password" />
                </div>
                <div className="input-field">
                    <label>Confirm Password</label>
                    <input type="password" placeholder="Confirm password" />
                </div>
                <div className="button-group">
                    <button className="cancel-button" onClick={()=>window.history.back()}>Cancel</button>
                    <button className="create-button">Create Customer</button>
                </div>
            </div>
        </div>
    )
}