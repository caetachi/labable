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

    function onName(e) {
        const temp = e.target.value;
        const error = document.getElementById('nameError');
        setFullname(null)
        if (!temp.trim()) {
            error.innerHTML = 'Customer name is required';
        } else {
            error.innerHTML = '';
            setFullname(temp);
        }
    }

    function onEmail(e) {
        const temp = e.target.value;
        const error = document.getElementById('emailError');
        setEmail(null)
        if (!temp.trim()) {
            error.innerHTML = 'Email is required';
        }else if (!temp.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            error.innerHTML = 'Email is invalid';
        } else {
            error.innerHTML = '';
            setEmail(temp);
        }
    }

    function onPhoneNumber(e) {
        const temp = e.target.value;
        const error = document.getElementById('phoneError');
        setPhoneNumber(null)
        if (!temp.trim()) {
            error.innerHTML = 'Phone number is required';
        } else if (!temp.match(/^(?:\+63|0)9\d{9}$/)) {
            error.innerHTML = 'Phone number is invalid';
        } 
        else {
            error.innerHTML = '';
            setPhoneNumber(temp);
        }
    }

    function onAddress(e) {
        const temp = e.target.value;
        const error = document.getElementById('addressError');
        setAddress(null)
        if (!temp.trim()) {
            error.innerHTML = 'Address is required';
        } else {
            error.innerHTML = '';
            setAddress(temp);
        }
    }

    return(
        <div className="details-edit gray-border">
            <div className="small-container">
                <p className='small-container-title'>Customer Name</p>
                <div className="small-container-input-container">
                    <i className="hgi hgi-stroke hgi-menu-square input-icon left-icon"></i>
                    <input className='small-container-input gray-border' type="text" defaultValue={fullname} onChange={(e) => onName(e)}/>
                </div>
                <p className="error-message" id="nameError"></p>
            </div>
            <div className="small-container">
                <p className='small-container-title'>Email</p>
                <div className="small-container-input-container">
                    <i className="hgi hgi-stroke hgi-shopping-cart-check-out-02 input-icon left-icon"></i>
                    <input className='small-container-input gray-border' type="text" defaultValue={email} onChange={(e) => onEmail(e)}/>
                </div>
                <p className="error-message" id="emailError"></p>
            </div>
            <div className="small-container">
                <p className='small-container-title'>Phone no.</p>
                <div className="small-container-input-container">
                    <i className="hgi hgi-stroke hgi-shopping-cart-check-out-02 input-icon left-icon"></i>
                    <input className='small-container-input gray-border' type="text" defaultValue={phoneNumber} onChange={(e) => onPhoneNumber(e)}/>
                </div>
                <p className="error-message" id="phoneError"></p>
            </div>
            <div className="small-container">
                <p className='small-container-title'>Address</p>
                <div className="small-container-input-container">
                    <i className="hgi hgi-stroke hgi-shopping-cart-check-out-02 input-icon left-icon"></i>
                    <input className='small-container-input gray-border' type="text" defaultValue={address} onChange={(e) => onAddress(e)}/>
                </div>
                <p className="error-message" id="addressError"></p>
            </div>
            { fullname && email && phoneNumber && address ?
                <Buttons onClick={update} disabled={false}/>
                :
                <Buttons onClick={update} disabled={true}/>
            }
        </div>
    )
}