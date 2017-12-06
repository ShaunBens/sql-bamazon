var Table = require("cli-table");
var mysql = require("mysql");
var inquirer = require("inquirer");


// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazon_DB"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    // console.log(connection.threadId);
    inventory();

});


// Inventory function to display our SQL database in a CLI table(npm package cli-table) in the terminal.
function inventory() {
    // instantiate
    var table = new Table({
        head: ['ID', 'Product', 'Department', 'Price', 'Stock'],
        colWidths: [10, 30, 20, 10, 30]
    });

    showInventory();

    function showInventory() {
        connection.query("SELECT * FROM products", function(err, res) {
            for (var i = 0; i < res.length; i++) {

                var itemId = res[i].item_id,
                    productName = res[i].product_name,
                    departmentName = res[i].department_name,
                    price = res[i].price,
                    stock = res[i].stock_quantity;

                // table is an Array, so you can `push`, `unshift`, `splice` and friends
                table.push(
                    [itemId, productName, departmentName, price, stock]
                );

            }

            console.log(table.toString());
            startHere();
        });

    }

}

// Function to begin the customer inquiry process. Gathers info for what item the user wants to purchase and how many of that item.
function startHere() {
    inquirer.prompt([{

            type: "input",
            name: "userItem",
            message: "Please enter the ID number of the item you would like to purchase.",
        },
        {
            type: "input",
            name: "userStock",
            message: "How many units of this item would you like to purchase?",

        }
    ]).then(function(userAnswer) {

        //connect to database to find stock_quantity in database. If user quantity input is greater than stock, decline purchase.

        connection.query("SELECT * FROM products WHERE item_id=?", userAnswer.userItem, function(err, data) {
            for (var i = 0; i < data.length; i++) {

                if (userAnswer.inputNumber > data[i].stock_quantity) {

                    console.log("-----------------------------------------------------------" + "\n" +
                        "We're sorry, there isn't enough stock to fulfill your order at this time." + "\n" +
                        "-----------------------------------------------------------");
                    inventory();

                }
                else {
                    console.log("==========================================" + "\n" +
                        "Thank You! Fulfilling your order now." + "\n" +
                        "------------------------------------------" + "\n" +
                        "Here are your order details:" + "\n" +
                        "------------------------------------------" + "\n" +
                        "Item: " + data[i].product_name + "\n" +
                        "Department: " + data[i].department_name + "\n" +
                        "Price: " + data[i].price + "\n" +
                        "Quantity: " + userAnswer.userStock + "\n" +
                        "------------------------------------------" + "\n" +
                        "Invoice Total: " + data[i].price * userAnswer.userStock + "\n" +
                        "==========================================");

                    var updateStock = (data[i].stock_quantity - userAnswer.userStock);
                    var purchaseId = (userAnswer.userItem);
                    confirmOrder(updateStock, purchaseId);
                }

                // Function to confirm the users order and return back to the start.
                function confirmOrder(updateStock, purchaseId) {

                    inquirer.prompt([{

                        type: "confirm",
                        name: "confirmPurchase",
                        message: "Are you sure you would like to purchase this item and quantity?",
                        default: true

                    }]).then(function(userOrder) {
                        if (userOrder.confirmPurchase === true) {

                            //if user confirms purchase, update mysql database with new stock quantity by subtracting user quantity purchased.

                            connection.query("UPDATE products SET ? WHERE ?", [{
                                stock_quantity: updateStock
                            }, {
                                item_id: purchaseId
                            }], function(err, res) {});

                            console.log("|||||||||||||||||||||||||||||||||" + "\n" +
                                "Transaction completed. Thank you." + "\n" +
                                "|||||||||||||||||||||||||||||||||");
                            inventory();
                        }
                        else {
                            console.log("{}{}{}{}{}{}{}{}{}" + "\n" +
                                "Maybe next time" + "\n" +
                                "{}{}{}{}{}{}{}{}{}");
                            inventory();
                        }
                    });
                }
            }
        });
    });
}
