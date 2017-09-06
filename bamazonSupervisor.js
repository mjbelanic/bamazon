var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require("cli-table");

var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'test',
    database: 'bamazon_db'
});

inquirer.prompt([
    {
        type: "list",
        message: "What would you like to do?",
        choices: ["View Product Sales by Department","Create New Department"],
        name: "selection"
    }
]).then(function(response){
    if(response.selection === "View Product Sales by Department"){
        viewProductSales();
    }else{
        createDepartment();
    }
})

function viewProductSales(){
    connection.query("SELECT departments.*, sum(products.product_sales) AS productSales, "+
    "sum(products.product_sales) - departments.over_head_costs AS totalProfits FROM departments "+ 
    "JOIN products ON departments.department_name = products.department_name GROUP BY department_name;",
    function(err,results, fields){
        if(err){
            throw err;
        }else{
            var table = new Table({
                head: ['Department ID','Department Name', 'Over Head Costs', 'Product Sales', 'Total Profit']
            });
            for(var i = 0; i < results.length; i++){
                table.push([results[i].department_id , results[i].department_name , results[i].over_head_costs, results[i].productSales, results[i].totalProfits]);
            }
            console.log(table.toString());
        }
    })
    connection.end();
}


function createDepartment(){
    inquirer.prompt([
        {
            type: "input",
            message: "What is the name of the new department?",
            name: "departmentName"
        },
        {
            type: "input",
            message: "What is the average over head cost of this department?",
            name: "overHeadCost"
        }
    ]).then(function(response){
        if(response.departmentName === "" || response.overHeadCost === ""){
            console.log("You did not enter an appropriate value.");
        }else{
            connection.query("INSERT INTO departments SET ?", {
                department_name: response.departmentName,
                over_head_costs: response.overHeadCost
            }, function(err){
                if(err){
                    throw err;
                }else{
                    console.log("New department has been added to store.")
                }
            });
            connection.end();
        }
    });
}