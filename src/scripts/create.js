import { child, get, push, ref, set, update } from 'firebase/database'
import { auth, db } from '../firebase'
import { getItemPerKg, getOrders, getServiceName, getWashableItemName } from './get';

export async function createWithGoogle(authId, email, phoneNum, name, imgUrl, currentDate) {
  const usersRef = ref(db, 'users');
  const userCounter = await ((await get(child(usersRef, 'user_counter'))).val());
  const userId = 'CUS-' + String(userCounter + 1).padStart(3, '0');
  const userData = {
    'user_id': userId,
    'auth_id': authId,
    'email': email,
    'role': 'customer',
    'fullname': name, // null if wala
    'phone': phoneNum, // null if wala
    'address': null, // user input
    'status': 'active',
    'image_url': imgUrl, // null if wala
    created_at: currentDate,
    created_by: authId
  }
  set(ref(db, `users/${authId}`), userData) // auth id nalang ginamit ko kasi mas madali gamitin
    .then((newReference) => {
      localStorage.setItem("toastMessage", "New user created!");
      localStorage.setItem("toastType", "success");
      window.location.href = '/';
    })
    .catch((err) => {
      localStorage.setItem("toastMessage", err.message);
      localStorage.setItem("toastType", "error");
      window.location.reload();
    })
  await update(usersRef, {
    'user_counter': userCounter + 1,
  })
    .then(() => console.log("Increment"));

}

export async function createViaEmailAndPassword(authId, firstName, lastName, phoneNumber, email, currentDate) {
  const usersRef = ref(db, 'users');
  const userCounter = await ((await get(child(usersRef, 'user_counter'))).val());
  const userId = 'CUS-' + String(userCounter + 1).padStart(3, '0');
  const userData = {
    'user_id': userId,
    'auth_id': authId,
    'fullname': firstName + " " + lastName,
    'phone': phoneNumber,
    'email': email,
    'role': 'customer',
    'status': 'active',
    created_at: currentDate,
    created_by: authId
  }
  set(ref(db, `users/${authId}`), userData) // auth id nalang ginamit ko kasi mas madali gamitin
    .then((newReference) => {
      localStorage.setItem("toastMessage", "New user created!");
      localStorage.setItem("toastType", "success");
    })
    .catch((err) => {
      localStorage.setItem("toastMessage", err.message);
      localStorage.setItem("toastType", "error");
    })
  await update(usersRef, {
    'user_counter': userCounter + 1,
  })
    .then(() => console.log("Increment"));
}

export async function newServiceType(serviceName, services, description, servicePrice, imageUrl) {
  const serviceTypesRef = ref(db, 'service_types');
  const newServiceTypeRef = await push(serviceTypesRef);
  const serviceCounter = await ((await get(child(serviceTypesRef, 'service_counter'))).val());
  const serviceTypeId = 'SRV-' + String(serviceCounter + 1).padStart(3, '0');
  const currDate = new Date().toLocaleString();
  const serviceTypeData = {
    "service_type_id": serviceTypeId,
    "service_name": serviceName,
    "services": services,
    "description": description,
    "service_price": servicePrice,
    "image_url": imageUrl,
    "created_at": currDate,
    "created_by": auth.currentUser.uid,
    // "updated_at": currDate,
    // "updated_by": auth.currentUser.uid
  }
  set(newServiceTypeRef, serviceTypeData).then((res) => {
    console.log("success")
    localStorage.setItem("toastMessage", "New service type created!");
    localStorage.setItem("toastType", "success");
    window.location.reload();
  })
    .catch((err) => {
      localStorage.setItem("toastMessage", err.message);
      localStorage.setItem("toastType", "error");
      window.location.reload();
    })
  await update(serviceTypesRef, {
    'service_counter': serviceCounter + 1,
  })
    .then(() => console.log("Increment"));
}

export async function newWashableItem(itemName, itemPerKilo, imgUrl) {
  const washableItemsRef = ref(db, 'washable_items');
  const newWashableItemRef = await push(washableItemsRef);
  const washablesCounter = await ((await get(child(washableItemsRef, 'washables_counter'))).val());
  const washableItemId = 'WITEM-' + String(washablesCounter + 1).padStart(3, '0');
  const currDate = new Date().toLocaleString();
  const washableItemData = {
    "washable_item_id": washableItemId, // Key of the node
    "washable_item_name": itemName,
    "item_per_kilo": itemPerKilo,
    "image_url": imgUrl,
    "created_at": currDate,
    "created_by": auth.currentUser.uid,
    // "updated_at": currDate,
    // "updated_by": auth.currentUser.uid 
  }

  set(newWashableItemRef, washableItemData).then((res) => {
    console.log("success")
    localStorage.setItem("toastMessage", "New washable item created!");
    localStorage.setItem("toastType", "success");
    window.location.reload();
  })
    .catch((err) => {
      localStorage.setItem("toastMessage", "Failed to create new washable item.");
      localStorage.setItem("toastType", "error");
      window.location.reload();
    })
  await update(washableItemsRef, {
    'washables_counter': washablesCounter + 1,
  })
    .then(() => console.log("Increment"));
}

export async function newOrder(serviceUid, address, paymentMethod, transferMode, transferDate, arrivalDate, claimMode, note, orders, amount) {
  const serviceName = await getServiceName(serviceUid);
  const currDate = new Date().toLocaleString();
  const ordersRef = ref(db, 'orders');
  const newOrderRef = await push(ordersRef);
  const ordersCounter = await ((await get(child(ordersRef, 'orders_counter'))).val());
  const orderId = 'ORD-' + String(ordersCounter + 1).padStart(3, '0');
  const newOrderUid = newOrderRef.key;
  const payment = await newPayment(newOrderUid, paymentMethod, 'unpaid', ordersCounter);
  let orderItems = [];
  for (let i = 0; i < orders.length; i++) {
    const orderItem = await newOrderItem(newOrderUid, orders[i].washable_item_id, orders[i].quantity);
    orderItems.push(orderItem);
  }

  const orderData = {
    "order_id": orderId,
    "user_id": auth.currentUser.uid,

    "customer_name": auth.currentUser.displayName,
    "service_name": serviceName,

    "service_type_id": serviceUid,
    "order_items": orderItems,
    "address": address,
    "amount": amount,
    "mode_of_transfer": transferMode,
    "transfer_date": transferDate,
    "arrival_date": arrivalDate,
    "mode_of_claiming": claimMode,
    "status": "Pending",
    "status_note": "Waiting for approval",
    "payment": payment,

    "created_at": currDate,
    "created_by": auth.currentUser.uid,
    // "updated_at": currDate,
    // "updated_by": "uid_of_admin_2", // la pa

    // "tracking":{ // sa update lang to lalabas
    //   "-M1kL3q5R": { // push id to, di hard coded
    //     "timestamp": "2025-11-06T11:30:00Z",
    //     "status": "arrived",
    //     "message": "Order confirmed in-shop."
    //   },
    //   "-M1kL4a6S": { 
    //     "timestamp": "2025-11-06T14:30:00Z",
    //     "status": "washing",
    //     "message": "Items are now in the wash cycle."
    //   }
    // },

    // "schedule":{ // sa update
    //   "pickup": {
    //       "scheduled_date": "2025-11-06T10:00:00Z",
    //       "status": "completed", 
    //       "date_completed": "2025-11-06T10:15:00Z"
    //   },
    //   "delivery": {
    //     "scheduled_date": "2025-11-08T15:00:00Z",
    //     "status": "out for delivery",
    //     "date_completed": null
    //   }
    // }
  };

  if (transferMode == 'Pick-up') {
    orderData.schedule = {
      pickup: {
        "scheduled_date": transferDate,
        "status": "Not yet received",
      },
      // delivery: { //ginamit ko for testing
      //   "scheduled_date": transferDate,
      //   "status": "Not yet received",
      // },
    }
  }

  try {
    const newOrderRef = await push(ordersRef, orderData);

    if (note) {
      const notesRef = child(newOrderRef, 'notes');
      set(notesRef, {
        "order_notes": note,
      })
    }
    const insertedOrderUid = newOrderRef.key;
    const snapshot = await get(newOrderRef);
    const insertedOrder = snapshot.val();
    console.log("Inserted order:", insertedOrder);
    await update(ordersRef, {
      'orders_counter': ordersCounter + 1,
    })
      .then(() => console.log("Increment"));
    return [insertedOrderUid, insertedOrder];
  } catch (err) {
    alert(err.message);
  }
}

export async function newOrderTrack(orderUid, status) {
  const statusMap = {
    Pending: {
      label: "Order Pending",
      value: "Your order is currently under approval.",
    },
    Canceled: {
      label: "Order Canceled",
      value: "Your order has been canceled.",
    },
    Rejected: {
      label: "Order Rejected",
      value: "Your order has been rejected.",
    },
    Accepted: {
      label: "Order Approved",
      value: "Your order has been accepted.",
    },
    Received: {
      label: "Received Laundry",
      value: "We have received your laundry load.",
    },
    Washing: {
      label: "Washing Laundry",
      value: "Your laundry is now being washed and cleaned.",
    },
    Done: { 
      label: "Finished Laundry", 
      value: "Laundry has been finished." 
    },
    Delivery: { 
      label: "Out for Delivery", 
      value: "Your laundry is out for delivery." 
    },
    Completed: {
      label: "Completed",
      value: "You have received your laundry and completed your order.",
    },
    Error: {
      label: "Process Error",
      value: "Something went wrong while trying to process your order.",
    },
  };

  const orderTracksRef = ref(db, `orders/${orderUid}/tracking`);
  const newOrderTrackRef = await push(orderTracksRef);
  const currDate = new Date().toLocaleString();
  const orderTrackData = {
    "timestamp": currDate,
    "status": status,
    "label": statusMap[status].label,
    "message": statusMap[status].value
  }

  await update(newOrderTrackRef, orderTrackData);

  return orderTrackData;
}

export async function newOrderItem(orderUid, washableItemId, quantity) {
  const washableItemName = await getWashableItemName(washableItemId);
  const orderItemsRef = ref(db, 'order_items');
  const newOrderItemRef = await push(orderItemsRef);
  const itemPerKilo = await getItemPerKg(washableItemId);
  const totalKilo = quantity / itemPerKilo;

  const orderItemData = {
    "order_id": orderUid,
    "washable_item_id": washableItemId,
    "washable_item_name": washableItemName,
    "quantity": quantity,
    "total_kilo": totalKilo
  }

  return orderItemData;
}

export async function newInventory(inventoryItemName, stock, unitName, status) {
  const inventoryRef = ref(db, 'inventory_items');
  const newInventoryItemRef = await push(inventoryRef);
  const inventoryCounter = await ((await get(child(inventoryRef, 'inventory_counter'))).val());
  const inventoryItemId = 'ITEM-' + String(inventoryCounter + 1).padStart(3, '0');
  const currDate = new Date().toLocaleString();

  const inventoryData = {
    "inventory_item_id": inventoryItemId, // Key of the node
    "inventory_item_name": inventoryItemName,
    "quantity_in_stock": stock,
    "unit_name": unitName, //plural
    "status": status,
    "last_restocked": currDate, //update
    "created_at": currDate,
    "created_by": auth.currentUser.uid,
    // "updated_at": currDate,
    // "updated_by": auth.currentUser.uid
  }

  set(newInventoryItemRef, inventoryData).then((res) => {
    console.log("success");
    localStorage.setItem("toastMessage", "New inventory item created!");
    localStorage.setItem("toastType", "success");
    window.location.reload();
  })
    .catch((err) => {
      localStorage.setItem("toastMessage", "Failed to create new inventory item.");
      localStorage.setItem("toastType", "error");
      window.location.reload();
    })
  await update(inventoryRef, {
    'inventory_counter': inventoryCounter + 1,
  })
    .then(() => console.log("Increment"));
}

export async function newPayment(orderUid, method, status, counter) { // to din sana sa loob na ni order, pero gawan parin separate table/object for redundancy
  const paymentId = 'PAY-' + String(counter + 1).padStart(3, '0');
  const currDate = new Date().toLocaleString();

  const paymentData = {
    "payment_id": paymentId,
    "order_id": orderUid,
    "payment_method": method,
    "status": status, //update
    "created_at": currDate,
    "created_by": auth.currentUser.uid,
    // "updated_at": currDate,
    // "updated_by": auth.currentUser.uid
  }

  return paymentData;
}

export async function newSchedule(orderID, scheduleType, date, time) {
  const orders = await getOrders();
  let ordersRef = ref(db, 'orders')
  let withoutCounter = [];
  for(let i = 0; i < orders.length; i++){
      if(orders[i][0] != 'orders_counter'){
          withoutCounter.push(orders[i])
      }
  }
  for(let i = 0; i < withoutCounter.length; i++){
    console.log(withoutCounter[i][1].order_id);
    
    if(withoutCounter[i][1].order_id == orderID){
      const orderRef = child(ordersRef, withoutCounter[i][0]);
      const scheduleRef = child(orderRef, 'schedule'); 
      const scheduleTypeData = scheduleType;
      const scheduleData = {
        [`${scheduleTypeData}`]:{
          "scheduled_date": date + time,
          "status": "Not yet received"
        }
      }
      update(scheduleRef, scheduleData).then(()=>{console.log("Schedule created");
        localStorage.setItem("toastMessage", "New schedule created!");
        localStorage.setItem("toastType", "success");
        window.location.reload();
      })
    }
  }
  console.log("ID not found");
  localStorage.setItem("toastMessage", "Order ID not found.");
  localStorage.setItem("toastType", "error");
  window.location.reload();
  return;
}