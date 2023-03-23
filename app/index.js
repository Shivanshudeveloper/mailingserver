// Require:
var postmark = require("postmark");
const mustache = require('mustache');
const csv = require('csv-parser');
const fs = require('fs');

const servers = ["a15d1b45-97da-4087-8ded-da11ec0311de", "91544462-f272-4b57-b119-84eeffd31530"];


function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}



async function processData() {
  return new Promise((resolve) => {
    fs.createReadStream('main.csv')
      .pipe(csv())
      .on('data', async (data) => {
        const template = fs.readFileSync('./templates/template.html', 'utf8');

        const { firstName, email } = data;

        const emailData = { name: firstName, signature: 'Larry Corp', designation: 'Manager' };

        const html = mustache.render(template, emailData);

        // Send an email:
        var client = new postmark.ServerClient("a15d1b45-97da-4087-8ded-da11ec0311de");


        const from = "louis@sales.leadinglyapp.com";

        const to = email;

        const subject = "Get started with SaaS";

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
            console.log("Email sent successfully!", email);
          }
        });
        await delay(5000); // pause for 1 second
      })
      .on('end', () => {
        // console.log("Done");
        resolve("Done");
      });
  })
}

async function main() {
  const results = await processData();
  console.log(results);
}

main();

