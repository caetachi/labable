import { useEffect, useState } from "react";
import Buttons from "../../components/Buttons - Edit Details/Buttons";
import { updateWashableItem } from "../../scripts/update";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

export default function WashableEdit({washableItem}){
    const [washableName, setWashableName] = useState(washableItem[1].washable_item_name);
    const [itemPerKg, setItemPerKg] = useState(washableItem[1].item_per_kilo);
    const [washableUid, setWashableUid] = useState(washableItem[0]);
    const navigate = useNavigate();

    async function update(){
        await updateWashableItem(washableUid, washableName, itemPerKg).then(()=>{
            toast.success("Washable Item Updated Successfully!");
        }).catch((error)=>{
            toast.error("Error updating washable item: " + error.message);
        });
        navigate('/admin/washable');
    }

    

    return(
        <div className="details-edit gray-border">
            <div className="small-container">
                <p className='small-container-title'>Item Name</p>
                <div className="small-container-input-container">
                    <i className="hgi hgi-stroke hgi-menu-square input-icon left-icon"></i>
                    <input className='small-container-input gray-border' type="text" defaultValue={washableName} onChange={(e) => setWashableName(e.target.value)}/>
                </div>
            </div>
            <div className="small-container">
                <p className='small-container-title'>Item/Kg</p>
                <div className="small-container-input-container">
                    <i className="hgi hgi-stroke hgi-shopping-cart-check-out-02 input-icon left-icon"></i>
                    <input className='small-container-input gray-border' type="text" defaultValue={itemPerKg} onChange={(e) => setItemPerKg(e.target.value)}/>
                </div>
            </div>
            <Buttons onClick={update}/>
        </div>
    )
}