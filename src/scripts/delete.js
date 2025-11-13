import { ref, remove } from 'firebase/database';
import { db } from '../firebase';

export async function deleteOrder(orderUid) {
  const orderRef = ref(db, `orders/${orderUid}`);
  try {
    await remove(orderRef);
    localStorage.setItem("toastMessage", "Order deletion successful.");
    localStorage.setItem("toastType", "success");
  } catch (error) {
    localStorage.setItem(
      "toastMessage",
      error?.message || "Failed to delete order."
    );
    localStorage.setItem("toastType", "error");
  } finally {
    window.location.reload();
  }
}

export async function deleteUser(userUid) {
  const userRef = ref(db, `users/${userUid}`);

  try {
    await remove(userRef);
    localStorage.setItem("toastMessage", "User deletion successful.");
    localStorage.setItem("toastType", "success");
  } catch (error) {
    localStorage.setItem(
      "toastMessage",
      error?.message || "Failed to delete user."
    );
    localStorage.setItem("toastType", "error");
  } finally {
    window.location.reload();
  }
}

export async function deleteInventory(inventoryUid) {
  const inventoryRef = ref(db, `inventory_items/${inventoryUid}`);

  try {
    await remove(inventoryRef);
    localStorage.setItem("toastMessage", "Inventory deletion successful.");
    localStorage.setItem("toastType", "success");
  } catch (error) {
    localStorage.setItem(
      "toastMessage",
      error?.message || "Failed to delete inventory."
    );
    localStorage.setItem("toastType", "error");
  } finally {
    window.location.reload();
  }
}

export async function deleteService(serviceUid) {
  const serviceRef = ref(db, `service_types/${serviceUid}`);

  try {
    await remove(serviceRef);
    localStorage.setItem("toastMessage", "Service deletion successful.");
    localStorage.setItem("toastType", "success");
  } catch (error) {
    localStorage.setItem(
      "toastMessage",
      error?.message || "Failed to delete service."
    );
    localStorage.setItem("toastType", "error");
  } finally {
    window.location.reload();
  }
}

export async function deleteWashable(washableUid) {
  const washableRef = ref(db, `washable_items/${washableUid}`);

  try {
    await remove(washableRef);
    localStorage.setItem("toastMessage", "Washable item deletion successful.");
    localStorage.setItem("toastType", "success");
  } catch (error) {
    localStorage.setItem(
      "toastMessage",
      error?.message || "Failed to delete washable item."
    );
    localStorage.setItem("toastType", "error");
  } finally {
    window.location.reload();
  }
}
