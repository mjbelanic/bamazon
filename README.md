*BAMAZON*

*Introduction*

This project is a basic simulation of Amazon shopping and database management. This was completed using Node.JS for both front-end and back-end functionality and MySQL database to hold data. There are three primary functions of the application: customer, manager, and supervisor. Each role has different options and actions they can take.

*Resources used:*
Node.JS
MySQL
NPM Inquirer
NPM MySQL
NPM cli-table

*MySQL Tables*

MySQL database consists of two tables: products and departments. The products table provides an overview of the information about products the store sells including product name, the department it is in and the product's price. The department table provides information on the specific departments which sells each product. This table includes information like the departments name and its overhead cost.

*Bamazon Customer*

When Bamazon Customer is called using node bamazonCustomer.js , the program begins by creating a connection to the MySQL database that matches the information provided in the createConntection function. Once the connection has been created, the first call to the database is made to retrieve the list of products stored in the products table of the database. To log these to the terminal, a for loop iterates through the results that are returned.

![Alt text](/relative/path/to/img.jpg?raw=true "Optional Title")
![Products displayed in terminal window](./BAMAZON/bamazonCustomer-image1.png?raw=true)

Once the results have been displayed, an inquirer prompt appears asking the usser for the id of the product they wish to purchase. Another prompt appears once this value has been entered asking for the total number they wish to purchase.

After both of those prompts have been completed the stock quantity of the product the user wants to purchase is checked, if the customer's demand is greater than the stock remaining, an error message appears and the program is exited. If there are enough of the product in store to fullfill the customer's order, these items are put in an object called orderInformation using a constructor.

A final prompt to confirm the order is presented to  user. If the user does not confirm, the process restarts. If the user does confirm, then another call to the database is made to update the product's quantity and sales. 

*Bamazon Manager*

The bamazon manager has multiple functions it can call. When the program starts a connection to the MySQL database is made and an inquirer prompt asks the user what they want to do using a list type question with the options: "View Products for Sale", "View Low Inventory", "Add to inventory", and "Add New Product". 

When the user selects "View Products for Sale", a query is made through the connection that returns a list of all the products that are currently being sold in the Bamazon store.

If "View Low Inventory" is selected, another query is made. However this query contains the where clause: "WHERE stock_quantity <= 5". This means that only items that have a stock of 5 or less will be returned in the results.

When the user selects "Add to Inventory", a new function is called within the program. This function begins by prompting the user with two questions. The first question seeks to get the Id of the product they wish to add more stock to and the second question asks how much stock they would like to add. If the user enters appropriate information (Example: Ids that don't exists or a stock that is negative), then an update query will be made to the database and the stock quantity will be increased by the amount specified by the second prompt.

If "Add New Product" is chosen by the user, a new function is also called within the program. This function works similar to the function found in the "Add to Inventory" workflow. First a series of questions are prompted to the user to get more information about the product that is being added to the product table. Once all this information has been entered, a insertion query is made by Node to the MySQL database to insert the user entered data into the product table. Since the id for the product is set to auto increment in the database, the user does not need to enter or worry about this value as it will be taken care of by the database.

*Bamazon Supervisor*

The bamazon supervisor functions similarly to the bamazon manager, however the supervisor only has two options: "View Product Sales by Department" and "Create New Department".

By choosing "View Product Sales by Department", the user is presented a table of sales information. This table is created using the NPM cli-table library. The table object is essentially an array that gets data from the results of the query and pushes information to the end of the array.

The query to complete this function is more complex than all the other queries used in this project since it requires information from both tables as well as requiring one column to be subtracted from the other to fill in data for a third column. This table uses a join and aliases to be created. 

"Create New Department" asks the user several questions about the department they want to create. Once these questions have been answered, a insert query is completed through the connection. 
