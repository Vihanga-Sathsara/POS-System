import {customerModel} from '../model/customerModel.js';

$("document").ready(function(){
    
        $("#save").on("click",function(event){
            event.preventDefault();

            if(isValidated()){
                let customer = {
                    customerID: $("#customerID").val(),
                    customerName: $("#customerName").val(),
                    customerAddress: $("#customerAddress").val(),
                    customerSalary: parseFloat($("#customerSalary").val()).toFixed(2)
                };
                customerModel.saveCustomer(customer);
                $("#customerCount").text(customerModel.getCustomerCount());
                let newRow = `<tr>
                    <td>${customer.customerID}</td>
                    <td>${customer.customerName}</td>
                    <td>${customer.customerAddress}</td>
                    <td>${customer.customerSalary}</td>
                </tr>`;
                $("#customerTable tbody").append(newRow);
                
                $("#customerRegistration")[0].reset();
            }
        });

        $("#remove").on("click",function(event){
            event.preventDefault();
            const selectedRow = $('#customerTable tbody tr.selected-row');
            var cells = $(selectedRow).find('td');

            let id =  cells.eq(0).text();

            if (selectedRow.length) {
                customerModel.removeCustomer(id);
                $("#customerCount").text(customerModel.getCustomerCount());
                selectedRow.remove();
                $("#customerRegistration")[0].reset();
            } else {
                alert("Please select a customer to remove");
            }
        });

        $("#update").on("click",function(event){
            event.preventDefault();

            const selectedRow = $('#customerTable tbody tr.selected-row');

            if(selectedRow.length){
                var cells = $(selectedRow).find('td');

                let id =  cells.eq(0).text();

                if(isValidated()){
                    let updatedCustomer = {
                        customerID: $("#customerID").val(),
                        customerName: $("#customerName").val(),
                        customerAddress: $("#customerAddress").val(),
                        customerSalary: parseFloat($("#customerSalary").val()).toFixed(2)
                    };
    
                    customerModel.updateCustomer(id,updatedCustomer);
    
                    cells.eq(0).text(updatedCustomer.customerID);
                    cells.eq(1).text(updatedCustomer.customerName);
                    cells.eq(2).text(updatedCustomer.customerAddress);
                    cells.eq(3).text(updatedCustomer.customerSalary);
    
                    $("#customerRegistration")[0].reset();
                }
                
            }else{
                alert("Please Select the Customer to update");
            }  

        });

        $("#getAll").on("click",function(event){
            event.preventDefault();

            let custId = $("#customerID").val().trim(); //trim() use for Removes any leading or trailing whitespace from the value

            if(custId){
                const customer = customerModel.getAllCustomer(custId);

                if(customer){
                    $("#customerName").val(customer.customerName);
                    $("#customerAddress").val(customer.customerAddress);
                    $("#customerSalary").val(customer.customerSalary);
                }else{
                    alert("Customer not found...");
                }
               
            }else{
                alert("Please Enter Customer ID...");
            }

        });

        $("#clearAll").on("click",function(event){
            event.preventDefault();
            $("#customerRegistration")[0].reset();
        });
      
        
        $('#customerTable tbody').on('click', 'tr', function() {
                // Remove highlight from all rows
                $('#customerTable tbody tr').removeClass('selected-row');
                
                // Add highlight to clicked row
                $(this).addClass('selected-row');
                
                // Get data from the clicked row cells
                var cells = $(this).find('td');
                
                // Load data into form fields (matching your actual form IDs)
                $('#customerID').val(cells.eq(0).text());
                $('#customerName').val(cells.eq(1).text());
                $('#customerAddress').val(cells.eq(2).text());
                $('#customerSalary').val(cells.eq(3).text());
        });

        $("#customerID").on("input", function() {
            if (!isValidated()) {  
                $("#customerID").css("border-color", "red");
            } else {  
                $("#customerID").css("border-color", "");
            }
        });


            function validateCustomerID() {
                let custId = $("#customerID").val().trim();
                let idPattern = /^C\d{2}-\d{3}$/;
        
                $("#customerID").css({"border-color": "", "border-width": ""});
                if (!custId) {
                    $("#custIdError").text("Customer ID is a required field");
                    $("#customerID").css({"border-color": "red", "border-width": "2px"});
                    return false;
                } else if (!idPattern.test(custId)) {
                    $("#custIdError").text("Invalid format. Pattern should be C00-000");
                    $("#customerID").css({"border-color": "red", "border-width": "2px"});
                    return false;
                } else {
                    $("#custIdError").text(""); 
                    $("#customerID").css({"border-color": "green", "border-width": "2px"});
                    return true;
                }
            }
        
            function validateCustomerName() {
                let custName = $("#customerName").val().trim();
                let namePattern = /^[A-Za-z\s]{5,20}$/;
        
                $("#customerName").css({"border-color": "", "border-width": ""});
                if (!custName) {
                    $("#custNameError").text("Customer Name is a required field");
                    $("#customerName").css({"border-color": "red", "border-width": "2px"});
                    return false;
                } else if (!namePattern.test(custName)) {
                    $("#custNameError").text("Name must be 5-20 characters (letters and spaces only)");
                    $("#customerName").css({"border-color": "red", "border-width": "2px"});
                    return false;
                } else {
                    $("#custNameError").text(""); 
                    $("#customerName").css({"border-color": "green", "border-width": "2px"});
                    return true;
                }
            }
        
            function validateCustomerAddress() {
                let custAddress = $("#customerAddress").val().trim();
                let addressPattern = /^.{7,}$/;
        
                $("#customerAddress").css({"border-color": "", "border-width": ""});
                if (!custAddress) {
                    $("#custAddressError").text("Customer Address is a required field");
                    $("#customerAddress").css({"border-color": "red", "border-width": "2px"});
                    return false;
                } else if (!addressPattern.test(custAddress)) {
                    $("#custAddressError").text("Address must be at least 7 characters long");
                    $("#customerAddress").css({"border-color": "red", "border-width": "2px"});
                    return false;
                } else {
                    $("#custAddressError").text(""); 
                    $("#customerAddress").css({"border-color": "green", "border-width": "2px"});
                    return true;
                }
            }
        
            function validateCustomerSalary() {
                let custSalary = $("#customerSalary").val().trim();
                let salaryPattern = /^\d+(\.\d{1,2})?$/;
        
                $("#customerSalary").css({"border-color": "", "border-width": ""});
                if (!custSalary) {
                    $("#custSalaryError").text("Customer Salary is a required field");
                    $("#customerSalary").css({"border-color": "red", "border-width": "2px"});
                    return false;
                } else if (!salaryPattern.test(custSalary)) {
                    $("#custSalaryError").text("Invalid format. Use 100 or 100.00");
                    $("#customerSalary").css({"border-color": "red", "border-width": "2px"});
                    return false;
                } else if (parseFloat(custSalary) <= 0) {
                    $("#custSalaryError").text("Salary must be greater than 0");
                    $("#customerSalary").css({"border-color": "red", "border-width": "2px"});
                    return false;
                } else {
                    $("#custSalaryError").text(""); 
                    $("#customerSalary").css({"border-color": "green", "border-width": "2px"});
                    return true;
                }
            }
        
            function isValidated() {
                let validId = validateCustomerID();
                let validName = validateCustomerName();
                let validAddress = validateCustomerAddress();
                let validSalary = validateCustomerSalary();
        
                return validId && validName && validAddress && validSalary;
            }
        
          
            $("#customerID").on("input", validateCustomerID);
            $("#customerName").on("input", validateCustomerName);
            $("#customerAddress").on("input", validateCustomerAddress);
            $("#customerSalary").on("input", validateCustomerSalary);
        
           
            $("#customerForm").on("submit", function (e) {
                if (!isValidated()) {
                    e.preventDefault(); 
                }
            });
        
        
});
