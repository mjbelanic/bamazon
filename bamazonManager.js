var inquirer = require("inquirer");
var mysql = require("mysql");

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
    console.log("Connected as: " + connection.threadId + "\n");
    managerSelect();
});

function managerSelect(){
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to inventory", "Add New Product"],
            name: "selection"
        }
    ]).then(function(response){
        if(response.selection === "View Products for Sale"){
            connection.query("SELECT * FROM products", function(err, results, fields){
                if(err){
                    console.log(err)
                }else{
                    for(var i = 0; i < results.length; i++){
                        console.log("Item ID: " + results[i].item_id);
                        console.log("Product Name: " + results[i].product_name);
                        console.log("Department: " + results[i].department_name);
                        console.log("Price: " + results[i].price);
                        console.log("Quantity: " +  results[i].stock_quantity + "\n");        
                    }
                }
            });
            connection.end();
        }
        if(response.selection === "View Low Inventory"){
            connection.query("SELECT * FROM products WHERE stock_quantity <= 5", function(err, results, fields){
                if(err){
                    console.log(err);
                }else{
                    if(results.length === 0){
                        console.log("No products are under a stock of 5.");
                    }else{
                        for(var i = 0; i < results.length; i++){
                            console.log("Item ID: " + results[i].item_id);
                            console.log("Product Name: " + results[i].product_name);
                            console.log("Department: " + results[i].department_name);
                            console.log("Price: " + results[i].price);
                            console.log("Quantity: " +  results[i].stock_quantity + "\n");
                        }
                    }
                }
            });
            connection.end();
        }
        if(response.selection === "Add to inventory"){
            addToInventory();
        }
        if(response.selection === "Add New Product"){
            insertProduct();
        }
    });
}

function addToInventory(){
    inquirer.prompt([
        {
            type: "input",
            message: "What product do you want to add more to? (Use ID)",
            name: "product"
        },
        {
            type: "input",
            message:"How many units would you like to add to stock?",
            name: "unitsAdded"
        }
    ]).then(function(response){
        if(parseInt(response.product) > 0 && parseInt(response.product) <= 10){
            if(response.unitsAdded <= 0){
                console.log("You added 0 or a negative value.");
            }else{
                connection.query("SELECT * FROM products", function(err, results, fields){
                    if(err){
                        console.log(err)
                    }else{
                        connection.query("UPDATE products SET ? WHERE ?", [
                            {stock_quantity: (results[response.product-1]).stock_quantity + parseInt(response.unitsAdded)},
                            {item_id: response.product}
                        ], function(err, results, fields){
                            if(err){
                                console.log(err);
                            }else{
                                console.log("New units added to stock quantity.");
                            }
                            connection.end();
                        });
                    }
                });
            }
        }else{
            console.log("There is no product matching that id value.");
        }
    });
}

function insertProduct(){
    inquirer.prompt([
        {
            type: "input",
            message: "What is the name of the product?",
            name: "productName"
        },
        {
            type: "input",
            message: "What department does this product belong to?",
            name: "departmentName"
        },
        {
            type: "input",
            message: "How much does this item cost? (dd.dd)",
            name: "productPrice"
        },
        {
            type: "input",
            message: "How many units of this product do you have in stock?",
            name: "productStock"
        }
    ]).then(function(response){
        connection.query("INSERT INTO products SET ?", {
            product_name: response.productName,
            department_name: response.departmentName,
            price: response.productPrice,
            stock_quantity: response.productStock
        },function(err){
            if(err){
                throw err;
            }else{
                console.log("Product has been added to store.");
            }
        });
        connection.end();
    })
}