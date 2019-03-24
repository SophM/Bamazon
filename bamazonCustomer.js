// ------------------------------------------------------------------
// load the packages and files needed for the program to run
// ------------------------------------------------------------------

// load the inquirer node package to be able to get user inputs
var inquirer = require("inquirer");

// load the mysql node package to be able to connect to the Bamazon SQL database
var mysql = require("mysql");

// load the cli-color node package to be able to change the color
// of the text displayed in the terminal
var color = require("cli-color");

// load the cli-table node package to be able to display table in the terminal
var table = require("cli-table");


// ------------------------------------------------------------------
// variables
// ------------------------------------------------------------------

// ------------------------------------------------------------------
// Functions
// ------------------------------------------------------------------


// ------------------------------------------------------------------
// Main process
// ------------------------------------------------------------------

// welcome the user
console.log("-----------------------------------");
console.log("Welcome on Bamazon - Outdoors! Here is our inventory!");
console.log("-----------------------------------");

// start Bamazon
