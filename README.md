# Bamazon

In this project, I built an e-commerce storefront, called Bamazon. Bamazon is a CLI. It runs in the terminal, using Node.js. Node.js is an open-source JavaScript runtime environment, that allows to execute JavaScript code outside of a browser. Bamazon's inventory corresponds to a database stored using mySQL. The app connects to the mySQL database, which allows to display and update the store's inventory. 

The app shows the store's inventory and takes orders from customers. If the quantity wanted by the customer is lower than the stock, the customer will "buy" the item(s) wanted and an updated store's inventory will be displayed. If the customer wants more items than available in stock, a "stock-too-low" message will be displayed along with the store's inventory. At anytime, the customer can quit the app by entering "Q". Precautions have been taken so that entering "q" also quit Bamazon. 

The inventory is shown in a table format, thanks to the "cli-table" node package. Some colors have also been added to the inventory table and messages displayed thanks to the "cli-color" node package.

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

4. After installing the required packages, type `node bamazonCustomer.js` in your terminal to start using Bamazon as a customer!

---

### Technologies used

To build this project, I used the following technologies:

- Node.js
- JavaScript/jQuery
- mySQL

---

### Screenshot of the mySQL database = Bamazon's inventory

![Screenshot of the mySQL database = Bamazon's inventory](https://github.com/SophM/Bamazon/blob/master/assets/for_readme/screenshot_mySQL_database.png?raw=true)

---

### GIF showing Bamazon - customer role - in action

![GIF showing Bamazon - customer role - in action](https://github.com/SophM/Bamazon/blob/master/assets/for_readme/GIF_showing_bamazonCustomer_in_action.gif?raw=true)










