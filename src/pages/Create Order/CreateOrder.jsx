import './create-order.css'
import LocationLogo from '../../assets/location.svg'
import EditLogo from '../../assets/edit.svg'
import SearchLogo from '../../assets/search.svg'
import PantsLogo from '../../assets/pants.svg'
import BigPantsLogo from '../../assets/pants-big.svg'
import ShirtLogo from '../../assets/shirt.svg'
import SkirtLogo from '../../assets/skirt.svg'
import DressLogo from '../../assets/dress.svg'
export default function CreateOrder() {
    return(
        <div className='create-order-container'>
            <div className="title-container">
                <p className='create-order-title'>Create Your Order</p>
                <p className='create-order-subtitle'>Fill in the details below to schedule your laundry service</p>
            </div>
            <div className="draft-container gray-border">
                <p className='drafts-title'>Drafts</p>
                <div className="drafts-container gray-border">
                    <div className="draft">
                        <p className="draft-title">Title</p>
                        <p className="subtext">Description</p>
                    </div>
                    <div className="draft">
                        <p className="draft-title">Title</p>
                        <p className="subtext">Description</p>
                    </div>
                    <div className="draft">
                        <p className="draft-title">Title</p>
                        <p className="subtext">Description</p>
                    </div>
                </div>
            </div>
            <div className="order-details-container gray-border">
                <p className="order-details-title">Order Details</p>
                <div className="address-container">
                    <img src={LocationLogo} alt="" />
                    <p className='section-title'>Address</p>
                </div>
                <div className="address-input-container">
                    <input className='address-input gray-border' type="text" placeholder='454, Sitio Uli-Ulit, Pinalagdan, Paombong, Bulacan'/>
                    <img className='address-edit' src={EditLogo} alt="" />
                </div>
                <div className="order-items-container">
                    <div className="washable-items-container gray-border">
                        <p className='section-title'>Select Washable Item</p>
                        <div className="select-items">
                            <div className="search-container">
                                <input className='select-search gray-border' type="text" placeholder='Search Washable Items.......'/>
                                <img className='select-search-logo' src={SearchLogo} alt=""  />
                            </div>
                            <div className="items-container">
                                <div className="washable-item gray-border">
                                    <img src={PantsLogo} alt="" />
                                    <p className='washable-item-name'>Pants (Regular)</p>
                                </div>
                                <div className="washable-item gray-border">
                                    <img src={PantsLogo} alt="" />
                                    <p className='washable-item-name'>Pants (Cotton)</p>
                                </div>
                                <div className="washable-item gray-border">
                                    <img src={ShirtLogo} alt="" />
                                    <p className='washable-item-name'>Shirt (Regular)</p>
                                </div>
                                <div className="washable-item gray-border">
                                    <img src={ShirtLogo} alt="" />
                                    <p className='washable-item-name'>Shirt (Cotton)</p>
                                </div>
                                <div className="washable-item gray-border">
                                    <img src={SkirtLogo} alt="" />
                                    <p className='washable-item-name'>Skirt (Regular)</p>
                                </div>
                                <div className="washable-item gray-border">
                                    <img src={SkirtLogo} alt="" />
                                    <p className='washable-item-name'>Skirt (Cotton)</p>
                                </div>
                                <div className="washable-item gray-border">
                                    <img src={DressLogo} alt="" />
                                    <p className='washable-item-name'>Dress (Regular)</p>
                                </div>
                                <div className="washable-item gray-border">
                                    <img src={DressLogo} alt="" />
                                    <p className='washable-item-name'>Dress (Cotton)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="orders-list-container gray-border">
                        <p className='section-title'>Your Order</p>
                        <div className="orders-list-headers-container">
                            <p className='subtext'>Item</p>
                            <p className='subtext'>Quantity</p>
                            <p className='subtext'>Action</p>
                        </div>
                        <div className="order-card gray-border">
                            <div className="order-logo-name-container">
                                <img className='order-item-logo' src={BigPantsLogo} alt="" />
                                <p className='order-item-name'>Pants (Regular)</p>
                            </div>
                            <div className="order-quantity-container">
                                <p className='quantity-operation'>+</p>
                                <p className='quantity-number'>3</p>
                                <p className='quantity-operation'>-</p>
                            </div>
                            <div className="delete-container">
                                <button className="delete-button section-title">Delete</button>
                            </div>
                        </div>
                        <div className="order-card gray-border">
                            <div className="order-logo-name-container">
                                <img className='order-item-logo' src={BigPantsLogo} alt="" />
                                <p className='order-item-name'>Pants (Cotton)</p>
                            </div>
                            <div className="order-quantity-container">
                                <p className='quantity-operation'>+</p>
                                <p className='quantity-number'>3</p>
                                <p className='quantity-operation'>-</p>
                            </div>
                            <div className="delete-container">
                                <button className="delete-button section-title">Delete</button>
                            </div>
                        </div>
                        <div className="order-card gray-border">
                            <div className="order-logo-name-container">
                                <img className='order-item-logo' src={BigPantsLogo} alt="" />
                                <p className='order-item-name'>Skirt (Regular)</p>
                            </div>
                            <div className="order-quantity-container">
                                <p className='quantity-operation'>+</p>
                                <p className='quantity-number'>3</p>
                                <p className='quantity-operation'>-</p>
                            </div>
                            <div className="delete-container">
                                <button className="delete-button section-title">Delete</button>
                            </div>
                        </div>
                        <div className="order-card gray-border">
                            <div className="order-logo-name-container">
                                <img className='order-item-logo' src={BigPantsLogo} alt="" />
                                <p className='order-item-name'>Skirt (Cotton)</p>
                            </div>
                            <div className="order-quantity-container">
                                <p className='quantity-operation'>+</p>
                                <p className='quantity-number'>3</p>
                                <p className='quantity-operation'>-</p>
                            </div>
                            <div className="delete-container">
                                <button className="delete-button section-title">Delete</button>
                            </div>
                        </div>
                        <div className="order-card gray-border">
                            <div className="order-logo-name-container">
                                <img className='order-item-logo' src={BigPantsLogo} alt="" />
                                <p className='order-item-name'>Dress (Regular)</p>
                            </div>
                            <div className="order-quantity-container">
                                <p className='quantity-operation'>+</p>
                                <p className='quantity-number'>3</p>
                                <p className='quantity-operation'>-</p>
                            </div>
                            <div className="delete-container">
                                <button className="delete-button section-title">Delete</button>
                            </div>
                        </div>
                        <div className="order-card gray-border">
                            <div className="order-logo-name-container">
                                <img className='order-item-logo' src={BigPantsLogo} alt="" />
                                <p className='order-item-name'>Dress (Cotton)</p>
                            </div>
                            <div className="order-quantity-container">
                                <p className='quantity-operation'>+</p>
                                <p className='quantity-number'>3</p>
                                <p className='quantity-operation'>-</p>
                            </div>
                            <div className="delete-container">
                                <button className="delete-button section-title">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

