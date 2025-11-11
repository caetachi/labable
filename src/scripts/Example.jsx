import { onValue, ref } from 'firebase/database'
import { db } from '../firebase'
import { useEffect } from 'react';
import {registerViaEmailPass, registerViaGoogle} from './register'
import {newServiceType, newWashableItem, newOrder, newInventory, newPayment} from './create'
import {getServiceName, getWashableItems, getServices, getOrders, getUsers, getInventory, getOrder, getWashableItemName} from './get'
import {updateUser, updateWashableItem, updateServiceType, updateInventoryItem, updateOrderDetails, updateScheduleDetails} from './update'
import {loginViaEmailAndPassword} from './login'

export default function Example() {

  const sampleService = '-OdX3nh0a9J6O0zbrIFJ'
  const sampleWashable = '-OdX3psxP95xMk9EotbG'
  const sampleOrder = '-OdX4Ktcl8U3BVW9LBRY'
  const sampleInventory = '-OdX4gK0hByeC-87OEcn'
  let orders = [{
     itemUid: sampleWashable, 
     quantity: 6
    },
     {
     itemUid: sampleWashable,
     quantity: 9
    }];
  let services = ['Wash', 'Dry', 'Fold'
    // , 'Iron'
  ];

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
      <div className="sample-buttons" style={{display: "flex", marginTop: "100px", flexWrap: "wrap", gap: "10px", width: "100"}}>
        <button onClick={()=>registerViaGoogle()}>Register via Google</button>
        <button onClick={()=>registerViaEmailPass('janrei@gmail.com', 'hakdog321')}>Register via Email and Password</button>
        <button onClick={()=>newServiceType('Student Pack', services, 'a tailored laundry solution designed specifically for students, offering convenience and affordability for their busy lifestyles.', 40.00, 'https://mega.nz/file/K9AzzS6S#LolJn0WV0RQM44QB4P-raLIH3qzyETORwV5aXv9iqoc')}>New Service Type</button>
        <button onClick={()=>newWashableItem('T-Shirt', 10.00, null)}>New Washable Item</button>
        <button onClick={()=>newOrder(sampleService, 'address', 'paymentMethod', 'Pick-up', 'transferDate', 'arrivalDate', 'claimMode', 'note', orders)}>New Order</button>
        <button onClick={()=>newInventory('Detergent - Standard', 50, 'Pieces', 'available')}>New Inventory</button>
        <button onClick={()=>newPayment(sampleOrder, 'amount', 'completed')}>New Payment</button>
        <button onClick={()=>getServiceName(sampleService)}>Get Service Name</button>
        <button onClick={()=>getWashableItemName(sampleWashable)}>Get Washable Name</button>
        <button onClick={()=>getWashableItems()}>Get Washables</button>
        <button onClick={()=>getServices()}>Get Services</button>
        <button onClick={()=>getOrders()}>Get Orders</button>
        <button onClick={()=>getUsers()}>Get Users</button>
        <button onClick={()=>getInventory()}>Get Inventory</button>
        <button onClick={()=>getOrder(sampleOrder)}>Get Order</button>
        <button onClick={()=>updateUser('janrei@gmail.com', 'Jan Rei', '09166239747', 'Paombong', null)}>Update User</button>
        <button onClick={()=>updateWashableItem(sampleWashable, 'Brief', 15)}>Update Washable</button>
        <button onClick={()=>updateServiceType(sampleService, "Laba lang", "Wet na sya pagbalik", 50)}>Update Service</button>
        <button onClick={()=>updateInventoryItem(sampleInventory, 'Shampoo', 25, 'Butas yung iba', 'sachets', 'kahapon')}>Update Inventory</button>
        <button onClick={()=>updateOrderDetails(sampleOrder, 'DaddyJiAr', 'BSU Pimentel', '-OdNo8KTaHyu41HpRROD', 'Laba lang', 'Cash', 280, orders, 'afk', 'tapon', 'pulot', 'ngayon', 'bukas ng hapon', 'dikolam', 'kingina daming parameter neto')}>Update Order</button>
        <button onClick={()=>updateScheduleDetails(sampleOrder, 'PapaJiAr', 'BSU E-Lib', 'Online', 'Deliver', 'Yesterday morning')}>Update Schedule</button>
        <button onClick={()=> exampleGet()}>Example Get</button>
        <button onClick={()=> loginViaEmailAndPassword('janrei@gmail.com', 'hakdog321')}>Login</button>
      </div>
    </>
  )
}

