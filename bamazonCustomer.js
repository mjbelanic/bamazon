var inquirer = require("inquirer");
var mysql = require("mysql");
var orderInformation = require("./productInformation");

var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'test',
    database: 'bamazon_db'
});

connection.connect(function(err){
    if(err){
        throw err;
    }
    console.log("connected as: " + connection.threadId + "\n");
})

connection.query("SELECT * FROM products", function(err, results, fields){
    if(err){
        console.log(err.stack);
    }else{
        for(var i = 0; i < results.length; i++){
            console.log("Item ID: " + results[i].item_id);
            console.log("Product Name: " + results[i].product_name);
            console.log("Department: " + results[i].department_name);
            console.log("Price: " + results[i].price);
            console.log("Quantity: " +  results[i].stock_quantity + "\n");
        }
        SelectItem(results);
    }
});


function SelectItem(results){
    inquirer.prompt([
        {
            type:"input",
            message: "Please select the item you would like to purchase.",
            name: "product"
        },
        {
            type: "input",
            message: "How many of this item would you like to purchase?",
            name: "quantity"
        }
    ]).then(function(response){
        customerItemId = response.product -1;
        if(parseInt(customerItemId) > 0 && parseInt(customerItemId) < results.length){
            if(parseInt(response.quantity) > 0 && parseInt(response.quantity) <= results[customerItemId].stock_quantity){
                var orderTotal = parseInt(response.quantity) * results[customerItemId].price;
                customerOrder = new orderInformation(response.product, results[customerItemId].product_name, results[customerItemId].price, response.quantity,orderTotal);
                confirmOrder(customerOrder, results);
            }else{
                console.log("Quantity entered is either larger than what is in stock, 0, or negative.");
                SelectItem(results);
            }
        }else{
            console.log("You did not enter an appropriate product number. Please try again.");
            SelectItem(results);
        }
    })
}

function confirmOrder(customerOrder, results){
    console.log("The following is your order: ")
    console.log("Item Id: " + customerOrder.itemId);
    console.log("Product: " + customerOrder.productName);
    console.log("Price: " + customerOrder.itemPrice);
    console.log("Quantity: " +customerOrder.quantity);
    console.log("Total: " +customerOrder.total);
    inquirer.prompt([
        {
            type: 'confirm',
            message: "Is this correct?",
            name: "orderConfirm"
        }
    ]).then(function(response){
        if(response.orderConfirm === true){

            connection.query("UPDATE products SET ?, ? where ?", [
                {stock_quantity: results[customerOrder.itemId -1].stock_quantity - customerOrder.quantity},
                {product_sales: results[customerOrder.itemId -1].product_sales + customerOrder.total},
                {item_id: customerOrder.itemId}
            ],function(err){
                if(err){
                    console.log(err.stack);
                }else{
                    console.log("Thank you for your purchase!");
                }
            });
            connection.end();
        }else{
            console.log("Sorry about that. Let's try that again then.")
            SelectItem(results);
        }
    })    
}