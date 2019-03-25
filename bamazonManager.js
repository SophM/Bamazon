// ------------------------------------------------------------------
// Load the packages and files needed for the program to run
// ------------------------------------------------------------------

// load the inquirer node package to be able to get user inputs
var inquirer = require("inquirer");

// load the mysql node package to be able to connect to the Bamazon SQL database
var mysql = require("mysql");

// load the cli-color node package to be able to change the color
// of the text displayed in the terminal
var clc = require("cli-color");

// load the cli-table node package to be able to display table in the terminal
var table = require("cli-table");


// ------------------------------------------------------------------
// Connection to the mySQL database - bamazon_db
// ------------------------------------------------------------------

// create the connection to bamazon_db and store it in a variable
var connection = mysql.createConnection({
    host: "localhost",

    // my port
    port: 3306,

    // my username
    user: "root",

    // my password
    password: "a9uLc2frfg7buEidFA",
    database: "bamazon_db"
});


// ------------------------------------------------------------------
// Variables - color for styling
// ------------------------------------------------------------------

// create variable to store the option for the "manager" menu
var menu = ["View products for sale", "View low inventory", "Add to inventory", "Add new product", "Quit"];

// create a color to display the "goodbye" message with cli-color
var goodbyeMsg = clc.xterm(208);

// create a color to display the "product added" messages
var sucessMsg = clc.xterm(71);


// ------------------------------------------------------------------
// Functions
// ------------------------------------------------------------------

// function to present the option to the manager 
function managerOptions() {
    // ask the customer to enter the ID of the item she/he wants
    inquirer
        .prompt([
            {
                type: "rawlist",
                message: "What would you like to do?",
                choices: menu,
                name: "managerChoice"
            }
        // then run the following
        ]).then(function (answer) {
            // if the manager chose "View products on sale"
            if (answer.managerChoice === menu[0]) {
                // display message - inventory
                console.log(clc.blue.bold("-----------------------------------"));
                console.log(clc.blue.bold("Here is the complete inventory"));
                console.log(clc.blue.bold("-----------------------------------"));
                // show the inventory and ask the manager again what she/he would like to do
                showInventoryAskManager();
            // if the manager chose "View low inventory"
            } else if (answer.managerChoice === menu[1]) {
                // display message - low inventory
                console.log(clc.blue.bold("-----------------------------------"));
                console.log(clc.blue.bold("Here is the inventory showing low-quantity products"));
                console.log(clc.blue.bold("-----------------------------------"));
                // show low inventory and ask the manager again what she/he would like to do
                lowInventory();
            // if the manager chose "Add to inventory"    
            } else if (answer.managerChoice === menu[2]) {

            // if the manager chose "Add new product"      
            } else if (answer.managerChoice === menu[3]) {
                
            // if the customer chose "Quit"
            } else {
               // display a "goodbye" message
               console.log(goodbyeMsg.bold("-----------------------------------"));
               console.log(goodbyeMsg.bold("Goodbye, see you next time!"));
               console.log(goodbyeMsg.bold("-----------------------------------"));
               // end the connection with bamazon_db
               connection.end();             
            }       
        })
}

// function to format nicely the "products" table and add some colors
function showInventory(arr) {
    // instantiate the table
    var productsTable = new table();
    // add the first row = headers - with some styling thanks to cli-color
    productsTable.push([clc.cyan.bold("item_id"), clc.cyan.bold("product_name"), clc.cyan.bold("department_name"), clc.cyan.bold("price"), clc.cyan.bold("stock_quantity")]);
    // add every item to the table
    for (var i = 0; i < arr.length; i++) {
        productsTable.push(
            [arr[i].item_id, arr[i].product_name, arr[i].department_name, arr[i].price, arr[i].stock_quantity],
        )
    }
    // display the table
    console.log(productsTable.toString());
}

// function to diplay the "products" table to the manager = the inventory = products on sale
function showInventoryAskManager() {
    // connect to the database to do a request
    connection.query(
        // select the entire "products" table
        "SELECT * FROM products",
        // then run the following
        function (err, res) {
            // if error(s), display it(them)
            if (err) throw err;
            // show the "products" table in a nice table
            showInventory(res);
            // ask the manager what she/he would like to do
            managerOptions();
        }
    )
}

// function to display the products with low quantity in stock
function lowInventory() {
    // connect to the database to do a request
    connection.query(
        // select the entire "products" table where stock_quantity is below 5
        "SELECT * FROM products WHERE stock_quantity < 5",
        // then run the following
        function (err, res) {
            // if error(s), display it(them)
            if (err) throw err;
            // show the "products" table in a nice table
            showInventory(res);
            // ask the manager what she/he would like to do
            managerOptions();
        }
    )

}

// function to add more item for one of the product
function updateInventory(item_wanted, quantity_wanted) {
    // connect to the database to do a request
    connection.query(
        // grab the quantity in stock and the name of the product for the item wanted
        "SELECT stock_quantity, product_name FROM products WHERE ?",
        {
            item_id: parseInt(item_wanted),
        },
        // then run the following
        function (err, res) {
            // if error(s), display it(them)
            if (err) throw err;
            // if the quantity wanted is superior to the quantity in stock
            if (quantity_wanted > res[0].stock_quantity) {
                // display message - stocks too low
                console.log(warningMsg.bold("-----------------------------------"));
                console.log(warningMsg.bold("Sorry, we don't have that many in stock!"));
                console.log(warningMsg.bold("-----------------------------------"));
                // show the inventory and ask the customer again if she/he wants to buy something
                showInventoryAskCustomerItem();
                // if the quantity in stock is enough
            } else {
                // display message  - successful transaction
                console.log(sucessMsg.bold("-----------------------------------"));
                console.log(sucessMsg.bold("Successful transaction! You just purchased " + quantity_wanted + " " + res[0].product_name + "(s)."));
                console.log(sucessMsg.bold("-----------------------------------"));
                // connect to the database to do a request
                connection.query(
                    // update the quantity in stock for the item wanted
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: res[0].stock_quantity - parseInt(quantity_wanted)
                        },
                        {
                            item_id: item_wanted
                        }
                    ],
                    // then run the following
                    function (err, res) {
                        // if error(s), display it(them)
                        if (err) throw err;
                    }
                )
                // show the updated inventory and ask the customer which item she/he wants to buy
                showInventoryAskCustomerItem();
            }
        }
    )
}


// ------------------------------------------------------------------
// Main process
// ------------------------------------------------------------------

// welcome the user - message displayed in color with cli-color
console.log(clc.magenta.bold("-----------------------------------"));
console.log(clc.magenta.bold("Welcome in the Bamazon manager's space!"));
console.log(clc.magenta.bold("-----------------------------------"));

// open the connection to bamazon_db and run the following
connection.connect(function (err) {
    // if error(s), display it(them)
    if (err) throw err;
    // verify that we are connected
    // console.log("connected as id " + connection.threadId);
    // run the managerOptions() funcion once the connection has been established
    managerOptions();
});