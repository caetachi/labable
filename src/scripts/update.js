import { child, get, ref, set, update } from 'firebase/database'

import { auth, db } from '../firebase'
import { newOrderTrack, newUserNotification, statusMap } from './create';

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
  const trackingRef = child(orderRef, 'tracking');
  const pickupRef = child(orderRef, 'schedule/pickup');
  const notesRef = child(orderRef, 'notes');

  const existingSnap = await get(orderRef);
  const existingOrder = existingSnap.val() || {};
  const previousStatus = existingOrder.status;

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
  if (status && previousStatus !== status) {

    
    if (status === "Error") {
      await newOrderTrack(orderUid, "Error");
    } else {
      if ((previousStatus === "Rejected" || previousStatus === "Canceled") && (status !== "Rejected" && status !== "Canceled")) {
        await set(notesRef, { "notes": null });
      }

      const roadmap = Object.keys(statusMap);
      const targetIndex = roadmap.indexOf(status);

      if (targetIndex !== -1) {
        await set(trackingRef, null);

        let lastStatus = null;

        const decisionStatuses = ["Accepted", "Canceled", "Rejected"];
        const isDecisionTarget = decisionStatuses.includes(status);

        for (let i = 0; i <= targetIndex; i++) {
          const stepStatus = roadmap[i];

          if (isDecisionTarget) {
            if (stepStatus !== "Pending" && stepStatus !== status) continue;
          }

          if (stepStatus === lastStatus) continue;

          await newOrderTrack(orderUid, stepStatus);
          lastStatus = stepStatus;
        }
      }
    }
  }

  await update(orderRef, orderData)
  .then(()=>console.log("Updated"));
  if(laundryTransferDateTime){
    await update(pickupRef, {
      "scheduled_date": laundryTransferDateTime
    })
  }
  if(notes){
    await update(notesRef, {
      "notes": notes
    })
  }
}

export async function updateOrderStatus(userUid, orderUid, status) {
  const currDate = new Date().toLocaleString();
  const ordersRef = ref(db, 'orders');
  const orderRef = child(ordersRef, orderUid);
  let orderData = { 
    'updated_at': currDate,
    'updated_by': auth.currentUser.uid,
  }
  if(status)orderData.status = status; 
  await update(orderRef, orderData);
  await newUserNotification(userUid, "Order Status Update", `Your order status has been updated to ${status}`);
}

export async function cancelOrder(userUid, orderUid, status, reason) {
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
  await newUserNotification(userUid, "Order Canceled", `Your order has been canceled. Reason: ${reason}`);
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

export async function acceptOrder(userUid, orderUid) {
  await updateOrderStatus(userUid, orderUid, "Accepted");
  await newOrderTrack(orderUid, "Accepted");
  await newUserNotification(userUid, "Order Accepted", "Your order has been accepted!");
  localStorage.setItem("toastMessage", "Order accepted!");
  localStorage.setItem("toastType", "success");
}

export async function rejectOrder(userUid, orderUid, cancelReason) {
  await updateOrderStatus(userUid, orderUid, "Rejected");
  const ordersRef = ref(db, 'orders');
  const orderRef = child(ordersRef, orderUid);
  const notesRef = child(orderRef, 'notes');
  await update(notesRef, {"cancel_reason": cancelReason});
  await newOrderTrack(orderUid, "Rejected");
  await newUserNotification(userUid, "Order Rejected", `Your order has been rejected. Reason: ${cancelReason}`);
  localStorage.setItem("toastMessage", "Order rejected!");
  localStorage.setItem("toastType", "success");
}

export async function quickUpdate(userUid, orderUid) {
  const ordersRef = ref(db, 'orders');
  const orderRef = child(ordersRef, orderUid);
  const trackingRef = child(orderRef, 'tracking');

  const roadmap = Object.keys(statusMap);
  const acceptedIndex = roadmap.indexOf('Accepted');
  const ofdIndex = roadmap.indexOf('Out for Delivery');

  if (acceptedIndex === -1 || ofdIndex === -1 || ofdIndex <= acceptedIndex) return;

  const orderSnap = await get(orderRef);
  const order = orderSnap.val() || {};
  const currentStatus = order.status;

  const segment = roadmap.slice(acceptedIndex, ofdIndex + 1);
  const currentIndex = segment.indexOf(currentStatus);

  if (currentIndex === -1 || currentStatus === 'Out for Delivery') {
    return;
  }

  const nextStatus = segment[currentIndex + 1];
  if (!nextStatus) return;

  const trackingSnap = await get(trackingRef);
  const tracking = trackingSnap.val();
  const trackingValues = tracking ? Object.values(tracking) : [];
  const lastEntry = trackingValues[trackingValues.length - 1] || {};
  const lastStatus = lastEntry.status;

  if (lastStatus !== nextStatus) {
    await newOrderTrack(orderUid, nextStatus);
  }

  const now = new Date().toLocaleString();
  const orderUpdate = { status: nextStatus, updated_at: now, updated_by: auth.currentUser.uid };

  await update(orderRef, orderUpdate);
  await newUserNotification(userUid, "Order Updated", `Your order has been updated to ${nextStatus}`);
}

export async function deliveredOrder(userUid, orderUid) {
  const ordersRef = ref(db, 'orders');
  const orderRef = child(ordersRef, orderUid);
  const trackingRef = child(orderRef, 'tracking');

  const roadmap = Object.keys(statusMap);
  const deliveredIndex = roadmap.indexOf('Delivered');
  if (deliveredIndex === -1) return;

  const orderSnap = await get(orderRef);
  const order = orderSnap.val() || {};
  const currentStatus = order.status;

  let startIndex = 0;
  if (currentStatus) {
    const currentIndex = roadmap.indexOf(currentStatus);
    if (currentIndex !== -1) {
      startIndex = currentIndex + 1;
    }
  }

  if (startIndex > deliveredIndex) {
    startIndex = deliveredIndex;
  }

  const trackingSnap = await get(trackingRef);
  const tracking = trackingSnap.val();
  let lastStatus = tracking
    ? (Object.values(tracking)[Object.values(tracking).length - 1] || {}).status
    : null;

  for (let i = startIndex; i <= deliveredIndex; i++) {
    const stepStatus = roadmap[i];
    if (stepStatus === lastStatus) continue;
    await newOrderTrack(orderUid, stepStatus);
    lastStatus = stepStatus;
  }

  const now = new Date().toLocaleString();

  await update(orderRef, {
    status: 'Delivered',
    updated_at: now,
    updated_by: auth.currentUser.uid,
  });

  await newUserNotification(
    userUid,
    'Order Updated',
    'You have received your laundry. Please confirm the order.'
  );

  localStorage.setItem('toastMessage', 'Order marked as delivered!');
  localStorage.setItem('toastType', 'success');
}

export async function receiveOrder(orderUid) {
  const ordersRef = ref(db, 'orders');
  const orderRef = child(ordersRef, orderUid);
  const trackingRef = child(orderRef, 'tracking');

  const orderSnap = await get(orderRef);
  const order = orderSnap.val() || {};
  const userUid = order.user_uid;

  const roadmap = Object.keys(statusMap);
  const completedIndex = roadmap.indexOf('Completed');
  if (completedIndex === -1) return;

  const currentStatus = order.status;

  let startIndex = 0;
  if (currentStatus) {
    const currentIndex = roadmap.indexOf(currentStatus);
    if (currentIndex !== -1) {
      startIndex = currentIndex + 1;
    }
  }

  if (startIndex > completedIndex) {
    startIndex = completedIndex;
  }

  const trackingSnap = await get(trackingRef);
  const tracking = trackingSnap.val();
  let lastStatus = tracking
    ? (Object.values(tracking)[Object.values(tracking).length - 1] || {}).status
    : null;

  for (let i = startIndex; i <= completedIndex; i++) {
    const stepStatus = roadmap[i];
    if (stepStatus === lastStatus) continue;
    await newOrderTrack(orderUid, stepStatus);
    lastStatus = stepStatus;
  }

  const now = new Date().toLocaleString();

  await update(orderRef, {
    status: 'Completed',
    updated_at: now,
    updated_by: auth.currentUser.uid,
  });

  await newUserNotification(userUid, 'Order Completed', 'Your order has been completed!');
  localStorage.setItem('toastMessage', 'Order received!');
  localStorage.setItem('toastType', 'success');
}