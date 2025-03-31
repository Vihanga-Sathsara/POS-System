import {itemArray} from '../db/DB.js';

export const itemModel = {
    saveItem,removeItem,updateItem,getAllItem,getAllItems,reduceQty,getAllItemsCount
};

function saveItem(item){
    itemArray.push(item);
}

function removeItem(code){
    const index = itemArray.findIndex(item => item.itemCode === code);
    itemArray.splice(index,1);
}

function updateItem(code,updateItemDetail){
    let index = itemArray.findIndex(item => item.itemCode === code);
    itemArray[index] = updateItemDetail;
}

function getAllItem(itemId){
   const item =  itemArray.find(item => item.itemCode === itemId);
   return item;
}

function getAllItems(){
    return itemArray;
}

function reduceQty(itemId,orderQty){
    const item = itemArray.find(item => item.itemCode === itemId );
    return item.itemQty = item.itemQty - orderQty;
}

function getAllItemsCount(){
    return itemArray.length;
}