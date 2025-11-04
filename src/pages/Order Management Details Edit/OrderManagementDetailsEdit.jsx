import './order-management-details-edit.css'
import labableLogo from '../../assets/labable-black.svg'
import SearchLogo from '../../assets/search.svg'
import PantsLogo from '../../assets/pants.svg'
import BigPantsLogo from '../../assets/pants-big.svg'
import ShirtLogo from '../../assets/shirt.svg'
import SkirtLogo from '../../assets/skirt.svg'
import DressLogo from '../../assets/dress.svg'

export default function OrderManagementDetailsEdit(){
    return (
        <div className="order-management-details-edit-container">
            <div className="logo">
                <img src={labableLogo} alt="Labable" className='logo'/>
                <h1><span>Laba</span><span className='highlight-tag'>ble</span></h1>
            </div>
            <div className="order-details-edit-container gray-border">
                <div className="order-details-title-container">
                    <p className='order-details-title'>Order Details</p>
                    <p className='subtext'>Update Order Details</p>
                </div>
                <div className="customer small-container">
                    <p className='small-container-title'>Customer</p>
                    <div className="small-container-input-container">
                        <i className='ti ti-user input-icon left-icon'></i>
                        <input className='small-container-input gray-border' type="text" placeholder='Jerson Patrick Valdez'/>
                        <i className='ti ti-search input-icon right-icon'></i>
                    </div>
                </div>
                <div className="customer small-container">
                    <p className='small-container-title'>Address</p>
                    <div className="small-container-input-container">
                        <i className='ti ti-map-pin input-icon left-icon'></i>
                        <input className='small-container-input gray-border' type="text" placeholder='Sitio Uli, uli, Pinalagdan, paombong Bulacan'/>
                        <i className='ti ti-map-2 input-icon right-icon'></i>
                    </div>
                </div>
                <div className="customer small-container">
                    <p className='small-container-title'>Service Type</p>
                    <div className="small-container-input-container">
                        {/* <span className="iconify input-icon left-icon" data-icon="material-symbols:laundry-outline"></span> */}
                        <i class="ti ti-wash-machine input-icon left-icon"></i>
                        <input className='small-container-input gray-border' type="text" placeholder='Wash and Fold'/>
                        {/* <i className='ti ti-map-2 input-icon right-icon'></i> */}
                        <i class="hgi hgi-stroke hgi-arrow-down-01 input-icon right-icon"></i>
                    </div>
                </div>
                <div className="customer small-container">
                    <p className='small-container-title'>Payment Method</p>
                    <div className="small-container-input-container">
                        
                        <i class="hgi hgi-stroke hgi-money-01 input-icon left-icon"></i>
                        <input className='small-container-input gray-border' type="text" placeholder='Cash'/>
                        {/* <i className='ti ti-map-2 input-icon right-icon'></i> */}
                        <i class="hgi hgi-stroke hgi-arrow-down-01 input-icon right-icon"></i>
                    </div>
                </div>
                <div className="customer small-container">
                    <p className='small-container-title'>Amount</p>
                    <div className="small-container-input-container">

                        <i class="hgi hgi-stroke hgi-money-01 input-icon left-icon"></i>
                        <input className='small-container-input gray-border' type="text" placeholder='289.00'/>
                        {/* <i className='ti ti-map-2 input-icon right-icon'></i> */}
                        <i class="hgi hgi-stroke hgi-arrow-down-01 input-icon right-icon"></i>
                    </div>
                </div>
                <div className="order-items-container">
                    <div className="washable-items-container gray-border">
                        <p className='section-title washable-items-title'>Select Washable Item</p>
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
                <div className="customer small-container">
                    <p className='small-container-title'>Status</p>
                    <div className="small-container-input-container">
                        <i class="ti ti-circle-check input-icon left-icon"></i>
                        <span class="material-symbols--laundry-outline input-icon left-icon"></span>
                        <input className='small-container-input gray-border' type="text" placeholder='Washing'/>
                        {/* <i className='ti ti-map-2 input-icon right-icon'></i> */}
                        <i class="hgi hgi-stroke hgi-arrow-down-01 input-icon right-icon"></i>
                    </div>
                </div>
                <div className="customer small-container">
                    <p className='small-container-title'>Mode of Transfer</p>
                    <div className="small-container-input-container">
                        <i class="hgi hgi-stroke hgi-shipping-truck-01 input-icon left-icon"></i>
                        <input className='small-container-input gray-border' type="text" placeholder='Pick-up'/>
                        {/* <i className='ti ti-map-2 input-icon right-icon'></i> */}
                        <i class="hgi hgi-stroke hgi-arrow-down-01 input-icon right-icon"></i>
                    </div>
                </div>
                <div className="customer small-container">
                    <p className='small-container-title'>Mode of Claiming</p>
                    <div className="small-container-input-container">
                        <i class="hgi hgi-stroke hgi-shipping-truck-01 input-icon left-icon"></i>
                        <input className='small-container-input gray-border' type="text" placeholder='Drop-off'/>
                        {/* <i className='ti ti-map-2 input-icon right-icon'></i> */}
                        <i class="hgi hgi-stroke hgi-arrow-down-01 input-icon right-icon"></i>
                    </div>
                </div>
                <div className="customer small-container">
                    <p className='small-container-title'>Order Date</p>
                    <div className="small-container-input-container">
                        <i class="hgi hgi-stroke hgi-money-01 input-icon left-icon"></i>
                        <input className='small-container-input gray-border' type="text" placeholder='10/24/25'/>
                        {/* <i className='ti ti-map-2 input-icon right-icon'></i> */}
                        <i class="ti ti-calendar-week input-icon right-icon"></i>
                    </div>
                </div>
                <div className="customer small-container">
                    <p className='small-container-title'>Laundry Transfer Date</p>
                    <div className="small-container-input-container">
                        <i class="hgi hgi-stroke hgi-money-01 input-icon left-icon"></i>
                        <input className='small-container-input gray-border' type="text" placeholder='10/26/25'/>
                        {/* <i className='ti ti-map-2 input-icon right-icon'></i> */}
                        <i class="ti ti-calendar-week input-icon right-icon"></i>
                    </div>
                </div>
                <div className="customer small-container">
                    <p className='small-container-title'>Laundry Transfer Date Time</p>
                    <div className="small-container-input-container">
                        
                        <i class="hgi hgi-stroke hgi-money-01 input-icon left-icon"></i>
                        <input className='small-container-input gray-border' type="text" placeholder='7:00 AM'/>
                        {/* <i className='ti ti-map-2 input-icon right-icon'></i> */}
                        <i class="ti ti-clock input-icon right-icon"></i>
                    </div>
                </div>
                <div className="customer small-container">
                    <p className='small-container-title'>Arrival Date</p>
                    <div className="small-container-input-container">
                        
                        <i class="hgi hgi-stroke hgi-money-01 input-icon left-icon"></i>
                        <input className='small-container-input gray-border' type="text" placeholder='10/26/25'/>
                        {/* <i className='ti ti-map-2 input-icon right-icon'></i> */}
                        <i class="ti ti-calendar-week input-icon right-icon"></i>
                    </div>
                </div>
                <div className="customer small-container">
                    <p className='small-container-title'>Notes</p>
                    <div className="small-container-input-container">
                        
                        <i class="hgi hgi-stroke hgi-money-01 input-icon left-icon"></i>
                        <input className='small-container-input gray-border' type="text" placeholder='Please clean it all'/>
                        {/* <i className='ti ti-map-2 input-icon right-icon'></i> */}
                    </div>
                </div>
            </div>
        </div>
    )
}