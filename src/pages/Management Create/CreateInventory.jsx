import './management-create.css'

export default function CreateInventory() {
    return(
        <div className="management-container">
            <div className="form">
                <div className="form-header">
                    <h2>Create Inventory</h2>
                    <p>Create a new inventory item by filling out the form below.</p>
                </div>
                <div className="input-field">
                    <label>Item Name</label>
                    <input type="text" placeholder="Enter item name" />
                </div>
                <div className="input-field">
                    <label>Quantity</label>
                    <input type="number" placeholder="Enter quantity" />
                </div>
                <div className="input-field">
                    <label>Status</label>
                    <select name="status" id="status">
                        <option value="" disabled selected hidden>Select status</option>
                        <option value="available">Available</option>
                        <option value="low stock">Low Stock</option>
                        <option value="out of stock">Out of Stock</option>
                    </select>
                </div>
                <div className="input-field">
                    <label>Unit</label>
                    <input type="text" placeholder="Enter unit" />
                </div>
                <div className="button-group">
                    <button className="cancel-button" onClick={()=>window.history.back()}>Cancel</button>
                    <button className="create-button">Create Inventory</button>
                </div>
            </div>
        </div>
    )
}