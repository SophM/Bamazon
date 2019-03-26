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

// create a color to display "warning" messages when too low quantity or not valid id
// and "successful-transaction" message
var sucessMsg = clc.xterm(71);
var warningMsg = clc.xterm(160);


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
                showLowInventoryAskManager();
            // if the manager chose "Add to inventory"    
            } else if (answer.managerChoice === menu[2]) {
                // run the askManagerItemToAddMore() function
                askManagerItemToAddMore();
            // if the manager chose "Add new product"      
            } else if (answer.managerChoice === menu[3]) {
                // run addNewItem() function
                addNewItem();
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

// function to display the products with low quantities in stock
function showLowInventoryAskManager() {
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

// function to add more items for one of the product and display the main menu again
function askManagerItemToAddMore() {
    // connect to the database to do a request
    connection.query(
        // select the entire "products" table where stock_quantity is below 5
        "SELECT * FROM products",
        // then run the following
        function (err, res) {
            // if error(s), display it(them)
            if (err) throw err;
            // display message - inventory
            console.log(clc.blue.bold("-----------------------------------"));
            console.log(clc.blue.bold("Here is the complete inventory"));
            console.log(clc.blue.bold("-----------------------------------"));
            // show the complete inventory
            showInventory(res);
            // ask the manager for which products she/he would like to add more items
            inquirer
                .prompt([
                    {
                        type: "input",
                        message: "For which product would you like to add items? Enter its ID [Main menu with M]",
                        name: "id"
                    },
                // then run the following
                ]).then(function (answer) {
                    // connect to the database to do a request
                    connection.query(
                        // select the column "item_id" from "products" table
                        "SELECT item_id FROM products",
                        // then run the following
                        function (err, res) {
                            // if error(s), display it(them)
                            if (err) throw err;
                            // store all the current ids in an array
                            var currentId = [];
                            for (var i = 0; i < res.length; i++) {
                                currentId.push(res[i].item_id);
                            }
                            // console.log(currentId);
                            // if the number entered by the manager is not a valid ID or is a letter other than "m" or "M"
                            if (!currentId.includes(parseInt(answer.id)) && answer.id.toLowerCase() !== "m") {
                                // display message - not valid ID
                                console.log(warningMsg.bold("-----------------------------------"));
                                console.log(warningMsg.bold("This ID is not recognized. Please enter a valid ID!"));
                                console.log(warningMsg.bold("-----------------------------------"));
                                // ask the manager again for which product she/he wants to add items
                                askManagerItemToAddMore();
                            // if the manager entered "m" or "M"
                            } else if (answer.id.toLowerCase() === "m") {
                                // display message - main menu
                                console.log(clc.blue.bold("-----------------------------------"));
                                console.log(clc.blue.bold("Main menu"));
                                console.log(clc.blue.bold("-----------------------------------"));
                                // go back to the main menu - list of options
                                managerOptions();
                            // update the table with the id of the products and the quantity
                            } else {
                                // ask the manager how many she/he wants to add
                                askManagerQuantity(answer.id);
                            }
                        }
                    )
                })
        }
    )
}

// function to ask the manager how many items does she/he wants to add
function askManagerQuantity(managerChoice) {
    // ask for how many she/he wants to add
    inquirer
        .prompt([
            {
                type: "input",
                message: "How many items would you like to add to this product? [Main menu with M]",
                name: "quantityToAdd"
            }
        // then run the following
        ]).then(function (quantity) {
            // if the manager entered a quantity, so a number - need to use "==" because the user input is a sting by default
            if (quantity.quantityToAdd == parseInt(quantity.quantityToAdd)) {
                // run updateInventory() function
                updateInventory(managerChoice, quantity.quantityToAdd);
            // if the manager entered "M" or "m"
            } else if (quantity.quantityToAdd.toLowerCase() === "m") {
                // display message - main menu
                console.log(clc.blue.bold("-----------------------------------"));
                console.log(clc.blue.bold("Main menu"));
                console.log(clc.blue.bold("-----------------------------------"));
                // go back to the main menu - list of options
                managerOptions();
            // if the manager entered a letter other than "M" or "m"
            } else {
                // display a message - not a valid quantity
                console.log(warningMsg.bold("-----------------------------------"));
                console.log(warningMsg.bold("I don't know how many is that! Please enter a valid quantity."));
                console.log(warningMsg.bold("-----------------------------------"));
                // ask the customer again how many does she/he wants
                askManagerQuantity(managerChoice);
            }
        })
}

// function to update the "products" table within bamazon_db
function updateInventory(item_wanted, quantity_added) {
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
            // display message  - successful transaction
            console.log(sucessMsg.bold("-----------------------------------"));
            console.log(sucessMsg.bold("You've successfully added " + quantity_added + " " + res[0].product_name + "(s) to the inventory!"));
            console.log(sucessMsg.bold("-----------------------------------"));
            // connect to the database to do a request
            connection.query(
                // update the quantity in stock for the item wanted
                "UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quantity: res[0].stock_quantity + parseInt(quantity_added)
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
            // ask the manager again what she/he wants to do
            managerOptions();
        }

    )
}

// function to add new product in the inventory
function addNewItem() {
    // ask infos about the product to add
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the name of the product you would like to add?",
                name: "product"
            },
            {
                type: "input",
                message: "Which department is it?",
                name: "department"
            },
            {
                type: "input",
                message: "Which quantity are you adding?",
                name: "quantity"
            },
        // then run the following
        ]).then(function (answer) {
            // if error(s), display it(them)
            if (err) throw err;


        })
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