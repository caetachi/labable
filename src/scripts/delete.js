import { ref, remove } from 'firebase/database';
import { db } from '../firebase';

export default async function deleteOrder(orderUid) {
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
