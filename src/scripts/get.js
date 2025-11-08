
import { child, get, ref } from 'firebase/database'
import { db } from './firebase'

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
    
    console.log(washableItem);
    return washableItem.washable_item_name;
  }
  
  export async function getItemPerKg(washableItemId) {
    const washableItemsRef = ref(db, 'washable_items');
    const washableItemRef = child(washableItemsRef, washableItemId);
    const washableItem = await (await get(washableItemRef)).val();
    
    console.log("price "+washableItem.item_per_kilo);
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


  // BULK

  export async function getWashableItems() {
    const washableItemsRef = ref(db, 'washable_items')
    const washableItems = await (await get(washableItemsRef)).val();
    console.log(Object.entries(washableItems));
    // return Object.values(washableItems); // returns only values
    return Object.entries(washableItems); // [key, value] parang property pero array
  }
  
  export async function getServices() {
    const serviceTypesRef = ref(db, 'service_types')
    const serviceTypes = await (await get(serviceTypesRef)).val();
    console.log(Object.entries(serviceTypes));
    // return Object.values(serviceTypes);
    return Object.entries(serviceTypes);
  }
  export async function getOrders() { // eto nalang din sa Schedule Management
    const ordersRef = ref(db, 'orders')
    const orders = await (await get(ordersRef)).val();
    console.log(Object.entries(orders));
    // return Object.values(serviceTypes);
    return Object.entries(orders);
  }
  export async function getInventory() { // eto nalang din sa Schedule Management
    const inventoryRef = ref(db, 'inventory_items')
    const inventory = await (await get(inventoryRef)).val();
    console.log(Object.entries(inventory));
    // return Object.values(serviceTypes);
    return Object.entries(inventory);
  }