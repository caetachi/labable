import React, { useState, useEffect } from 'react'
import { User, Shield, Mail, Phone, MapPin, Edit2, Calendar, Package } from 'lucide-react'
import { onAuthStateChanged } from "firebase/auth"
import { get, ref, update } from "firebase/database"
import { auth, db } from "../../firebase"
import './profile.css'
function Profile() {

  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(true);
  const [completedOrdersCount, setCompletedOrdersCount] = useState(0);
  const [isEditing, setIsEditing] = useState({
    fullname: false,
    phone: false,
    address: false
  });
  const [errors, setErrors] = useState({
    fullname: '',
    phone: '',
    address: ''
  });
 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setLoading(true);
        
        get(ref(db, `users/${currentUser.uid}`)).then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            setUserData(data);
            setOriginalData(data);
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

  const validateFullName = (name) => {
    if (!name || !name.trim()) {
      return 'Full name is required';
    }
    if (name.trim().length < 5) {
      return 'Full name must be at least 4 characters';
    }
    if (/\d/.test(name)) {
      return 'Full name cannot contain numbers';
    }
    return '';
  }

  const handleInputChange = (field, value) => {
    setUserData(prev => ({ ...prev, [field]: value }))
    
    if (field === 'fullname') {
      const error = validateFullName(value);
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
    return originalData.fullname !== userData.fullname ||
           originalData.phone !== userData.phone ||
           originalData.address !== userData.address;
  }

  const hasErrors = () => {
    return !!errors.fullname || 
           !!errors.phone || 
           !!errors.address ||
           !userData.fullname?.trim() || 
           !userData.phone?.trim() || 
           !userData.address?.trim();
  }

  const getInitials = (fullname) => {
    if (!fullname) return 'NA';
    const names = fullname.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  const handleSaveChanges = async () => {
    if (!user) return;
    
    const fullnameError = validateFullName(userData.fullname);
    const newErrors = {
      fullname: fullnameError,
      phone: !userData.phone?.trim() ? 'Phone number is required' : '',
      address: !userData.address?.trim() ? 'Delivery address is required' : ''
    };
    
    setErrors(newErrors);
    
    if (Object.values(newErrors).some(error => error)) {
      alert('Please fix all errors before saving');
      return;
    }
    
    try {
      const userRef = ref(db, `users/${user.uid}`);
      await update(userRef, {
        fullname: userData.fullname,
        phone: userData.phone,
        address: userData.address
      });
      
      setOriginalData({
        ...originalData,
        fullname: userData.fullname,
        phone: userData.phone,
        address: userData.address
      });
      
      setIsEditing({
        fullname: false,
        phone: false,
        address: false
      });
      
      alert('Changes saved successfully!');
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Failed to save changes. Please try again.');
    }
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
                        <div className="avatar">{getInitials(originalData.fullname)}</div>
                        <div className="profile-details">
                          <h2 className="profile-name">{originalData.fullname || 'No name set'}</h2>
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
                      <h5 className="form-h5">Full Name</h5>
                      <div className="input-wrapper">
                        <User className="gray" />
                        <input
                          type="text"
                          value={userData.fullname || ''}
                          onChange={(e) => handleInputChange('fullname', e.target.value)}
                          disabled={!isEditing.fullname}
                          className="input-field"
                          placeholder="Enter your full name"
                        />
                        <button 
                          className="edit-button"
                          onClick={() => toggleEdit('fullname')}
                        >
                          <Edit2 size={18} />
                        </button>
                      </div>
                      {errors.fullname && (
                        <p className="error-message">{errors.fullname}</p>
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
                  <a href="#" className="reset-link">Reset Link</a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  ) 
}

export default Profile