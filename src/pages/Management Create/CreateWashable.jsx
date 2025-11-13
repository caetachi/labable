import './management-create.css'

export default function CreateWashable() {
    return(
        <div className="management-container">
            <div className="form">
                <div className="form-header">
                    <h2>Create Washable</h2>
                    <p>Create a new washable item by filling out the form below.</p>
                </div>
                <div className="input-field">
                    <label>Washable Name</label>
                    <input type="text" placeholder="Enter washable name" />
                </div>
                <div className="input-field">
                    <label>Item/Kg</label>
                    <input type="number" placeholder="Enter how many items per kg" />
                </div>
                <div className="button-group">
                    <button className="cancel-button" onClick={()=>window.history.back()}>Cancel</button>
                    <button className="create-button">Create Washable</button>
                </div>
            </div>
        </div>
    )
}