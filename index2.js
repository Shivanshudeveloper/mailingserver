// Require:
var postmark = require("postmark");
const mustache = require('mustache');
const fs = require('fs');

// Send an email:
var client = new postmark.ServerClient("027f6195-a495-489f-bdfd-ca628275bb5b");

const template = fs.readFileSync('./templates/template.html', 'utf8');

const from = "info@consultwithshiv.com";
const to = "noah@leadingly.io";
const subject = "Get started with SaaS";


const data = { name: 'Shivanshu', signature: 'Shivanshu 2', designation: 'Manager' };
const html = mustache.render(template, data);

const message = {
    "From": from,
    "To": to,
    "Subject": subject,
    "HtmlBody": html,
    "MessageStream": "outbound"
};

client.sendEmail(message, function(error, result) {
  if (error) {
    console.error("Unable to send email: ", error.message);
  } else {
    console.log("Email sent successfully!");
  }
});