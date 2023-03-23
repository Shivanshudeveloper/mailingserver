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

        const emailData = { name: firstName };

        const html = mustache.render(template, emailData);

        // Send an email:
        var client = new postmark.ServerClient("a15d1b45-97da-4087-8ded-da11ec0311de");


        const from = "marvin@nftbrands-inc.com";

        const to = email;

        const subject = "🗓IT'S LAUNCH DAY! 🔥🎉 Score a FREE HOODIE and a CHANCE TO WIN A TESLA 🚘";

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


async function processData2() {
  
  var client = new postmark.ServerClient("a15d1b45-97da-4087-8ded-da11ec0311de");

  const template = fs.readFileSync('./templates/template.html', 'utf8');

  const from = "marvin@nftbrands-inc.com";
  const to = "daksht780@gmail.com";
  const subject = "🗓IT'S LAUNCH DAY! 🔥🎉 Score a FREE HOODIE and a CHANCE TO WIN A TESLA 🚘";


  const data = { name: 'Shivanshu' };
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
}

async function main() {
  const results = await processData();
  console.log(results);
}

main();

// processData2();

