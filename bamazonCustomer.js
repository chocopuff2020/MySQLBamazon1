require('console.table');
var mysql = require('mysql');
var inquirer = require('inquirer');
var buyProductID;
var buyQuantity;
var itemPrice;
var total;
var availability;


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
              message: "What is the productID of the item you want to buy? "
             },
             { name: "buyQuantity",
              message: "How many would you like to buy? "
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
                    // console.log(results[0].stock_quantity);
                    var inStock = results[0].stock_quantity;
                    if (inStock >= buyQuantity) {
                        availability = 'YES'
                    }
                    else {
                        availability = 'OUT OF STOCK'
                    }

              });

              connection.query(`SELECT product_name FROM products WHERE productID = ${buyProductID}`, function (error, results, fields) {
                    if (error) throw error;
                    // console.log(results[0].product_name);
                    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
                    console.log('========================= ORDER CONFIRMATION ========================');
                    console.log('Item : '+ results[0].product_name);
                    console.log('Quantity : ' + buyQuantity);
                    console.log('Price : $' + itemPrice + ' /per');
                    console.log('Total : $' + buyQuantity * itemPrice);
                    console.log('Availability: ' + availability);
                    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
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
              });
              connection.end();

      });
});

// connection.end();
