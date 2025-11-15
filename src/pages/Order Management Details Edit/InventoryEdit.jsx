import { useEffect, useState } from "react";
import Buttons from "../../components/Buttons - Edit Details/Buttons";
import { updateInventoryItem, updateWashableItem } from "../../scripts/update";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
export default function InventoryEdit({inventoryItem}){

    const [inventoryName, setInventoryName] = useState(inventoryItem[1].inventory_item_name);
    const [quantity, setQuantity] = useState(inventoryItem[1].quantity_in_stock);
    const [status, setStatus] = useState(inventoryItem[1].status);
    const [unitName, setUnitName] = useState(inventoryItem[1].unit_name);
    const [lastRestocked, setLastRestocked] = useState(inventoryItem[1].last_restocked);
    const [inventoryUid, setInventoryUid] = useState(inventoryItem[0]);
    const navigate = useNavigate();

    async function update(){
        await updateInventoryItem(inventoryUid, inventoryName, quantity, status, unitName, lastRestocked).then(()=>{
            toast.success("Inventory Item Updated Successfully!");
        }).catch((error)=>{
            toast.error("Error updating inventory item: " + error.message);
        });
        navigate('/admin/inventory');
    }

    function onName(e) {
        const temp = e.target.value;
        const error = document.getElementById('nameError');
        setInventoryName(null)

        if (!temp.trim()) {
            error.innerHTML = 'Item name is required';
        } else {
            error.innerHTML = '';
            setInventoryName(temp);
        }
    }

    function onQuantity(e) {
        const temp = e.target.value;
        const error = document.getElementById('quantityError');
        setQuantity(null)
        if (!temp.trim()) {
            error.innerHTML = 'Quantity is required';
        } else if (isNaN(temp)) {
            error.innerHTML = 'Quantity must be a number';
        } else {
            error.innerHTML = '';
            setQuantity(temp);
        }
    }
    
    function onUnitChange(e) {
        const temp = e.target.value;
        const error = document.getElementById('unitError');
        setUnitName(null)
        if (!temp.trim()) {
            error.innerHTML = 'Unit is required';
        } else {
            error.innerHTML = '';
            setUnitName(temp);
        }
    }

    function onLastRestockedChange(e) {
        const temp = e.target.value;
        const error = document.getElementById('lastRestockedError');
        setLastRestocked(null)
        if (!temp.trim()) {
            error.innerHTML = 'Last restocked date is required';
        } else {
            error.innerHTML = '';
            setLastRestocked(temp);
        }
    }

    return(
        <div className="details-edit gray-border">
            <div className="small-container">
                <p className='small-container-title'>Item Name</p>
                <div className="small-container-input-container">
                    <i className="hgi hgi-stroke hgi-menu-square input-icon left-icon"></i>
                    <input className='small-container-input gray-border' type="text" defaultValue={inventoryName} onChange={(e)=>onName(e)}/>
                </div>
                <p className="error-message" id="nameError"></p>
            </div>
            <div className="small-container">
                <p className='small-container-title'>Quantity</p>
                <div className="small-container-input-container">
                    <i className="hgi hgi-stroke hgi-shopping-cart-check-out-02 input-icon left-icon"></i>
                    <input className='small-container-input gray-border' type="text" defaultValue={quantity} onChange={(e)=>onQuantity(e)}/>
                </div>
                <p className="error-message" id="quantityError"></p>
            </div>
            <div className="small-container">
                <p className='small-container-title'>Status</p>
                <div className="small-container-input-container">
                    <i className='ti ti-circle-check input-icon left-icon'></i>
                    <select className='small-container-input gray-border' type="text" defaultValue={status} onChange={(e)=>setStatus(e.target.value)}>
                        <option value="Low Stock">Low Stock</option>
                        <option value="Available">Available</option>
                        <option value="Out of Stock">Out of Stock</option>
                    </select>
                    {/* <i className="hgi hgi-stroke hgi-arrow-down-01 input-icon right-icon"></i> */}
                </div>
            </div>
            <div className="small-container">
                <p className='small-container-title'>Unit</p>
                <div className="small-container-input-container">
                    <i className='ti ti-ruler-2 input-icon left-icon'></i>
                    <input className='small-container-input gray-border' type="text" defaultValue={unitName} onChange={(e)=>onUnitChange(e)}/>
                    <i className="hgi hgi-stroke hgi-arrow-down-01 input-icon right-icon"></i>
                </div>
                <p className="error-message" id="unitError"></p>
            </div>
            <div className="small-container">
                <p className='small-container-title'>Last Restock Date</p>
                <div className="small-container-input-container">
                    <input className='small-container-input gray-border' type="text" defaultValue={lastRestocked} onChange={(e)=>onLastRestockedChange(e)}/>
                    <i className="ti ti-calendar-week input-icon right-icon"></i>
                </div>
                <p className="error-message" id="lastRestockedError"></p>
            </div>
            {
                inventoryName && quantity && status && unitName && lastRestocked ?
                <Buttons onClick={update} disabled={false}/>
                :
                <Buttons onClick={update} disabled={true}/>
            }
        </div>
    )
}