import { child, get, onValue, push, ref, set, update } from 'firebase/database'
import { auth, db } from '../firebase'
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useEffect } from 'react';

export default function Example() {
  const provider = new GoogleAuthProvider();

  //----------MGA CREATE----------//
  

  async function createWithGoogle(authId, email, phoneNum, name, imgUrl, currentDate){
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

  async function createViaEmailAndPassword(authId, email, currentDate){
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





  async function newServiceType(serviceName, description, servicePrice, imageUrl) {
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

  async function newWashableItem(itemName, itemPerKilo, imgUrl) {
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
  
  async function newOrder(serviceUid, address, paymentMethod, transferMode, transferDate, arrivalDate, claimMode, note, orders) {
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
    const payment = await newPayment(newOrderUid, null, 'unpaid');

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
      "payment": payment,
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

    const userRef = ref(db, `users/${auth.currentUser.uid}`);
    const userOrdersRef = child(userRef, `orders/${newOrderUid}`);
    set(userOrdersRef, orderData).then((res)=>{
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

  async function newOrderItem(orderUid, washableItemId, quantity) {
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
  
  async function newInventory(inventoryItemName, stock, unitName, status) {
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

  async function newPayment(orderUid, amount, status) { // to din sana sa loob na ni order, pero gawan parin separate table/object for redundancy
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
    return paymentData;
  }

  
  //----------MGA CREATE----------//
  


  //----------CREATE ACCOUNT----------//


  async function registerViaGoogle(){
    let res;
    await signInWithPopup(auth, provider)
    .then((result)=>{
      const user = result.user;
      console.log('user: '+user.email);
      console.log('user: '+user.uid);
      console.log('user: '+user.phoneNumber);
      console.log('user: '+user.displayName); // walang separate
      console.log('user: '+user.photoURL);
      res = user;
    })
    .catch((err)=>{
      alert(err.message);
    })
    const currDate = new Date().toLocaleString();
    await createWithGoogle(res.uid, res.email, res.phoneNumber, res.displayName, res.photoURL, currDate);
  }

  async function registerViaEmailPass(email, password){
    let res;
    await createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential)=>{
      const user = userCredential.user;
      res = user;
      console.log(user);
    })
    .catch((err)=>{
      alert(err.message);
    })
    const currDate = new Date().toLocaleString();
    await createViaEmailAndPassword(res.uid, res.email, currDate);
  }


  //----------CREATE ACCOUNT----------//
  
  
  //----------LOGIN----------//
  
  async function loginViaEmailAndPassword(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log(user.uid);
  }
  
  
  




  
  //----------LOGIN----------//
  

  //----------MGA GET----------//
  
  async function getServiceName(serviceUid) {
    const servicesRef = ref(db, 'service_types');
    const serviceRef = child(servicesRef, serviceUid);
    const service = await (await get(serviceRef)).val();
    
    console.log(service);
    return service.service_name;
  }

  async function getServicePrice(serviceUid) {
    const servicesRef = ref(db, 'service_types');
    const serviceRef = child(servicesRef, serviceUid);
    const service = await (await get(serviceRef)).val();
    
    console.log(service);
    return service.service_price;
  }

  
  
  async function getWashableItemName(washableItemId) {
    const washableItemsRef = ref(db, 'washable_items');
    const washableItemRef = child(washableItemsRef, washableItemId);
    const washableItem = await (await get(washableItemRef)).val();
    
    console.log(washableItem);
    return washableItem.washable_item_name;
  }
  
  async function getItemPerKg(washableItemId) {
    const washableItemsRef = ref(db, 'washable_items');
    const washableItemRef = child(washableItemsRef, washableItemId);
    const washableItem = await (await get(washableItemRef)).val();
    
    console.log("price "+washableItem.item_per_kilo);
    return washableItem.item_per_kilo;
  }

  async function getOrder(orderUid) {
    const ordersRef = ref(db, 'orders');
    const orders = child(ordersRef, orderUid);
    const orderSnap = await get(orders);
    const orderId = orderSnap.key;
    const order = await orderSnap.val();

    console.log([orderId, order]);
    
    return [orderId, order];
  }


  // BULK

  async function getWashableItems() {
    const washableItemsRef = ref(db, 'washable_items')
    const washableItems = await (await get(washableItemsRef)).val();
    console.log(Object.entries(washableItems));
    // return Object.values(washableItems); // returns only values
    return Object.entries(washableItems); // [key, value] parang property pero array
  }
  
  async function getServices() {
    const serviceTypesRef = ref(db, 'service_types')
    const serviceTypes = await (await get(serviceTypesRef)).val();
    console.log(Object.entries(serviceTypes));
    // return Object.values(serviceTypes);
    return Object.entries(serviceTypes);
  }
  async function getOrders() { // eto nalang din sa Schedule Management
    const ordersRef = ref(db, 'orders')
    const orders = await (await get(ordersRef)).val();
    console.log(Object.entries(orders));
    // return Object.values(serviceTypes);
    return Object.entries(orders);
  }
  async function getInventory() { // eto nalang din sa Schedule Management
    const inventoryRef = ref(db, 'inventory_items')
    const inventory = await (await get(inventoryRef)).val();
    console.log(Object.entries(inventory));
    // return Object.values(serviceTypes);
    return Object.entries(inventory);
  }


  
  
  //----------MGA GET----------//
  
  
  
  
  
  
  
  
  
  
  //----------MGA UPDATE----------//
  async function updateUser(email, name, phoneNum, address, imgUrl) {
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

  async function updateWashableItem(washableItemUid, itemName, itemPerKilo) {
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

  async function updateServiceType(serviceTypeUid, serviceName, description, price) {
    const currDate = new Date().toLocaleString();
    const serviceTypesRef = ref(db, 'service_types');
    const serviceTypeRef = child(serviceTypesRef, serviceTypeUid);
    let serviceTypeData = { 
      'updated_at': currDate,
      'updated_by': auth.currentUser.uid,
    }
    if(serviceName)serviceTypeData.service_name = serviceName;
    if(description)serviceTypeData.description = description;
    if(price)serviceTypeData.service_price = price; 
    await update(serviceTypeRef, serviceTypeData)
    .then(()=>console.log("Updated"));
  }

  async function updateInventoryItem(inventoryItemUid, inventoryItemName, quantity, status, unitName, lastRestock) {
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


  async function updateOrderDetails(orderUid, customerName, address, serviceUid, serviceType, paymentMethod, amount, orderItems, status, modeOfTransfer, modeOfClaiming, orderDate, laundryTransferDateTime, arrivalDate, notes) {
    const currDate = new Date().toLocaleString();
    const ordersRef = ref(db, 'orders');
    const orderRef = child(ordersRef, orderUid);
    const pickupRef = child(orderRef, 'schedule/pickup');
    const notesRef = child(orderRef, 'notes');
    const orderData = { 
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

  async function updateScheduleDetails(orderUid, customerName, address, status, modeOfClaiming, laundryClaimDateTime) {
    const currDate = new Date().toLocaleString();
    const ordersRef = ref(db, 'orders');
    const orderRef = child(ordersRef, orderUid);
    const deliveryRef = child(orderRef, 'schedule/delivery');
    const orderData = { 
      'updated_at': currDate,
      'updated_by': auth.currentUser.uid,
    }
    if(customerName)orderData.customer_name = customerName;
    if(address)orderData.address = address;
    if(status)orderData.status = status; 
    if(modeOfClaiming == "Deliver"){
      orderData.mode_of_claiming = modeOfClaiming; 
      await set(deliveryRef, {
        "scheduled_date": laundryClaimDateTime,
        "status": status,
        "created_at": currDate
      })
      .then(()=>console.log("Updated"));
    }
    await update(orderRef, orderData)
    .then(()=>console.log("Updated"));
  }






  
  

  
  
  
  
  
  //----------MGA UPDATE----------//








  
  let orders = [{
     itemId: '-OdTF4qxWuLU6r4Sc7jK', 
     quantity: 6
    },
     {
     itemId: '-OdTF4qxWuLU6r4Sc7jK',
     quantity: 9
    }];

  // example using onValue
  useEffect(()=>{
    const ordersRef = ref(db, 'orders');
    const istop = onValue(ordersRef, (snapshot)=>{
      if(snapshot.exists()){ // check kung may laman
        console.log(snapshot.val());
        console.log('read') // pindutin nyo lang update order tas lalabas to
      }
    })
    
    return () =>{
      istop();
    }
  }, []);

  //example using get
  async function exampleGet() {
    const washables = await getWashableItems()
    console.log(washables);

    for(let i = 0; i < washables.length; i++){
      if(washables[i][0] != 'washables_counter'){
        console.log(washables[i][1].washable_item_name);
      }else{
        console.log('counter');
      }
    }
  }

    
  return (
    <>
      <button onClick={()=>registerViaGoogle()}>Register via Google</button>
      <button onClick={()=>registerViaEmailPass('janrei@gmail.com', 'hakdog321')}>Register via Email and Password</button>
      <button onClick={()=>newServiceType('Wash & Fold', 'Standard washing and folding service priced per piece', 40.00, null)}>New Service Type</button>
      <button onClick={()=>newWashableItem('T-Shirt', 10.00, null)}>New Washable Item</button>
      <button onClick={()=>newOrder('-OdTDgAbUglw8q_sITnW', 'address', 'paymentMethod', 'Pick-up', 'transferDate', 'arrivalDate', 'claimMode', 'note', orders)}>New Order</button>
      <button onClick={()=>newInventory('Detergent - Standard', 50, 'Pieces', 'available')}>New Inventory</button>
      <button onClick={()=>newPayment('-OdN41e0OdR3TSpWczIC', 'amount', 'completed')}>New Payment</button>
      <button onClick={()=>getServiceName('-OdTDgAbUglw8q_sITnW')}>Get Service Name</button>
      <button onClick={()=>getWashableItems()}>Get Washables</button>
      <button onClick={()=>getServices()}>Get Services</button>
      <button onClick={()=>getOrders()}>Get Orders</button>
      <button onClick={()=>getInventory()}>Get Inventory</button>
      <button onClick={()=>getOrder('-OdTIv4NGeX9TTur7X5_')}>Get Order</button>
      <button onClick={()=>updateUser('janrei@gmail.com', 'Jan Rei', '09166239747', 'Paombong', null)}>Update User</button>
      <button onClick={()=>updateWashableItem('-OdTF4qxWuLU6r4Sc7jK', 'Brief', 15)}>Update Washable</button>
      <button onClick={()=>updateServiceType('-OdTDgAbUglw8q_sITnW', "Laba lang", "Wet na sya pagbalik", 50)}>Update Service</button>
      <button onClick={()=>updateInventoryItem('-OdTGLqjFh-_8E22nRMh', 'Shampoo', 25, 'Butas yung iba', 'sachets', 'kahapon')}>Update Inventory</button>
      <button onClick={()=>updateOrderDetails('-OdTIv4NGeX9TTur7X5_', 'DaddyJiAr', 'BSU Pimentel', '-OdNo8KTaHyu41HpRROD', 'Laba lang', 'Cash', 280, orders, 'afk', 'tapon', 'pulot', 'ngayon', 'bukas ng hapon', 'dikolam', 'kingina daming parameter neto')}>Update Order</button>
      <button onClick={()=>updateScheduleDetails('-OdTIv4NGeX9TTur7X5_', 'PapaJiAr', 'BSU E-Lib', 'Online', 'Deliver', 'Yesterday morning')}>Update Schedule</button>
      <button onClick={()=> exampleGet()}>Example Get</button>
      <button onClick={()=> loginViaEmailAndPassword('janrei@gmail.com', 'hakdog321')}>Login</button>
    </>
  )
}

