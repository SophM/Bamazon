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
// Connection to the mySQL database
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
        ]).then (function(answer) {
            // if the customer entered "Q"
            if(answer.customerChoice.toLowerCase() === "q") {
                // display a "goodbye" message
                console.log(clc.blue.bold("-----------------------------------"));
                console.log(clc.blue.bold("Goodbye, see you next time!"));
                console.log(clc.blue.bold("-----------------------------------"));
                // end the connection with bamazon_db
                connection.end();
            // if the customer enter an ID
            } else {
                // to test for now!
                console.log(clc.magenta.bold("-----------------------------------"));
                console.log(clc.magenta.bold("Great!"));
                console.log(clc.magenta.bold("-----------------------------------")); 
                // ask again the customer again
                askCustomer();               
            }

        })
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


// ------------------------------------------------------------------
// Main process
// ------------------------------------------------------------------

// welcome the user
// create a color to display the welcome message with cli-color
var welcomeMsg = clc.xterm(208);
// welcome message
console.log(welcomeMsg.bold("-----------------------------------"));
console.log(welcomeMsg.bold("Welcome on Bamazon - Outdoors Edition! Here is our inventory!"));
console.log(welcomeMsg.bold("-----------------------------------"));

// open the connection to bamazon_db
connection.connect(function(err) {
    // if error(s), display it(them)
    if (err) throw err;
    // verify that we are connected
    // console.log("connected as id " + connection.threadId);
    // run the showInventoryAskCustomer() funcion once the connection has been established
    showInventoryAskCustomer(); 
});