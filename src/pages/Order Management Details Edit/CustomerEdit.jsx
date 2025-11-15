import { useState } from "react";
import { useNavigate } from "react-router";
import { updateUserWithUid } from "../../scripts/update";
import Buttons from "../../components/Buttons - Edit Details/Buttons";
import { toast } from "react-toastify";

export default function CustomerEdit({customer}){

    const [fullname, setFullname] = useState(customer.fullname);
    const [email, setEmail] = useState(customer.email);
    const [phoneNumber, setPhoneNumber] = useState(customer.phone);
    const [address, setAddress] = useState(customer.address);
    const navigate = useNavigate();

     async function update(){
        await updateUserWithUid(customer.auth_id, email, fullname, phoneNumber, address, null).then(()=>{
            toast.success("User Updated Successfully!");
        }).catch((error)=>{
            toast.error("Error updating user: " + error.message);
        });
        navigate('/admin/customer');
    }

    return(
        <div className="details-edit gray-border">
            <div className="small-container">
                <p className='small-container-title'>Customer Name</p>
                <div className="small-container-input-container">
                    <i className="hgi hgi-stroke hgi-menu-square input-icon left-icon"></i>
                    <input className='small-container-input gray-border' type="text" defaultValue={fullname} onChange={(e) => setFullname(e.target.value)}/>
                </div>
            </div>
            <div className="small-container">
                <p className='small-container-title'>Email</p>
                <div className="small-container-input-container">
                    <i className="hgi hgi-stroke hgi-shopping-cart-check-out-02 input-icon left-icon"></i>
                    <input className='small-container-input gray-border' type="text" defaultValue={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
            </div>
            <div className="small-container">
                <p className='small-container-title'>Phone no.</p>
                <div className="small-container-input-container">
                    <i className="hgi hgi-stroke hgi-shopping-cart-check-out-02 input-icon left-icon"></i>
                    <input className='small-container-input gray-border' type="text" defaultValue={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}/>
                </div>
            </div>
            <div className="small-container">
                <p className='small-container-title'>Address</p>
                <div className="small-container-input-container">
                    <i className="hgi hgi-stroke hgi-shopping-cart-check-out-02 input-icon left-icon"></i>
                    <input className='small-container-input gray-border' type="text" defaultValue={address} onChange={(e) => setAddress(e.target.value)}/>
                </div>
            </div>
            <Buttons onClick={update}/>
        </div>
    )
}