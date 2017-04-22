require('console.table');
var mysql = require('mysql');
var inquirer = require('inquirer');

var addLowInventory;
var quantityAdd;

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'ASDFAAAA',
  database : 'bamazon'
});

connection.connect();


function viewProducts() {
   connection.query('SELECT * FROM products', function (error, results, fields) {
        console.table(results);
    });
}

function lowInventory() {
    connection.query('SELECT product_name FROM products WHERE stock_quantity <= 5', function (error, results, fields) {
        console.table(results);
    });
}

function promptAdd() {
    inquirer.prompt([
        {
          type: 'input',
          message: 'Which product do you want to add inventory for?  ',
          name: 'addInventory'
        },
        {
          type: 'input',
          message: 'How many do you want to add ?  ',
          name: 'quantityAddInventory'
        }
    ]).then(function(results) {
          addLowInventory = results.addInventory;
          quantityAdd = parseInt(results.quantityAddInventory);
          addInventory();
          // addMore();

    });
}

function addInventory() {
    connection.query(`UPDATE products SET stock_quantity=stock_quantity+${quantityAdd} WHERE product_name='${addLowInventory}'`, function (error, results, fields) {
          if (error) throw error;
          console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
          console.log('INVENTORY HAS BEEN ADDED! ');
          console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    });
}

// function addMore() {
//     inquirer.prompt([
//         {
//           type: 'confirm',
//           message: 'Would you like to add more inventory? ',
//           name: 'addMore'
//         }
//     ]).then(function(results) {
//         if(results.addMore == true) {
//             addInventory();
//         }
//     })
// }
inquirer.prompt([
  {
    type: 'checkbox',
    message: 'What do you want to do? ',
    name: 'Manager',
    choices: [
      {
        name: 'View Products for Sale'
      },
      {
        name: 'View Low Inventory'
      },
      {
        name: 'Add to Inventory'
      },
      {
        name: 'Add New Product'
      }
    ],
    validate: function (answer) {
      if (answer.length < 1) {
        return 'You must choose at least one activity.';
      }
      return true;
    }
  }
]).then(function (answers) {
    var myCommand = answers.Manager[0];
    switch (myCommand) {
        case 'View Products for Sale':
              viewProducts();
              break;
        case 'View Low Inventory':
              lowInventory();
              break;
        case 'Add to Inventory':
              promptAdd();

              break;
        case 'Add New Product':
              break;
    }
});