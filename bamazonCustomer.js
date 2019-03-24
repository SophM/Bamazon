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
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "a9uLc2frfg7buEidFA",
    database: "bamazon_db"
});


// ------------------------------------------------------------------
// Functions
// ------------------------------------------------------------------

// create a color to display the "goodbye" message with cli-color
var goodbyeMsg = clc.xterm(208);

// create a color to display the "transaction" messages - too low quantity or successful transaction
var sucessMsg = clc.xterm(71);
var tooLowMsg = clc.xterm(160);


// ------------------------------------------------------------------
// Functions
// ------------------------------------------------------------------

// function to format nicely the "products" table and add some colors
function showInventory(arr) {
    // instantiate the table
    var productsTable = new table();
    // add the first row = headers - with some styling thanks to cli-color
    productsTable.push([clc.cyan.bold("item_id"), clc.cyan.bold("product_name"), clc.cyan.bold("department_name"), clc.cyan.bold("price"), clc.cyan.bold("stock_quantity")]);
    // add value to the table
    for (var i = 0; i < arr.length; i++) {
        productsTable.push(
            [arr[i].item_id, arr[i].product_name, arr[i].department_name, arr[i].price, arr[i].stock_quantity],
        )
    }
    // display the table
    console.log(productsTable.toString());
}

// function to diplay the "products" table to the cutomer = our inventory
// and ask if she/he want to buy something
function showInventoryAskCustomer() {
    // connect to the database to do a request
    connection.query(
        // select the entire "products" table
        "SELECT * FROM products",
        function (err, res) {
            // if error(s), display it(them)
            if (err) throw err;
            // show the "products" table in a nice table
            showInventory(res);
            // ask the customer if she/he wants to buy something
            askCustomer();  
        }
    )
}

// function to ask the customer if she/he wants to buy an item
function askCustomer() {
    // ask the customer to enter the ID of the item she/he wants
    inquirer
        .prompt([
            {
                type: "input",
                message: "Which item would you like to purchase ? Enter its ID [Quit with Q]",
                name: "customerChoice"
            }
        ]).then (function(item) {
            // if the customer entered "Q"
            if(item.customerChoice.toLowerCase() === "q") {
                // display a "goodbye" message
                console.log(goodbyeMsg.bold("-----------------------------------"));
                console.log(goodbyeMsg.bold("Goodbye, see you next time!"));
                console.log(goodbyeMsg.bold("-----------------------------------"));
                // end the connection with bamazon_db
                connection.end();
            // if the customer enter an ID
            } else {
                // ask for how many she/he wants
                inquirer
                    .prompt([
                        {
                            type: "input",
                            message: "How many would you like to buy? [Quit with Q]",
                            name: "customerQuantity"
                        }
                    ]).then(function(quantity) {
                        // if the customer entered "Q"
                        if(quantity.customerQuantity.toLowerCase() === "q") {
                            // display a "goodbye" message
                            console.log(goodbyeMsg.bold("-----------------------------------"));
                            console.log(goodbyeMsg.bold("Goodbye, see you next time!"));
                            console.log(goodbyeMsg.bold("-----------------------------------"));
                            // end the connection with bamazon_db
                            connection.end();
                        // if the customer entered a quantity
                        } else {
                            // run updateInventory() function
                            updateInventory(item.customerChoice, quantity.customerQuantity);
                        }
                    })              
            }
        })
}

// function to update the "products" table within bamazon_db
function updateInventory(item_wanted, quantity_wanted) {
    // connect to the database to do a request
    connection.query (
        // grab the quantity in stock and the name of the product for the item wanted
        "SELECT stock_quantity, product_name FROM products WHERE ?",
        {
            item_id: parseInt(item_wanted),
        },
        function (err, res) {
            // if error(s), display it(them)
            if (err) throw err;
            // if the quantity wanted is superior to the quantity in stock
            if (quantity_wanted > res[0].stock_quantity) {
                // display message - stocks too low
                console.log(tooLowMsg.bold("-----------------------------------"));
                console.log(tooLowMsg.bold("Sorry, we don't have that many in stock!"));
                console.log(tooLowMsg.bold("-----------------------------------"));
                // show the updated inventory and ask the customer again
                showInventoryAskCustomer();
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
                    function(err, res) {
                        // if error(s), display it(them)
                        if (err) throw err;
                    }
                )
                // show the updated inventory and ask the customer again
                showInventoryAskCustomer();
            }
        }   
    )
}


// ------------------------------------------------------------------
// Main process
// ------------------------------------------------------------------

// welcome the user - message displayed in color with cli-color
console.log(clc.magenta.bold("-----------------------------------"));
console.log(clc.magenta.bold("Welcome on Bamazon - Outdoors Edition! Here is our inventory!"));
console.log(clc.magenta.bold("-----------------------------------"));

// open the connection to bamazon_db
connection.connect(function(err) {
    // if error(s), display it(them)
    if (err) throw err;
    // verify that we are connected
    // console.log("connected as id " + connection.threadId);
    // run the showInventoryAskCustomer() funcion once the connection has been established
    showInventoryAskCustomer(); 
});