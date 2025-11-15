import { child, get, push, ref, set, update } from 'firebase/database'
import { auth, db } from '../firebase'
import { newOrderTrack } from './create';
import { getServicesIncluded } from './get';
import { toast } from 'react-toastify';

export async function updateUser(email, name, phoneNum, address, imgUrl) {
    const currDate = new Date().toLocaleString();
    const usersRef = ref(db, 'users');
    const userRef = child(usersRef, auth.currentUser.uid);
    let userData = { 
      'updated_at': currDate,
      'updated_by': auth.currentUser.uid,
    }
    if(email)userData.email = email;
    if(name)userData.fullname = name;
    if(phoneNum)userData.phone = phoneNum;
    if(address)userData.address = address;
    if(imgUrl)userData.image_url = imgUrl;
    await update(userRef, userData)
    .then(()=>console.log("Updated")
    );
  }

export async function updateUserWithUid(userUid, email, name, phoneNum, address, imgUrl) {
    const currDate = new Date().toLocaleString();
    const usersRef = ref(db, 'users');
    const userRef = child(usersRef, userUid);
    let userData = { 
      'updated_at': currDate,
      'updated_by': auth.currentUser.uid,
    }
    if(email)userData.email = email;
    if(name)userData.fullname = name;
    if(phoneNum)userData.phone = phoneNum;
    if(address)userData.address = address;
    if(imgUrl)userData.image_url = imgUrl;
    await update(userRef, userData)
    .then(()=>console.log("Updated")
    );
  }

export async function updateWashableItem(washableItemUid, itemName, itemPerKilo) {
  const currDate = new Date().toLocaleString();
  const washableItemsRef = ref(db, 'washable_items');
  const washableItemRef = child(washableItemsRef, washableItemUid);
  let washableItemData = { 
    'updated_at': currDate,
    'updated_by': auth.currentUser.uid,
  }
  if(itemName)washableItemData.washable_item_name = itemName;
  if(itemPerKilo)washableItemData.item_per_kilo = itemPerKilo;
  await update(washableItemRef, washableItemData)
  .then(()=>console.log("Updated"));
}

export async function updateServiceType(serviceTypeUid, serviceName, services, price) {
  const currDate = new Date().toLocaleString();
  const serviceTypesRef = ref(db, 'service_types');
  const serviceTypeRef = child(serviceTypesRef, serviceTypeUid);
  let serviceTypeData = { 
    'updated_at': currDate,
    'updated_by': auth.currentUser.uid,
  }
  if(serviceName)serviceTypeData.service_name = serviceName;
  if(services)serviceTypeData.services = services;
  if(price)serviceTypeData.service_price = price; 
  await update(serviceTypeRef, serviceTypeData)
  .then(()=>console.log("Updated"));
}

export async function updateInventoryItem(inventoryItemUid, inventoryItemName, quantity, status, unitName, lastRestock) {
  const currDate = new Date().toLocaleString();
  const inventoryRef = ref(db, 'inventory_items');
  const inventoryItemRef = child(inventoryRef, inventoryItemUid);
  let inventoryItemData = { 
    'updated_at': currDate,
    'updated_by': auth.currentUser.uid,
  }
  if(inventoryItemName)inventoryItemData.inventory_item_name = inventoryItemName;
  if(quantity)inventoryItemData.quantity_in_stock = quantity;
  if(status)inventoryItemData.status = status; 
  if(unitName)inventoryItemData.unit_name = unitName; 
  if(lastRestock)inventoryItemData.last_restocked = lastRestock; 
  await update(inventoryItemRef, inventoryItemData)
  .then(()=>console.log("Updated"));
}

export async function updateInventoryItemStock(inventoryItemUid, quantity){
    const currDate = new Date().toLocaleString();
    const inventoryRef = ref(db, 'inventory_items');
    const inventoryItemRef = child(inventoryRef, inventoryItemUid);
    let inventoryItemData = { 
      'last_restocked': currDate,
      'restocked_by': auth.currentUser.uid,
    }
    if(quantity)inventoryItemData.quantity_in_stock = quantity;
    await update(inventoryItemRef, inventoryItemData)
    .then(()=>console.log("Updated"));

    localStorage.setItem("toastMessage", "Stock updated!");
    localStorage.setItem("toastType", "success");
    window.location.reload();
}

export async function updateOrderDetails(orderUid, customerName, address, serviceUid, serviceType, paymentMethod, amount, orderItems, status, modeOfTransfer, modeOfClaiming, orderDate, laundryTransferDateTime, arrivalDate, notes) {
  const currDate = new Date().toLocaleString();
  const ordersRef = ref(db, 'orders');
  const orderRef = child(ordersRef, orderUid);
  const pickupRef = child(orderRef, 'schedule/pickup');
  const notesRef = child(orderRef, 'notes');
  let orderData = { 
    'updated_at': currDate,
    'updated_by': auth.currentUser.uid,
  }
  if(customerName)orderData.customer_name = customerName;
  if(address)orderData.address = address;
  if(serviceUid)orderData.service_type_id = serviceUid;
  if(serviceType)orderData.service_name = serviceType;
  if(paymentMethod)orderData.payment_method = paymentMethod; 
  if(amount)orderData.amount = amount; 
  if(orderItems)orderData.order_items = orderItems; 
  if(status)orderData.status = status; 
  if(modeOfTransfer)orderData.mode_of_transfer = modeOfTransfer; 
  if(modeOfClaiming)orderData.mode_of_claiming = modeOfClaiming; 
  if(orderDate)orderData.created_at = orderDate; 
  
  if(arrivalDate)orderData.arrival_date = arrivalDate; 
  await update(orderRef, orderData)
  .then(()=>console.log("Updated"));
  if(laundryTransferDateTime){
    await update(pickupRef, {
      "scheduled_date": laundryTransferDateTime
    })
  }
  if(notes){
    await update(notesRef, {
      "order_notes": notes
    })
  }
}

export async function updateOrderStatus(orderUid, status) {
  const currDate = new Date().toLocaleString();
  const ordersRef = ref(db, 'orders');
  const orderRef = child(ordersRef, orderUid);
  let orderData = { 
    'updated_at': currDate,
    'updated_by': auth.currentUser.uid,
  }
  if(status)orderData.status = status; 
  await update(orderRef, orderData);
}

export async function cancelOrder(orderUid, status, reason) {
  const currDate = new Date().toLocaleString();
  const ordersRef = ref(db, 'orders');
  const orderRef = child(ordersRef, orderUid);
  let orderData = { 
    'updated_at': currDate,
    'updated_by': auth.currentUser.uid,
  }
  if(status) orderData.status = status; 
  const notesRef = child(orderRef, 'notes');

  await update(notesRef, {
    "cancel_reason": reason
  })

  await update(orderRef, orderData);
  await newOrderTrack(orderUid, status);
}


export async function updateScheduleDetails(orderUid, customerName, address, status, modeOfTransfer, modeOfClaiming, laundryTransferDateTime, laundryClaimDateTime) {
  const currDate = new Date().toLocaleString();
  const ordersRef = ref(db, 'orders');
  const orderRef = child(ordersRef, orderUid);
  const deliveryRef = child(orderRef, 'schedule/delivery');
  const pickupRef = child(orderRef, 'schedule/pickup');
  const orderData = { 
    'updated_at': currDate,
    'updated_by': auth.currentUser.uid,
  }
  if(customerName)orderData.customer_name = customerName;
  if(address)orderData.address = address;
  if(status)orderData.status = status; 
  if(modeOfClaiming == "Deliver"){
    orderData.mode_of_claiming = modeOfClaiming; 
    if(laundryClaimDateTime){
      await set(deliveryRef, {
        "scheduled_date": laundryClaimDateTime,
        "status": status,
        "created_at": currDate
      })
      .then(()=>console.log("Updated"));
    }
  }
  if(modeOfTransfer == "Pick-up"){
    orderData.mode_of_transfer = modeOfTransfer; 
    await set(pickupRef, {
      "scheduled_date": laundryTransferDateTime,
      "status": status,
      "created_at": currDate
    })
    .then(()=>console.log("Updated"));
  }
  await update(orderRef, orderData)
  .then(()=>console.log("Updated"));
}

export async function acceptOrder(orderUid) {
  const ordersRef = ref(db, 'orders');
  const orderRef = child(ordersRef, orderUid);
  await update(orderRef, {status: "In Progress"});
  localStorage.setItem("toastMessage", "Order accepted!");
  localStorage.setItem("toastType", "success");
  window.location.reload();
}

export async function rejectOrder(orderUid, cancelReason) {
  const ordersRef = ref(db, 'orders');
  const orderRef = child(ordersRef, orderUid);
  const notesRef = child(orderRef, 'notes');
  await update(orderRef, {status: "Rejected"});
  await update(notesRef, {"cancel_reason": cancelReason});
  localStorage.setItem("toastMessage", "Order rejected!");
  localStorage.setItem("toastType", "success");
  window.location.reload(); 
    

}
export async function quickUpdate(orderUid, serviceUid) {
    const ordersRef = ref(db, 'orders');
    const orderRef = child(ordersRef, orderUid);
    const trackingRef = child(orderRef, 'tracking');
    const services = await getServicesIncluded(serviceUid);
    if (!services || services.length === 0) return;
    const trackingSnap = await get(trackingRef);
    const tracking = trackingSnap.val();
    const now = new Date().toISOString(); 
    
    let currentStatus = null;
    if (tracking) {
        const trackingValues = Object.values(tracking);
        const lastEntry = trackingValues[trackingValues.length - 1];
        if (services.includes(lastEntry.status)) {
            currentStatus = lastEntry.status;
        }
    }
    if (currentStatus) {
        const currentIndex = services.indexOf(currentStatus);
        const nextIndex = currentIndex + 1;
        if (nextIndex < services.length) {
            const nextStatus = services[nextIndex];
            const trackingData = {
                "label": nextStatus,
                "status": nextStatus,
                "timestamp": now
            };
            await push(trackingRef, trackingData);
        } else {
            await update(orderRef, { status: 'Ready for Claim', timestamp: now });
        }
    } else {
        const initialStatus = services[0];
        const trackingData = {
            "label": initialStatus,
            "status": initialStatus,
            "timestamp": now
        };
        await push(trackingRef, trackingData);
    }
}