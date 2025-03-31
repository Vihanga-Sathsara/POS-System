import {customerArray} from '../db/DB.js';

export const customerModel = {
    saveCustomer,removeCustomer,updateCustomer,getAllCustomer,getCustomers,getCustomerCount
};

function saveCustomer(customer){
    customerArray.push(customer);
}

function removeCustomer(id){
    const index = customerArray.findIndex(c => c.customerID === id);
    customerArray.splice(index, 1); // Removes 1 element at position 'index'
}

function updateCustomer(id,updatedCustomer){
    const index = customerArray.findIndex(c => c.customerID === id);
    customerArray[index] = updatedCustomer;
}

function getAllCustomer(custId){
    const customer = customerArray.find(c => c.customerID === custId);
    return customer;
}

function getCustomers() {
    return customerArray;
}

function getCustomerCount(){
    return customerArray.length;
}
