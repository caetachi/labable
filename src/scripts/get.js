
import { child, get, ref } from 'firebase/database'
import { db } from '../firebase'

  export async function getServiceName(serviceUid) {
    const servicesRef = ref(db, 'service_types');
    const serviceRef = child(servicesRef, serviceUid);
    const service = await (await get(serviceRef)).val();
    
    console.log(service);
    return service.service_name;
  }

  export async function getServicePrice(serviceUid) {
    const servicesRef = ref(db, 'service_types');
    const serviceRef = child(servicesRef, serviceUid);
    const service = await (await get(serviceRef)).val();

    console.log(service);
    return service.service_price;
  }
  
  export async function getWashableItemName(washableItemId) {
    const washableItemsRef = ref(db, 'washable_items');
    const washableItemRef = child(washableItemsRef, washableItemId);
    const washableItem = await (await get(washableItemRef)).val();
    
    console.log(washableItem.washable_item_name);
    return washableItem.washable_item_name;
  }
  
  export async function getItemPerKg(washableItemId) {
    const washableItemsRef = ref(db, 'washable_items');

    const washableItemRef = child(washableItemsRef, washableItemId);
    const washableItem = await (await get(washableItemRef)).val();

    return washableItem.item_per_kilo;
  }

  export async function getOrder(orderUid) {
    const ordersRef = ref(db, 'orders');
    const orders = child(ordersRef, orderUid);
    const orderSnap = await get(orders);
    const orderId = orderSnap.key;
    const order = await orderSnap.val();

    console.log([orderId, order]);
    return [orderId, order];
  }
  
  export async function getInventoryItem(inventoryUid) {
    const inventoryRef = ref(db, 'inventory_items');
    const inventoryItem = child(inventoryRef, inventoryUid);
    const inventoryItemSnap = await get(inventoryItem);
    const inventoryItemUid = inventoryItemSnap.key;
    const inventory = await inventoryItemSnap.val();

    console.log([inventoryItemUid, inventory]);
    return [inventoryItemUid, inventory];
  }
  export async function getServiceType(serviceUid) {
    const servicesRef = ref(db, 'service_types');
    const serviceTypeRef = child(servicesRef, serviceUid);
    const serviceTypeSnap = await get(serviceTypeRef);
    const serviceTypeUid = serviceTypeSnap.key;
    const serviceType = await serviceTypeSnap.val();

    console.log([serviceTypeUid, serviceType]);
    return [serviceTypeUid, serviceType];
  }
  export async function getWashableItem(washableUid) {
    const washablesRef = ref(db, 'washable_items');
    const washableItemRef = child(washablesRef, washableUid);
    const washableItemSnap = await get(washableItemRef);
    const washableItemUid = washableItemSnap.key;
    const washableItem = await washableItemSnap.val();

    console.log([washableItemUid, washableItem]);
    return [washableItemUid, washableItem];
  }

  export async function getActiveOrderCount(userUid) {
    const ordersRef = ref(db, "orders");
    const ordersSnap = await get(ordersRef);
    const orders = ordersSnap.val();

    if (!orders) return 0;

    let count = 0;

    for (const [orderId, order] of Object.entries(orders)) {
      if (
        order.user_id === userUid &&
        order.status !== "Completed" &&
        order.status !== "Rejected" &&
        order.status !== "Canceled"
      ) {
        count++;
      }
  }
  return count;
}

  export async function getService(serviceId) {
    const servicesRef = ref(db, 'service_types');
    const serviceRef = child(servicesRef, serviceId);
    const serviceSnap = await get(serviceRef);
    const service = await serviceSnap.val();
    
    return service;
  }

  export async function getView(category, viewId) {

    const categoryMap = {
      order: 'orders',
      schedule: 'orders',
      inventory: 'inventory_items',
      service: 'service_types',
      washable: 'washable_items'
    };

    category = categoryMap[category] || category;

    const viewsRef = ref(db, category);
    const viewRef = child(viewsRef, viewId);
    const viewSnap = await get(viewRef);
    const view = await viewSnap.val();

    if (view && view.created_by) {
        const user = await getUser(view.created_by);
        view.created_by = user.fullname; 
    }

    return view;
  }

  export async function getUser(userId) {
    const usersRef = ref(db, 'users');
    const userRef = child(usersRef, userId);
    const userSnap = await get(userRef);
    const user = await userSnap.val();
    console.log(user);
    
    return user;
  }
  export async function getCompleteOrderCount(userUid) {
    const ordersRef = ref(db, "orders");
    const ordersSnap = await get(ordersRef);
    const orders = ordersSnap.val();

    if (!orders) return 0;

    let count = 0;

    for (const [orderId, order] of Object.entries(orders)) {
      if (
        order.user_id === userUid &&
        order.status === "Completed"
      ) {
        count++;
      }
  }
  return count;
}

export async function getTotalSpentAmount(userUid) {
  const ordersRef = ref(db, "orders");
  const ordersSnap = await get(ordersRef);
  const orders = ordersSnap.val();

  if (!orders) return 0;

  let amount = 0;

  for (const [orderId, order] of Object.entries(orders)) {
    console.log(orderId, order.user_id, order.status, order.amount);
    if (
      order.user_id === userUid &&
      order.status !== "Rejected" &&
      order.status !== "Canceled"
    ) {
      amount += Number(order?.amount ?? 0);
    }
  }
  return amount;
}

  export async function getUserRecentOrders(userUid) {
  const ordersRef = ref(db, "orders");
  const ordersSnap = await get(ordersRef);
  const orders = ordersSnap.val();

  const recentOrders = [];

  if (!orders) return recentOrders;

  for (const [orderId, order] of Object.entries(orders)) {
    if (order.user_id === userUid) {
      recentOrders.push([orderId, order]);
    }
  }
  return recentOrders;
}

  // BULK

  export async function getWashableItems() {
    const washableItemsRef = ref(db, 'washable_items')
    const washableItems = await (await get(washableItemsRef)).val();
    // return Object.values(washableItems); // returns only values
    return Object.entries(washableItems); // [key, value] parang property pero array
  }
  
  export async function getServices() {
    const serviceTypesRef = ref(db, 'service_types')
    const serviceTypes = await (await get(serviceTypesRef)).val();
    // return Object.values(serviceTypes);
    return Object.entries(serviceTypes);
  }
  export async function getOrders() { // eto nalang din sa Schedule Management
    const ordersRef = ref(db, 'orders')
    const orders = await (await get(ordersRef)).val();
    // return Object.values(serviceTypes);
    return Object.entries(orders);
  }
  export async function getInventory() { // eto nalang din sa Schedule Management
    const inventoryRef = ref(db, 'inventory_items')
    const inventory = await (await get(inventoryRef)).val();
    // return Object.values(serviceTypes);
    return Object.entries(inventory);
  }
  export async function getUsers() { // eto nalang din sa Schedule Management
    const usersRef = ref(db, 'users')
    const users = await (await get(usersRef)).val();
    // return Object.values(serviceTypes);
    return Object.entries(users);
  }
  
  export async function getServiceUid(serviceName) {
    const servicesRef = ref(db, 'service_types');
    const services = await (await get(servicesRef)).val();
    const servicesArray = Object.entries(services);
    console.log(serviceName);
    for(let i = 0; i < servicesArray.length; i++){
      console.log(servicesArray[i][1]);
      if(servicesArray[i][1].service_name == serviceName){
        return servicesArray[i][0];
      }
    }

    return -1;
  }
  export async function getWashableUid(washableName) {
    const washableRef = ref(db, 'washable_items');
    const washables = await (await get(washableRef)).val();
    const washablesArray = Object.entries(washables);
    console.log(washable_item_name);
    for(let i = 0; i < washablesArray.length; i++){
      console.log(washablesArray[i][1]);
      if(washablesArray[i][1].washable_item_name == washableName){
        return washablesArray[i][0];
      }
    }

    return -1;
  }