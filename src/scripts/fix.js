import { child, ref, set, update } from 'firebase/database'
import { auth, db } from '../firebase'
import { getOrders } from './get'

export async function fixCancelled() {
    const ordersRef = ref(db, 'orders');
    const orders = await getOrders();
    for(let i = 0; i < orders.length; i++){
        console.log(orders[i][1].status);
        if(orders[i][1].status == 'Canceled'){
            const orderRef = child(ordersRef, orders[i][0]);
            await update(orderRef, {status: "Cancelled"})
            console.log('updated cancelled');
        }
    }
}