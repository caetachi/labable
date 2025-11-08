import { child, get, push, ref, set, update } from 'firebase/database'
import { auth, db } from '../firebase'

export async function createWithGoogle(authId, email, phoneNum, name, imgUrl, currentDate){
  const usersRef = ref(db, 'users');
  const userCounter = await ((await get(child(usersRef, 'user_counter'))).val()) ;
  const userId = 'CUS-' + String(userCounter+1).padStart(3, '0');
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
  .then((newReference)=>{
    alert("New user created!")
  })
  .catch((err)=>{
    alert(err.message);
  })
  await update(usersRef, {
    'user_counter': userCounter+1,
  })
  .then(()=>console.log("Increment"));
    
}

  export async function createViaEmailAndPassword(authId, email, currentDate){
    const usersRef = ref(db, 'users');
    const userCounter = await ((await get(child(usersRef, 'user_counter'))).val()) ;
    const userId = 'CUS-' + String(userCounter+1).padStart(3, '0');
    const userData = { 
      'user_id': userId,
      'auth_id': authId,
      'email': email,
      'role': 'customer',
      'status': 'active', 
      created_at: currentDate,
      created_by: authId
    }
    set(ref(db, `users/${authId}`), userData) // auth id nalang ginamit ko kasi mas madali gamitin
    .then((newReference)=>{
      alert("New user created!")
    })
    .catch((err)=>{
      alert(err.message);
    })
    await update(usersRef, {
      'user_counter': userCounter+1,
    })
    .then(()=>console.log("Increment"));
  }





  export async function newServiceType(serviceName, description, servicePrice, imageUrl) {
    const serviceTypesRef = ref(db, 'service_types');
    const newServiceTypeRef = await push(serviceTypesRef);
    const serviceCounter = await ((await get(child(serviceTypesRef, 'service_counter'))).val()) ;
    const serviceTypeId = 'SRV-' + String(serviceCounter+1).padStart(3, '0');
    const currDate = new Date().toLocaleString();
    const serviceTypeData = {
      "service_type_id": serviceTypeId, 
      "service_name": serviceName,
      "description": description,
      "service_price": servicePrice,
      "image_url": imageUrl,
      "created_at": currDate,
      "created_by": auth.currentUser.uid,
      // "updated_at": currDate,
      // "updated_by": auth.currentUser.uid
    }
    set(newServiceTypeRef, serviceTypeData).then((res)=>{
      console.log("success")
    })
    .catch((err)=>{
      alert(err.message);
    })
    await update(serviceTypesRef, {
      'service_counter': serviceCounter+1,
    })
    .then(()=>console.log("Increment"));
  }

  export async function newWashableItem(itemName, itemPerKilo, imgUrl) {
    const washableItemsRef = ref(db, 'washable_items');
    const newWashableItemRef = await push(washableItemsRef);
    const washablesCounter = await ((await get(child(washableItemsRef, 'washables_counter'))).val()) ;
    const washableItemId = 'WITEM-' + String(washablesCounter+1).padStart(3, '0');
    const currDate = new Date().toLocaleString();
    const washableItemData = {
      "washable_item_id": washableItemId, // Key of the node
      "washable_item_name":itemName, 
      "item_per_kilo":itemPerKilo, 
      "image_url": imgUrl,
      "created_at": currDate,
      "created_by": auth.currentUser.uid, 
      // "updated_at": currDate,
      // "updated_by": auth.currentUser.uid 
    }
    
    set(newWashableItemRef, washableItemData).then((res)=>{
      console.log("success")
    })
    .catch((err)=>{
      alert(err.message);
    })
    await update(washableItemsRef, {
      'washables_counter': washablesCounter+1,
    })
    .then(()=>console.log("Increment"));
  }
  
  export async function newOrder(serviceUid, address, paymentMethod, transferMode, transferDate, arrivalDate, claimMode, note, orders) {
    // orders = [{
    //  itemId: id,
    //  quantity: quant
    // },
    //  {
    //  itemId: id,
    //  quantity: quant
    // }] - array of objects
    //

    const serviceName = await getServiceName(serviceUid);
    const currDate = new Date().toLocaleString();
    const ordersRef = ref(db, 'orders');
    const newOrderRef = await push(ordersRef);
    const ordersCounter = await ((await get(child(ordersRef, 'orders_counter'))).val()) ;
    const orderId = 'ORD-' + String(ordersCounter+1).padStart(3, '0');
    const newOrderUid = newOrderRef.key;
    const servicePrice = await getServicePrice(serviceUid);
    let total = 0;
    let orderItems = []; 
    for(let i = 0; i < orders.length; i++){
      const orderItem = await newOrderItem(newOrderUid , orders[i].itemId, orders[i].quantity);
      orderItems.push(orderItem); 
      total += orderItem.total_kilo;
    }

    total = total * servicePrice;

    const orderData = {
      "order_id": orderId, 
      "user_id": auth.currentUser.uid,
      
      "customer_name": auth.currentUser.displayName,
      "service_name": serviceName, 

      "service_type_id": serviceUid,
      "order_items": orderItems, 
      "address": address,
      "payment_method": paymentMethod,
      "amount": total,
      "mode_of_transfer": transferMode,
      "transfer_date": transferDate,
      "arrival_date": arrivalDate,
      "mode_of_claiming": claimMode,
      "notes": {
        "order_notes": note,
        "cancel_notes": null // sa update lang to lalabas
      },
      "status": "Pending", 
      "status_note": "Waiting for approval", 
      
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

    if(transferMode == 'Pick-up'){
      orderData.schedule = {
        pickup: {
          "scheduled_date": transferDate,
          "status": "Not yet received", 
        }
      }
    }

    console.log(orderData);
    
    set(newOrderRef, orderData).then((res)=>{
      console.log("success")
    })
    .catch((err)=>{
      alert(err.message);
    })

    await update(ordersRef, {
      'orders_counter': ordersCounter+1,
    })
    .then(()=>console.log("Increment"));
  }

  export async function newOrderItem(orderUid, washableItemId, quantity) {
    const washableItemName = await getWashableItemName(washableItemId);
    const orderItemsRef = ref(db, 'order_items');
    const newOrderItemRef = await push(orderItemsRef);
    const newOrderItemUid = newOrderItemRef.key;
    const itemPerKilo = await getItemPerKg(washableItemId);
    const totalKilo = quantity / itemPerKilo;
    
    const orderItemData = { 
      'order_item_id': newOrderItemUid,
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
    const inventoryCounter = await ((await get(child(inventoryRef, 'inventory_counter'))).val()) ;
    const inventoryItemId = 'ITEM-' + String(inventoryCounter+1).padStart(3, '0');
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

    set(newInventoryItemRef, inventoryData).then((res)=>{
      console.log("success");
    })
    .catch((err)=>{
      alert(err.message);
    })
    await update(inventoryRef, {
      'inventory_counter': inventoryCounter+1,
    })
    .then(()=>console.log("Increment"));
  }

  export async function newPayment(orderUid, amount, status) { // to din sana sa loob na ni order, pero gawan parin separate table/object for redundancy
    const paymentsRef = ref(db, 'payments');
    const newPaymentRef = await push(paymentsRef);
    const paymentsCounter = await ((await get(child(paymentsRef, 'payments_counter'))).val()) ;
    const paymentId = 'PAY-' + String(paymentsCounter+1).padStart(3, '0');
    const currDate = new Date().toLocaleString();

    const paymentData = {
      "payment_id": paymentId, 
      "order_id": orderUid, 
      "amount_paid": amount,
      "payment_date": currDate,
      "status": status, //update
      "created_at": currDate,
      "created_by": auth.currentUser.uid,
      // "updated_at": currDate,
      // "updated_by": auth.currentUser.uid
    }
  
    set(newPaymentRef, paymentData).then((res)=>{
      console.log("success");
    })
    .catch((err)=>{
      alert(err.message);
    })
    await update(paymentsRef, {
      'payments_counter': paymentsCounter+1,
    })
    .then(()=>console.log("Increment"));
  }