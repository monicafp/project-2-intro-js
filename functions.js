var fs = require('fs');
var csv = require('csv');
var prompt = require('prompt-sync')();
var colors = require('colors');

// ----- REUSABLE FUNCTIONS ----- //

// Process CSV
exports.processCsv = function(filename, callback) {
  fs.readFile(filename, function(error, data) {
    if (error) {
      throw error
    };

    csv.parse(data, { columns: true }, function(error, dataParsed) {
      if (error) {
        throw error
      };
      callback(dataParsed, filename);
    });
  });
};

// Write CSV
function writeCsv(filename, data) {
  csv.stringify(data, { header: true }, function(error, data) {
    if (error) throw error;

    fs.writeFile(filename, data, function(error) {
      if (error) {
        throw error;
      }
      console.log('CSV update was successful.');
    });
  });
};

// Find Contact
function findContact(data, email) {
  for (var i = 0; i < data.length; i++) {
    if (data[i].email === email) {
      return i;
    }
  }
  return -1;
};

// For a contact who is not in the database
function notFound() {
  console.log("Contact not found.");
}

// For a contact who is already in the database
function found() {
  console.log("Contact already exists in database.");
}

// Request Info
function requestInfo() {
  var firstName = prompt("First Name: ");
  var lastName = prompt("Last Name: ");
  var phone = prompt("Phone: ");
  var email = prompt("Email: ");
  var city = prompt("City: ");
  var zip = prompt("Zip: ");
  var website = prompt("Website: ");
  var company = prompt("Company: ");

  var contact = {
    first_name: firstName,
    last_name: lastName,
    phone: phone,
    email: email,
    city: city,
    zipcode: zip,
    website: website,
    company: company
  };

  return contact;
}


// ----- FUNCTIONS FOR EACH CASE IN SWITCH STATEMENT ----- //

// "help"
exports.help = function() {
  return "This is a contacts application. What follows is a list of " + "commands".yellow + " you can run, along with their descriptions.\n   " + "search".yellow + "- Search for a contact by email and get their information.\n   " + "add".yellow + "- Add a contact to the list.\n   " + "update".yellow + "- Update a contact\'s information in the list.\n   " + "delete".yellow + "- Delete a contact from the list.\n   " + "count".yellow + "- Get the total count of contacts in the list."
};

// "count"
exports.showCount = function(data) {
  console.log(data.length);
}

// "add"
exports.addContact = function(data, filename) {
  var contact = requestInfo();
  var position = findContact(data, contact.email);
  if (position === -1) {
    data.push(contact);
    writeCsv(filename, data);
  } else {
    found();
  }
};

// "update"
exports.updateContact = function(data, filename) {
  console.log("Updating Contact: ");
  var email = prompt('Please enter contact email to update: ');
  var position = findContact(data, email);
  if (position === -1) {
    notFound();
  } else {
    var contact = requestInfo();
    data.splice(position, 1, contact);
    writeCsv(filename, data);
  }
};

// "delete"
exports.deleteContact = function(data, filename) {
  var email = prompt('Please enter contact email to delete: ');
  var position = findContact(data, email);
  if (position === -1) {
    notFound();
  } else {
    data.splice(position, 1);
    writeCsv(filename, data);
  }
};

// "search"
exports.searchContact = function(data) {
  var email = prompt('Please enter email: ');
  var position = findContact(data, email);
  if (position === -1) {
    notFound();
  } else {
    console.log(data[position]);
  }
};
