require('console.table');
var mysql = require('mysql');
var inquirer = require('inquirer');
var buyProductID;
var buyQuantity;
var itemPrice;
var inStock;
var total;
var availability;
var updatedQuantity;


var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'ASDFAAAA',
  database : 'bamazon'
});

connection.connect();

connection.query('SELECT productID,product_name,price FROM products', function (error, results, fields) {
      if (error) throw error;
      console.log('----------------------------------------------------------------------');
      console.log('---------------------------------ITEMS -------------------------------');
      console.table(results);

      console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
      console.log('========================= SHOPPING CART =============================');
      inquirer.prompt([
            { name: "buyProductID",
              message: "What is the productID of the item you want to buy? ",
              validator: /^[0-9]*$/,
              warning: 'Sorry, please enter a number'
             },
             { name: "buyQuantity",
              message: "How many would you like to buy? ",
              validator: /^[0-9]*$/,
              warning: 'Sorry, please enter a number'
             }
      ]).then(function (answers) {
              buyProductID = answers.buyProductID;
              buyQuantity = answers.buyQuantity;

              connection.query(`SELECT price FROM products WHERE productID = ${buyProductID}`, function (error, results, fields) {
                    if (error) throw error;
                    itemPrice = results[0].price
              });

              connection.query(`SELECT stock_quantity FROM products WHERE productID = ${buyProductID}`, function (error, results, fields) {
                    if (error) throw error;
                    inStock = results[0].stock_quantity;
                    if (inStock >= buyQuantity) {
                        availability = 'YES';
                        updateStock();
                    }
                    else {
                        availability = 'OUT OF STOCK';
                    }
                    console.log(inStock);
              });



              function updateStock() {
                     connection.query(`UPDATE products SET stock_quantity=stock_quantity-${buyQuantity} WHERE productID=${buyProductID}`, function (error, results, fields) {
                             if (error) throw error;
                      });
                };

              function confirmation() {
                      inquirer.prompt([
                      {type:'confirm',
                        name:'confirmation',
                        message:'Would you like to proceed with the order? '
                      }
                    ]).then(function (answers) {
                        if(answers.confirmation == true){
                            console.log('**********************************************');
                            console.log('CONGRATULATIONS! YOUR ORDER HAS BEEN PLACED!!');
                            console.log('**********************************************');
                        } else {
                            console.log('YOUR ORDER HAS BEEN CANCELLED');
                        }
                    });
                };

              connection.query(`SELECT product_name FROM products WHERE productID = ${buyProductID}`, function (error, results, fields) {
                    if (error) throw error;
                    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
                    console.log('========================= ORDER CONFIRMATION ========================');
                    console.log('Item : '+ results[0].product_name);
                    console.log('Quantity : ' + buyQuantity);
                    console.log('Price : $' + itemPrice + ' /per');
                    console.log('Total : $' + buyQuantity * itemPrice);
                    console.log('Availability: ' + availability);
                    console.log('Quantity left in stock: '+ inStock);
                    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
                    if(availability == 'YES') {
                          confirmation();
                    } else {
                          console.log('SORRY, INSUFFICIENT QUANTITY IN-STOCK, COME BACK LATER!');
                          console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
                    }
              });
      });
});