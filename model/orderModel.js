import {orderDetailArray} from '../db/DB.js';
import { orderItemsArray } from '../db/DB.js';

export const orderModel = {
    saveOrder,getAllOrderDetail,saveOrderItems,getOrderItem,getOrderCount
};

function saveOrder(orderDetails){
    orderDetailArray.push(orderDetails);
    console.log(orderDetailArray);
}

function saveOrderItems(orderItems){
    orderItemsArray.push(orderItems);
    console.log(orderItemsArray);
}

function getAllOrderDetail(orderId){
   const orders =  orderDetailArray.find(order => order.orderId === orderId);
   return orders;
}

function getOrderItem(orderId){
    const items = orderItemsArray.filter(item => item.orderId === orderId );
    return items;
}

function getOrderCount(){
    return orderDetailArray.length;
}