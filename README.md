# Bamazon

In this project, I built an e-commerce storefront, called Bamazon. Bamazon is a CLI. It runs in the terminal, using Node.js. Node.js is an open-source JavaScript runtime environment, that allows to execute JavaScript code outside of a browser. Bamazon's inventory corresponds to a database stored using mySQL. The app connects to the mySQL database, which allows to display and update the store's inventory.
The inventory is shown in a table format, thanks to the "cli-table" node package. Some colors have also been added to the inventory table and messages displayed thanks to the "cli-color" node package.

Bamazon offers two sides:
- customer's side, by running `node bamazonCustomer.js` 
- manager's side, by running `node bamazonManager.js`

<br>**Customer's side**<br>
The app shows the store's inventory and takes orders from customers. The customer is asked to enter the ID of the item she/he wants to buy (first question), and then the quantity she/he wants (second question). If the quantity wanted by the customer is lower than the stock, the customer will "buy" the item(s) wanted and an updated store's inventory will be displayed. If the customer wants more items than available in stock, a "stock-too-low" message will be displayed along with the store's inventory. At anytime, the customer can quit the app by entering "Q". Some precautions have been taken so that entering "q" also quits Bamazon.

<br>**Manager's side**<br>
The app shows a main menu (list of options) the manager can choose from. Five options are offered:
- "View products for sale", to display the complete store's inventory;
- "View low inventory", to display the products whose quantity is below 5;
- "Add to inventory", which asks the manager which product currently in the store does she/he want to add more for and how many more.
- "Add new product", which asks the manager the info (name, department, price, quantity) about the product she/he wants to add to the store
- "Quit", to quit Bamazon.

<br>**For both sides, some input validations have been defined** so that if the customer's or manager's answer is not valid a message will be displayed and the question will be asked again. For example, on the customer's side:
- for the first question (which item?), if the customer enters a letter other than "Q"/"q" or a number that is not a current valid ID, a "not-a-valid-id" message will be displayed and the first question will be asked again - see code snippet below for details.
- for the second question (how many?), if the customer enters a letter other than "Q"/"q", a "not-a-valid-quantity" message will be displayed and the second question is asked again.

---

### Getting set up

Several node packages have to be installed for Bamazon to run properly. Follow the steps below to get set up:

1. Using your terminal, navigate to the folder containing bamazonCustomer.js.

2. If you DON'T have a file called "package.json" in your folder, run: `npm init -y` to create this file. If you do have this file, skip this step.

3. Install the node packages, one after the other - the order doesn't matter - by running:
- `npm install inquirer`
- `npm install mysql`
- `npm install cli-color`
- `npm install cli-table`

4. After installing the required packages, type `node bamazonCustomer.js` or `node bamazonManager.js` in your terminal to start using Bamazon as a customer or a manager, respectively!

---

### Technologies used

To build this project, I used the following technologies:

- Node.js
- JavaScript/jQuery
- mySQL

---

### Code snippet showing the input validation for the first "customer" question (which item?) - as an example

![Code snippet showing the input validation for the first question (which item?)](https://github.com/SophM/Bamazon/blob/master/assets/for_readme/screenshot_showing_validation_first_question.png?raw=true)

---

### Screenshot of the mySQL database = Bamazon's inventory

![Screenshot of the mySQL database = Bamazon's inventory](https://github.com/SophM/Bamazon/blob/master/assets/for_readme/screenshot_mySQL_database.png?raw=true)

---

### GIF showing Bamazon - customer role - in action with input validation

![GIF showing Bamazon - customer role - in action](https://github.com/SophM/Bamazon/blob/master/assets/for_readme/GIF_showing_bamazonCustomer_in_action_with_validations.gif?raw=true)

---

### GIF showing Bamazon - manager role - in action with input validation

![GIF showing Bamazon - manager role - in action](https://github.com/SophM/Bamazon/blob/master/assets/for_readme/GIF_showing_bamazonManager_in_action_with_validation.gif?raw=true)

---

### Contribution

- Sophie Mallez










