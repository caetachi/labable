import './create-order.css'
import LocationLogo from '../../assets/location.png'
import EditLogo from '../../assets/edit.png'
import SearchLogo from '../../assets/search.png'
import PantsLogo from '../../assets/pants.png'
import ShirtLogo from '../../assets/shirt.png'
import SkirtLogo from '../../assets/skirt.png'
import DressLogo from '../../assets/dress.png'
export default function CreateOrder() {
    return(
        <div className='create-order-container'>
            <div className="title-container">
                <p className='create-order-title'>Create Your Order</p>
                <p className='create-order-subtitle'>Fill in the details below to schedule your laundry service</p>
            </div>
            <div className="draft-container">
                <p className='drafts-title'>Drafts</p>
                <div className="drafts-container">
                    <div className="draft">
                        <p className="draft-title">Title</p>
                        <p className="draft-description">Description</p>
                    </div>
                    <div className="draft">
                        <p className="draft-title">Title</p>
                        <p className="draft-description">Description</p>
                    </div>
                    <div className="draft">
                        <p className="draft-title">Title</p>
                        <p className="draft-description">Description</p>
                    </div>
                </div>
            </div>
            <div className="order-details-container">
                <p className="order-details-title">Order Details</p>
                <div className="address-container">
                    <img src={LocationLogo} alt="" />
                    <p className='section-title'>Address</p>
                </div>
                <div className="address-input-container">
                    <input className='address-input' type="text" placeholder='454, Sitio Uli-Ulit, Pinalagdan, Paombong, Bulacan'/>
                    <img className='address-edit' src={EditLogo} alt="" />
                </div>
                <div className="order-items-container">
                    <div className="washable-items-container">
                        <p className='section-title'>Select Washable Item</p>
                        <div className="select-items">
                            <div className="search-container">
                                <input className='select-search' type="text" placeholder='Search Washable Items.......'/>
                                <img className='select-search-logo' src={SearchLogo} alt=""  />
                            </div>
                            <div className="items-container">
                                <div className="washable-item">
                                    <img src={PantsLogo} alt="" />
                                    <p className='washable-item-name'>Pants (Regular)</p>
                                </div>
                                <div className="washable-item">
                                    <img src={PantsLogo} alt="" />
                                    <p className='washable-item-name'>Pants (Cotton)</p>
                                </div>
                                <div className="washable-item">
                                    <img src={ShirtLogo} alt="" />
                                    <p className='washable-item-name'>Shirt (Regular)</p>
                                </div>
                                <div className="washable-item">
                                    <img src={ShirtLogo} alt="" />
                                    <p className='washable-item-name'>Shirt (Cotton)</p>
                                </div>
                                <div className="washable-item">
                                    <img src={SkirtLogo} alt="" />
                                    <p className='washable-item-name'>Skirt (Regular)</p>
                                </div>
                                <div className="washable-item">
                                    <img src={SkirtLogo} alt="" />
                                    <p className='washable-item-name'>Skirt (Cotton)</p>
                                </div>
                                <div className="washable-item">
                                    <img src={DressLogo} alt="" />
                                    <p className='washable-item-name'>Dress (Regular)</p>
                                </div>
                                <div className="washable-item">
                                    <img src={DressLogo} alt="" />
                                    <p className='washable-item-name'>Dress (Cotton)</p>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

