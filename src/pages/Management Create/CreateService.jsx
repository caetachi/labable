import './management-create.css'

export default function CreateService() {
    return(
        <div className="management-container">
            <div className="form">
                <div className="form-header">
                    <h2>Create Service</h2>
                    <p>Create a new service by filling out the form below.</p>
                </div>
                <div className="input-field">
                    <label>Service Name</label>
                    <input type="text" placeholder="Enter service name" />
                </div>
                <div className="input-field">
                    <label>Services Included</label>
                    <input type="text" placeholder="Enter services included (e.g, Wash, Dry, Fold, iron)" />
                </div>
                <div className="input-field">
                    <label>Price</label>
                    <input type="number" placeholder="Enter price" />
                </div>
                <div className="button-group">
                    <button className="cancel-button" onClick={()=>window.history.back()}>Cancel</button>
                    <button className="create-button">Create Service</button>
                </div>
            </div>
        </div>
    )
}