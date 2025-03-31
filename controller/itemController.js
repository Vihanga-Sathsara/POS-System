import {itemModel} from  '../model/itemModel.js';

$("document").ready(function(){
    refreshItemTable();

    $("#add").on("click",function(event){
        event.preventDefault();
        
        if(isValidated()){
            let item = {
                itemCode: $("#itemCode").val(),
                itemName: $("#itemName").val(),
                itemQty: $("#itemQty").val(),
                itemPrice: parseFloat($("#itemPrice").val()).toFixed(2) 
            };
    
            itemModel.saveItem(item);
            $("#itemsCount").text(itemModel.getAllItemsCount());
            let newRow = `<tr>
                <td>${item.itemCode}</td>
                <td>${item.itemName}</td>
                <td>${item.itemQty}</td>
                <td>${item.itemPrice}</td>
            </tr>`;
            $("#itemTable tbody").append(newRow);
    
           
            $("#itemManagement")[0].reset();
        }
    });

    $("#removeItem").on("click",function(event){
        event.preventDefault();
        const selectedRow = $('#itemTable tbody tr.selected-row');
        var itemcells = $(selectedRow).find('td');

        let code = itemcells.eq(0).text();

        if(selectedRow.length){
            itemModel.removeItem(code);
            $("#itemsCount").text(itemModel.getAllItemsCount());
            selectedRow.remove();
            $("#itemManagement")[0].reset();
        }else{
            alert("Please Select the Item to remove");
        }
    });

    $("#updateItem").on("click",function(event){
        event.preventDefault();

        const selectedRow = $('#itemTable tbody tr.selected-row');

        if(selectedRow.length){
            var itemcells = $(selectedRow).find('td');
            let code = itemcells.eq(0).text();

            if(isValidated()){
                let updateItemDetail={
                    itemCode: $("#itemCode").val(),
                    itemName: $("#itemName").val(),
                    itemQty: $("#itemQty").val(),
                    itemPrice: parseFloat($("#itemPrice").val()).toFixed(2) 
                };
    
                itemModel.updateItem(code,updateItemDetail);
    
                itemcells.eq(0).text(updateItemDetail.itemCode);
                itemcells.eq(1).text(updateItemDetail.itemName);
                itemcells.eq(2).text(updateItemDetail.itemQty);
                itemcells.eq(3).text(updateItemDetail.itemPrice);
    
                $("#itemManagement")[0].reset();
            }
           
        }else{
            alert("Please Select the Item to update");
        }
    });

    $("#getAllItem").on("click",function(event){
        event.preventDefault();

        let itemId = $("#itemCode").val().trim();

        if(itemId){
            const item = itemModel.getAllItem(itemId);

            if(item){
                $("#itemName").val(item.itemName);
                $("#itemQty").val(item.itemQty);
                $("#itemPrice").val(item.itemPrice);
            }else{
                alert("Item not found...");
            }
        }else{
            alert("Please Enter Item Code...");
        }

    });

    $("#clearAllItem").on("click",function(event){
        event.preventDefault();
        $("#itemManagement")[0].reset();
    });

    $('#itemTable tbody').on('click', 'tr', function() {
        // Remove highlight from all rows
        $('#itemTable tbody tr').removeClass('selected-row');
        
        // Add highlight to clicked row
        $(this).addClass('selected-row');
        
        // Get data from the clicked row cells
        var cells = $(this).find('td');
        
        // Load data into form fields (matching your actual form IDs)
        $('#itemCode').val(cells.eq(0).text());
        $('#itemName').val(cells.eq(1).text());
        $('#itemQty').val(cells.eq(2).text());
        $('#itemPrice').val(cells.eq(3).text());
    });

    function refreshItemTable() {
        $("#itemTable tbody").empty();
        
            const items = itemModel.getAllItems();
            items.forEach(item => {
                let Row = `<tr>
                <td>${item.itemCode}</td>
                <td>${item.itemName}</td>
                <td>${item.itemQty}</td>
                <td>${item.itemPrice}</td>
            </tr>`;
            $("#itemTable tbody").append(Row);
        });
    }
  
    function validateItemCode() {
        let itemCode = $("#itemCode").val().trim();
        let codePattern = /^I\d{2}-\d{3}$/;

        if (!itemCode) {
            $("#itemCodeError").text("Item Code is a required field : Pattern I00-000");
            $("#itemCode").css({"border-color": "red", "border-width": "2px"});
            return false;
        } else if (!codePattern.test(itemCode)) {
            $("#itemCodeError").text("Invalid format. Pattern should be I00-000");
            $("#itemCode").css({"border-color": "red", "border-width": "2px"});
            return false;
        } else {
            $("#itemCodeError").text(""); 
            $("#itemCode").css({"border-color": "green", "border-width": "2px"});
            return true;
        }
    }

    function validateItemName() {
        let itemName = $("#itemName").val().trim();
        let namePattern = /^[A-Za-z\s]{5,20}$/;

        if (!itemName) {
            $("#itemNameError").text("Item Name is a required field : MiniMum 5, Max 20, Space Allowed");
            $("#itemName").css({"border-color": "red", "border-width": "2px"});
            return false;
        } else if (!namePattern.test(itemName)) {
            $("#itemNameError").text("Invalid format. Name must be 5-20 letters (spaces allowed)");
            $("#itemName").css({"border-color": "red", "border-width": "2px"});
            return false;
        } else {
            $("#itemNameError").text(""); 
            $("#itemName").css({"border-color": "green", "border-width": "2px"});
            return true;
        }
    }

    function validateItemQty() {
        let itemQty = $("#itemQty").val().trim();
        let qtyPattern = /^\d+$/;

        if (!itemQty) {
            $("#itemQtyError").text("Item Qty is a required field : Only Numbers");
            $("#itemQty").css({"border-color": "red", "border-width": "2px"});
            return false;
        } else if (!qtyPattern.test(itemQty)) {
            $("#itemQtyError").text("Invalid format. Only numbers are allowed");
            $("#itemQty").css({"border-color": "red", "border-width": "2px"});
            return false;
        } else {
            $("#itemQtyError").text(""); 
            $("#itemQty").css({"border-color": "green", "border-width": "2px"});
            return true;
        }
    }

    function validateItemPrice() {
        let itemPrice = $("#itemPrice").val().trim();
        let pricePattern = /^\d+(\.\d{1,2})?$/;

        if (!itemPrice) {
            $("#itemPriceError").text("Item Price is a required field : Pattern 100 or 100.00");
            $("#itemPrice").css({"border-color": "red", "border-width": "2px"});
            return false;
        } else if (!pricePattern.test(itemPrice)) {
            $("#itemPriceError").text("Invalid format. Use 100 or 100.00");
            $("#itemPrice").css({"border-color": "red", "border-width": "2px"});
            return false;
        } else if (parseFloat(itemPrice) <= 0) {
            $("#itemPriceError").text("Price must be greater than 0");
            $("#itemPrice").css({"border-color": "red", "border-width": "2px"});
            return false;
        } else {
            $("#itemPriceError").text(""); 
            $("#itemPrice").css({"border-color": "green", "border-width": "2px"});
            return true;
        }
    }

    function isValidated() {
        let validCode = validateItemCode();
        let validName = validateItemName();
        let validQty = validateItemQty();
        let validPrice = validateItemPrice();

        return validCode && validName && validQty && validPrice;
    }

    $("#itemCode").on("input", validateItemCode);
    $("#itemName").on("input", validateItemName);
    $("#itemQty").on("input", validateItemQty);
    $("#itemPrice").on("input", validateItemPrice);

    $("#itemForm").on("submit", function (e) {
        if (!isValidated()) {
            e.preventDefault(); 
        }
    });
    
});