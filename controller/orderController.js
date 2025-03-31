import {customerModel} from '../model/customerModel.js';
import { itemModel  } from '../model/itemModel.js';
import { orderModel  } from '../model/orderModel.js';

$("document").ready(function() { 
 
    let subtotal = 0;
    let total = 0;
    let balance = 0;
    let productsPrice = 0;
    let tempItemDetail = [];
    getCustomer();
    getItem();

    $('#custDropdown').on("click",function(){
        getCustomer();
    });

    $("#item_Code").on("click",function(){
        getItem();
    });
  
    function getCustomer(){
        const customers = customerModel.getCustomers();
        const customerIds = customers.map(customer => customer.customerID);
        const selecteValue =  $('#custDropdown').val();

        $('#custDropdown').empty().append($('<option/>', { 
            value: '', 
            text: '-Select Customer-',
            disabled: true,
            selected: !selecteValue
        }))
        .append(
            customerIds.map(id => 
                $('<option/>', {
                    value: id,
                    text: `${id}`,
                    selected: id === selecteValue
                })
            )
        );

        $('#custDropdown').val(selecteValue);

        $('#custDropdown').on('change', function() {
            const selectedValue = $(this).val();
            if(selectedValue){
              const customer =  customerModel.getAllCustomer(selectedValue);
               $("#customer_Id").text(selectedValue);
               $("#customer_Name").text(customer.customerName);
               $("#customer_Salary").text(customer.customerSalary);
               $("#customer_address").text(customer.customerAddress);
            }

            $("#customer_Id").css({"border-color": "green", "border-width": "2px"});
            $("#customer_Name").css({"border-color": "green", "border-width": "2px"});
            $("#customer_Salary").css({"border-color": "green", "border-width": "2px"});
            $("#customer_address").css({"border-color": "green", "border-width": "2px"});
        });
    }

    function getItem(){
        const items = itemModel.getAllItems();
        const itemIds = items.map(item => item.itemCode);
        const selectedValue = $('#item_Code').val();
        $('#item_Code').empty().append($('<option/>', { 
            value: '', 
            text: '-Select Item-',
            disabled: true,
            selected:!selectedValue

        }))
        .append(
            itemIds.map(id => 
                $('<option/>', {
                    value: id,
                    text: `${id}`,
                    selected: id === selectedValue
                })
            )
        );

        $('#item_Code').val(selectedValue);

        $('#item_Code').on('change', function() {
            const selecteValue = $(this).val();
            if(selecteValue){
              const item =  itemModel.getAllItem(selecteValue);
               $("#show_itemcode").text(selecteValue);
               $("#show_itemName").text(item.itemName);
               $("#show_itemPrice").text(item.itemPrice);
               $("#show_itemqty").text(item.itemQty);
            }

            $("#show_itemcode").css({"border-color": "green", "border-width": "2px"});
            $("#show_itemName").css({"border-color": "green", "border-width": "2px"});
            $("#show_itemPrice").css({"border-color": "green", "border-width": "2px"});
            $("#show_itemqty").css({"border-color": "green", "border-width": "2px"});
        });
    }

    $("#addItem").on("click",function(event){
        event.preventDefault();

        if(isValidated()){
            let item = {
                itemCode: $("#show_itemcode").text(),
                itemName: $("#show_itemName").text(),
                itemPrice: $("#show_itemPrice").text(),
                itemQty: $("#show_itemqty").text(),
                itemOrderQty: $("#show_orderQty").val()
            };

            const orderQty = Number(item.itemOrderQty);
            const availableQty = Number(item.itemQty);
            const itemPrice = parseFloat(item.itemPrice).toFixed(2);

            if(orderQty > 0 && orderQty <= availableQty){
                productsPrice = orderQty * itemPrice
                total = total + productsPrice;
                $("#Total_Value").contents().first().replaceWith(total.toFixed(2));
                $("#Sub_Value").contents().first().replaceWith(total.toFixed(2));
        
                let newRow = `<tr>
                    <td>${item.itemCode}</td>
                    <td>${item.itemName}</td>
                    <td>${item.itemPrice}</td>
                    <td>${item.itemOrderQty}</td>
                    <td>${productsPrice}</td>
                </tr>`;
                $("#paymentTable tbody").append(newRow);

                tempItemDetail.push({
                    itemId: item.itemCode,
                    itemName: item.itemName,
                    itemPrice: item.itemPrice,
                    itemQty: orderQty,
                    totalPrice: productsPrice.toFixed(2)
                });

            
                $("#show_itemcode").text("");
                $("#show_itemName").text("");
                $("#show_itemPrice").text("");
                $("#show_itemqty").text("");
                $("#show_orderQty").val("");
                $('#item_Code').val("");
            }
        }
    });


    $("#cashValue, #discountValue").on("input", function() {
    
        let payment = {
            cash: parseFloat($("#cashValue").val()) || 0, 
            discount: parseFloat($("#discountValue").val()) || 0
        };
        

        subtotal = total - (total * payment.discount / 100);
        balance = payment.cash - subtotal;
        

        $("#show_balance").val(balance.toFixed(2));  // Display with 2 decimals
        $("#Sub_Value").contents().first().replaceWith(subtotal.toFixed(2));
    });
    
    $("#btn_purchase").on("click",function(event){
        event.preventDefault();

        let orderDetails = {
            orderId: $("#orderId").val(),
            date: $("#date").val(),
            customerID: $("#customer_Id").text(),
            total: parseFloat($("#Total_Value").contents().first().text()).toFixed(2),
            subtotal: parseFloat($("#Sub_Value").contents().first().text()).toFixed(2)
        }

        orderModel.saveOrder(orderDetails);

        tempItemDetail.forEach(item => {
            orderModel.saveOrderItems({
                orderId: orderDetails.orderId,
                itemId: item.itemId,
                itemName: item.itemName,
                itemPrice: item.itemPrice,
                itemQty: item.itemQty,
                totalPrice: item.totalPrice
            });
            
            itemModel.reduceQty(item.itemId, item.itemQty);
        });


        $("#orderCount").text(orderModel.getOrderCount());

        $("#orderId").val("");
        $("#date").val("");
        $("#custDropdown").val("");
        $("#customer_Id").text("");
        $("#customer_Name").text("");
        $("#customer_Salary").text("");
        $("#customer_address").text("");
        $("#Total_Value").contents().first().replaceWith("00.00");
        $("#Sub_Value").contents().first().replaceWith("00.00");
        $("#cashValue").val("");
        $("#discountValue").val("");
        $("#show_balance").val("");
        $("#paymentTable tbody").empty();
        tempItemDetail = [];


    });

    $("#orderId").on("input",function(){
        const orderId = $(this).val();
        const order = orderModel.getAllOrderDetail(orderId);
        console.log(order);
        $("#date").val(order ? order.date : "");
        $('#custDropdown').val(order ? order.customerID : "");
        $('#customer_Id').text(order ? order.customerID : "");
        $("#Total_Value").contents().first().replaceWith(order ? order.total : "00.00");
        $("#Sub_Value").contents().first().replaceWith(order ? order.subtotal : "00.00");

       
            const cust = customerModel.getAllCustomer($("#customer_Id").text());

            $("#customer_Name").text(cust ? cust.customerName : "");
            $("#customer_Salary").text(cust ? cust.customerSalary: "");
            $("#customer_address").text(cust ? cust.customerAddress : "");
        
            
            if(order){

                const items = orderModel.getOrderItem(orderId);

                items.forEach(item => {
                    let newRow = `<tr>
                        <td>${item.itemId}</td>
                        <td>${item.itemName}</td>
                        <td>${item.itemPrice}</td>
                        <td>${item.itemQty}</td>
                        <td>${item.totalPrice}</td>
                    </tr>`;
                    $("#paymentTable tbody").append(newRow);
                });
            }else{
                $("#paymentTable tbody").empty();
            }
    });

    function validateOrderID() {
        let orderID = $("#orderId").val().trim();
        let orderPattern = /^OID-\d{3}$/;

        if (!orderID) {
            $("#orderIDError").text("Order ID Pattern Is : OID-000");
            $("#orderId").css({"border-color": "red", "border-width": "2px"});
            return false;
        } else if (!orderPattern.test(orderID)) {
            $("#orderIDError").text("Invalid format. Pattern should be OID-000");
            $("#orderId").css({"border-color": "red", "border-width": "2px"});
            return false;
        } else {
            $("#orderIDError").text(""); 
            $("#orderId").css({"border-color": "green", "border-width": "2px"});
            return true;
        }
    }

    function validateOrderQty() {
        let orderQty = $("#show_orderQty").val();
        let qtyPattern = /^\d+$/;

        if (!orderQty) {
            $("#orderQtyError").text("Order Item Qty is a required field : Only Numbers");
            $("#show_orderQty").css({"border-color": "red", "border-width": "2px"});
            return false;
        } else if (!qtyPattern.test(orderQty)) {
            $("#orderQtyError").text("Invalid format. Only numbers are allowed");
            $("#show_orderQty").css({"border-color": "red", "border-width": "2px"});
            return false;
        } else {
            $("#orderQtyError").text(""); 
            $("#show_orderQty").css({"border-color": "green", "border-width": "2px"});
            return true;
        }
    }

    function isValidated() {
        let validOrderID = validateOrderID();
        let validOrderQty = validateOrderQty();

        return validOrderID && validOrderQty;
    }

    // Attach event listeners for real-time validation
    $("#orderId").on("input", validateOrderID);
    $("#show_orderQty").on("input", validateOrderQty);

    // Validate on form submission
    $("#orderForm").on("submit", function (e) {
        if (!isValidated()) {
            e.preventDefault(); // Prevent form submission if validation fails
        }
    });
   
});


