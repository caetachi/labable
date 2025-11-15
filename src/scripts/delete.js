import { child, ref, remove } from 'firebase/database';
import { db } from '../firebase';
import { getOrders } from './get';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export async function deleteOrder(orderUid) {
  const orderRef = ref(db, `orders/${orderUid}`);
  try {
    await remove(orderRef);
    toast.success("Order deletion successful");
    localStorage.setItem("toastType", "success");
  } catch (error) {
    localStorage.setItem(
      "toastMessage",
      error?.message || "Failed to delete order."
    );
    localStorage.setItem("toastType", "error");
  }
}

export async function deleteUser(userUid) {
  const userRef = ref(db, `users/${userUid}`);

  try {
    await remove(userRef);
    toast.success("User deletion successful");
  } catch (error) {
    localStorage.setItem(
      "toastMessage",
      error?.message || "Failed to delete user."
    );
    localStorage.setItem("toastType", "error");
  }
}

export async function deleteInventory(inventoryUid) {
  const inventoryRef = ref(db, `inventory_items/${inventoryUid}`);

  try {
    await remove(inventoryRef);
    toast.success("Service deletion successful");
  } catch (error) {
    localStorage.setItem(
      "toastMessage",
      error?.message || "Failed to delete inventory."
    );
    localStorage.setItem("toastType", "error");
  } 
}

export async function deleteService(serviceUid) {
  const serviceRef = ref(db, `service_types/${serviceUid}`);

  try {
    await remove(serviceRef);
    toast.success("Service deletion successful");
  } catch (error) {
    localStorage.setItem(
      "toastMessage",
      error?.message || "Failed to delete service."
    );
    localStorage.setItem("toastType", "error");
  }
}

export async function deleteWashable(washableUid) {
  const washableRef = ref(db, `washable_items/${washableUid}`);

  try {
    await remove(washableRef);
    toast.success("Washable item deletion successful");
  } catch (error) {
    localStorage.setItem(
      "toastMessage",
      error?.message || "Failed to delete washable item."
    );
    localStorage.setItem("toastType", "error");
    window.location.reload();
  } 
}

export async function deleteSchedulePickup(orderID) {
  const orders = await getOrders();
  let ordersRef = ref(db, 'orders')
  let withoutCounter = [];
  for(let i = 0; i < orders.length; i++){
      if(orders[i][0] != 'orders_counter'){
          withoutCounter.push(orders[i])
      }
  }
  for(let i = 0; i < withoutCounter.length; i++){
    
    if(withoutCounter[i][0] == orderID){
      const orderRef = child(ordersRef, withoutCounter[i][0]);
      const scheduleRef = child(orderRef, 'schedule'); 
      const pickupRef = child(scheduleRef, 'pickup');
      if(pickupRef){
        try {
          await remove(pickupRef);
          console.log('lana');
          
          toast.success("Schedule deletion successful");
        } catch (error) {
          console.log('norem');
          localStorage.setItem(
            "toastMessage",
            error?.message || "Failed to delete schedule."
          );
          localStorage.setItem("toastType", "error");
        }
      }
    }
  }
}




export async function deleteScheduleDelivery(orderID) {
  const orders = await getOrders();
  let ordersRef = ref(db, 'orders')
  let withoutCounter = [];
  for(let i = 0; i < orders.length; i++){
      if(orders[i][0] != 'orders_counter'){
          withoutCounter.push(orders[i])
      }
  }
  for(let i = 0; i < withoutCounter.length; i++){
    
    if(withoutCounter[i][0] == orderID){
      const orderRef = child(ordersRef, withoutCounter[i][0]);
      const scheduleRef = child(orderRef, 'schedule'); 
      const deliverypRef = child(scheduleRef, 'delivery');
      if(deliverypRef){
        try {
          await remove(deliverypRef);
          toast.success("Schedule deletion successful");
        } catch (error) {
          localStorage.setItem(
            "toastMessage",
            error?.message || "Failed to delete schedule."
          );
          localStorage.setItem("toastType", "error");
        } 
      }
    }
  }
}