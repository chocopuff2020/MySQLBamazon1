require('console.table');
var mysql = require('mysql');
var inquirer = require('inquirer');

var addLowInventory;
var quantityAdd;
var productName;
var departmentName;
var price;
var stockQuantity;

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

function insertNew() {
    inquirer.prompt([
        {
          type: 'input',
          message: 'What is the name of the product you want to add ?  ',
          name: 'productName'
        },
        {
          type: 'input',
          message: 'Which department does it belong to ? ',
          name: 'departmentName'
        },
        {
          type: 'input',
          message: 'What is the price for each item ? ',
          name: 'price'
        },
        {
          type: 'input',
          message: 'How many are in-stock ? ',
          name: 'stockQuantity'
        }
    ]).then(function(results) {
          productName = results.productName;
          departmentName = results.departmentName;
          price = results.price;
          stockQuantity = results.stockQuantity;
          console.log(productName,departmentName,price,stockQuantity);
          insertNewQueries();
    });
}

function insertNewQueries() {
      connection.query(`INSERT INTO products (product_name,department_name,price,stock_quantity) VALUES ('${productName}','${departmentName}','${price}','${stockQuantity}')`, function (error, results, fields) {
          if (error) throw error;
          console.log('New product information has successfully added!');
      })
}


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
              insertNew();
              break;
    }
});