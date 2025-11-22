import { useState, useEffect } from 'react'
import { User, Shield, Mail, Phone, MapPin, Edit2, Calendar, Package } from 'lucide-react'
import { onAuthStateChanged, sendPasswordResetEmail } from "firebase/auth"
import { get, ref } from "firebase/database"
import { auth, db } from "../../firebase"
import './profile.css'
import { toast } from 'react-toastify'
import { formatTextualDateTime } from '../../scripts/dateformat'
import { updateUser } from '../../scripts/update'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});


export default function Profile() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(true);
  const [completedOrdersCount, setCompletedOrdersCount] = useState(0);
  const [isEditing, setIsEditing] = useState({
    firstname: false,
    lastname: false,
    phone: false,
    address: false
  });
  const [errors, setErrors] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    address: ''
  });
  const [email, setEmail] = useState('');
 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setLoading(true);
        
        get(ref(db, `users/${currentUser.uid}`)).then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            
            let firstname = data.firstname || '';
            let lastname = data.lastname || '';
            
            if (data.fullname && !data.firstname && !data.lastname) {
              const nameParts = data.fullname.trim().split(' ');
              firstname = nameParts[0] || '';
              lastname = nameParts.slice(1).join(' ') || '';
            }
            
            const processedData = {
              ...data,
              firstname,
              lastname
            };
            
            setUserData(processedData);
            setOriginalData(processedData);
            setEmail(data.email || '');
          }
        }).catch((error) => {
          console.error('Error fetching user data:', error);
        });

        get(ref(db, 'orders')).then((snapshot) => {
          if (snapshot.exists()) {
            const orders = snapshot.val();
            const completedCount = Object.values(orders).filter(
              order => order.userId === currentUser.uid && order.status === 'Completed'
            ).length;
            setCompletedOrdersCount(completedCount);
          } else {
            setCompletedOrdersCount(0);
          }
          setLoading(false);
        }).catch((error) => {
          console.error('Error fetching orders:', error);
          setCompletedOrdersCount(0);
          setLoading(false);
        });
      } else {
        setUserData({});
        setOriginalData({});
        setCompletedOrdersCount(0);
        setLoading(false);
      }
    });
    
    return () => unsubscribe();
  }, []);
 
  const [activeTab, setActiveTab] = useState('profile');

  const validateName = (name, fieldLabel) => {
    if (!name || !name.trim()) {
      return `${fieldLabel} is required`;
    }
    if (name.trim().length < 2) {
      return `${fieldLabel} must be at least 2 characters`;
    }
    if (/\d/.test(name)) {
      return `${fieldLabel} cannot contain numbers`;
    }
    if (!/^[a-zA-Z\s'-]+$/.test(name)) {
      return `${fieldLabel} cannot contain special characters`;
    }
    return '';
  }

  const handleInputChange = (field, value) => {
    setUserData(prev => ({ ...prev, [field]: value }))
    
    if (field === 'firstname') {
      const error = validateName(value, 'First name');
      setErrors(prev => ({ ...prev, [field]: error }))
    } else if (field === 'lastname') {
      const error = validateName(value, 'Last name');
      setErrors(prev => ({ ...prev, [field]: error }))
    } else {
      if (value.trim()) {
        setErrors(prev => ({ ...prev, [field]: '' }))
      } else {
        setErrors(prev => ({ ...prev, [field]: `${field.charAt(0).toUpperCase() + field.slice(1)} is required` }))
      }
    }
  }

  const toggleEdit = (field) => {
    setIsEditing(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const hasChanges = () => {
    return originalData.firstname !== userData.firstname ||
           originalData.lastname !== userData.lastname ||
           originalData.phone !== userData.phone ||
           originalData.address !== userData.address;
  }

  const hasErrors = () => {
    return !!errors.firstname || 
           !!errors.lastname ||
           !!errors.phone || 
           !!errors.address ||
           !userData.firstname?.trim() ||
           !userData.lastname?.trim() ||
           !userData.phone?.trim() || 
           !userData.address?.trim();
  }

  const getInitials = (firstname, lastname) => {
    if (!firstname && !lastname) return 'NA';
    const first = firstname?.charAt(0)?.toUpperCase() || '';
    const last = lastname?.charAt(0)?.toUpperCase() || '';
    return first + last || first || 'NA';
  }

  const getFullName = (firstname, lastname) => {
    return `${firstname || ''} ${lastname || ''}`.trim() || 'No name set';
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return formatTextualDateTime(date);
  }

  const handleSaveChanges = async () => {
    if (!user) return;
    
    const firstnameError = validateName(userData.firstname, 'First name');
    const lastnameError = validateName(userData.lastname, 'Last name');
    const newErrors = {
      firstname: firstnameError,
      lastname: lastnameError,
      phone: !userData.phone?.trim() ? 'Phone number is required' : '',
      address: !userData.address?.trim() ? 'Delivery address is required' : ''
    };
    
    setErrors(newErrors);
    
    if (Object.values(newErrors).some(error => error)) {
      toast.error('Please fix all errors before saving');
      return;
    }
    
    try {
      const fullname = `${userData.firstname} ${userData.lastname}`.trim();
      
      await updateUser(originalData.email, fullname, userData.phone, userData.address, null);
      
      setOriginalData({
        ...originalData,
        email: userData.email || originalData.email,
        firstname: userData.firstname || originalData.firstname,
        lastname: userData.lastname || originalData.lastname,
        phone: userData.phone || originalData.phone,
        address: userData.address || originalData.address
      });
      
      setIsEditing({
        firstname: false,
        lastname: false,
        phone: false,
        address: false
      });
      
      toast.success('Profile updated successfully.');
      window.location.reload();
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error('Failed to save changes. Please try again.');
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await sendPasswordResetEmail(auth, email);
      
      toast.success('A password reset link has been sent.');
      
    } catch (err) {
      console.error(err);
      toast.error('A password reset link could not be sent.');
    }
  }
  const [showMap, setShowMap] = useState(false);
  function LocationPicker({ onLocationSelect }) {
  const [position, setPosition] = useState(null);
  
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
      
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        .then(response => response.json())
        .then(data => {
          if (data && data.display_name) {
            onLocationSelect(data.display_name);
          }
        })
        .catch(err => console.error("Error fetching address:", err));
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="sidebar">
        <h2 className="sidebar-title">Settings</h2>
        <nav className="sidebar-nav">
          <button
            onClick={() => setActiveTab('profile')}
            className={activeTab === 'profile' ? 'nav-button active' : 'nav-button inactive'}
          >
            <User size={20} />
            <span>Profile</span>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={activeTab === 'security' ? 'nav-button active' : 'nav-button inactive'}
          >
            <Shield size={20} />
            <span>Security</span>
          </button>
        </nav>
      </div>
      
      <div className="main-content">
        <div className="content-wrapper">
          <div className="header">
            <div>
              <h1 className="header-title">{activeTab === 'profile' ? 'My Profile' : 'My Security'}</h1>
              <p className="header-subtitle">Manage your {activeTab === 'profile' ? 'profile' : 'security'} information</p>
            </div>
            {activeTab === 'profile' && (
              <button 
                className={`save-button ${(!hasChanges() || hasErrors()) ? 'disabled' : ''}`}
                disabled={!hasChanges() || hasErrors()}
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
            )}
          </div>

          {activeTab === 'profile' && (
            <>
              {loading ? (
                <div className="card">
                  <div className="flex items-center justify-center py-12">
                    <div className="text-gray-500">Loading profile...</div>
                  </div>
                </div>
              ) : !user ? (
                <div className="card">
                  <div className="flex items-center justify-center py-12">
                    <div className="text-gray-500">Please log in to view your profile</div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="card">
                    <div className="profile-header">
                      <div className="profile-info">
                        <div className="avatar">
                          {originalData?.image_url ? 
                          <img src={originalData.image_url} alt="Profile" /> 
                          : getInitials(originalData.firstname, originalData.lastname)}
                          </div>
                        <div className="profile-details">
                          <h2 className="profile-name">{getFullName(originalData.firstname, originalData.lastname)}</h2>
                          <p className="profile-email">{originalData.email || 'No email'}</p>
                          <div className="profile-meta">
                            <Calendar size={14} />
                            <span>Member since: {formatDate(originalData.created_at)}</span>
                            <div className="separator">•</div>
                            <Package size={14} />
                            <span>{completedOrdersCount} {completedOrdersCount === 1 ? 'order' : 'orders'} placed</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="section-header">
                      <User size={20} />
                      <div>
                        <h3 className="section-title">Personal Information</h3>
                        <p className="section-subtitle">Manage your information</p>
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <h5 className="form-h5">Email Address</h5>
                      <div className="input-wrapper">
                        <Mail className="gray" />
                        <input
                          type="email"
                          value={userData.email || ''}
                          disabled
                          className="input-field"
                          placeholder="No email address"
                        />
                      </div>
                      <p className="input-note">Note: Your email address cannot be changed</p>
                    </div>

                    <div className="form-group">
                      <h5 className="form-h5">First Name</h5>
                      <div className="input-wrapper">
                        <User className="gray" />
                        <input
                          type="text"
                          value={userData.firstname || ''}
                          onChange={(e) => handleInputChange('firstname', e.target.value)}
                          disabled={!isEditing.firstname}
                          className="input-field"
                          placeholder="Enter your first name"
                        />
                        <button 
                          className="edit-button"
                          onClick={() => toggleEdit('firstname')}
                        >
                          <Edit2 size={18} />
                        </button>
                      </div>
                      {errors.firstname && (
                        <p className="error-message">{errors.firstname}</p>
                      )}
                    </div>

                    <div className="form-group">
                      <h5 className="form-h5">Last Name</h5>
                      <div className="input-wrapper">
                        <User className="gray" />
                        <input
                          type="text"
                          value={userData.lastname || ''}
                          onChange={(e) => handleInputChange('lastname', e.target.value)}
                          disabled={!isEditing.lastname}
                          className="input-field"
                          placeholder="Enter your last name"
                        />
                        <button 
                          className="edit-button"
                          onClick={() => toggleEdit('lastname')}
                        >
                          <Edit2 size={18} />
                        </button>
                      </div>
                      {errors.lastname && (
                        <p className="error-message">{errors.lastname}</p>
                      )}
                    </div>

                    <div className="form-group">
                      <h5 className="form-h5">Phone Number</h5>
                      <div className="input-wrapper">
                        <Phone className="gray" />
                        <input
                          type="number"
                          value={userData.phone || ''}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          disabled={!isEditing.phone}
                          className="input-field"
                          placeholder="Enter your phone number"
                        />
                        <button 
                          className="edit-button"
                          onClick={() => toggleEdit('phone')}
                        >
                          <Edit2 size={18} />
                        </button>
                      </div>
                      {errors.phone && (
                        <p className="error-message">{errors.phone}</p>
                      )}
                    </div>

<div className="form-group">
                      <h5 className="form-h5">Default Delivery Address</h5>
                      <div className="input-wrapper">
                        <MapPin className="gray" />
                        <input
                          type="text"
                          value={userData.address || ''}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          disabled={!isEditing.address}
                          className="input-field"
                          placeholder="Enter your delivery address"
                        />
                        <button 
                          className="edit-button"
                          onClick={() => toggleEdit('address')}
                        >
                          <Edit2 size={18} />
                        </button>
                      </div>
                      

                      {isEditing.address && (
                        <button 
                          type="button"
                          onClick={() => setShowMap(!showMap)}
                          className="map-button"
                        >
                          <MapPin size={14} />
                          {showMap ? 'Close Map' : 'Pin location on map'}
                        </button>
                      )}


                      {showMap && isEditing.address && (
                        <div className="map-container" >
                          <MapContainer 
                            center={[14.5995, 120.9842]} 
                            zoom={13} 
                            style={{ height: '100%', width: '100%' }}
                          >
                            <TileLayer
                              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <LocationPicker 
                              onLocationSelect={(address) => {
                                handleInputChange('address', address);
                             
                              }} 
                            />
                          </MapContainer>
                          <p>
                            Click anywhere on the map to set your address automatically.
                          </p>
                        </div>
                      )}

                      {errors.address && (
                        <p className="error-message">{errors.address}</p>
                      )}
                      <p className="input-note">Note: This address will be used for order pickups and deliveries</p>
                    </div>                  
                    </div>
                </>
              )}
            </>
          )}

          {activeTab === 'security' && (
            <div className="card">
              <div className="security-content">
                <div className="security-icon-box">
                  <Shield size={32} color="#374151" />
                </div>
                <div className="security-info">
                  <h4 className="security-title">Password Reset</h4>
                  <p className="security-description">This section will provide you a link for your to reset your own password using your existing email address on your profile</p>
                  <button onClick={handleSubmit} className='reset-link'>Send Reset Link</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div> 
    </div>
  );
}