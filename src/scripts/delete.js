import { ref, remove } from 'firebase/database';
import { db } from '../firebase';

export default async function deleteOrder(orderUid) {
    const orderRef = ref(db, `orders/${orderUid}`);
    await remove(orderRef);
}