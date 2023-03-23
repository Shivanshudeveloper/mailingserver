// Require:
var postmark = require("postmark");
const mustache = require('mustache');
const csv = require('csv-parser');
const fs = require('fs');

const servers = ["91544462-f272-4b57-b119-84eeffd31530", "eacbc1f9-3eed-445d-837a-56fd3ffb5e56", "f6a9551c-2a98-440c-bbb2-da5498d4058f", "f90885e1-4839-4c9c-be23-d72ee170e0cf", "bbdf4a86-13e8-44d2-af27-1d74274e8608", "fbfe19e0-75df-4a74-8df6-154dcb8e3594", "599b697b-02b2-48f5-8b84-e0465e19ac32", "ecacd9d4-1df0-4b06-8fb0-0d3deecbcffc", "158c7988-c349-46fd-80f0-58652530b834", "7ae69de2-4855-4e75-8e4f-1f4ac929274f", "efb80930-1c79-427b-8999-f71c90f29427"];


function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}



async function processData() {
  var count = 0;
  return new Promise((resolve) => {
    fs.createReadStream('main.csv')
      .pipe(csv())
      .on('data', async (data) => {
        if (count === servers.length) {
          count = 0;
        }
        var serverKey = servers[count];
        count = count + 1;

        const template = fs.readFileSync('./templates/template.html', 'utf8');

        const { firstName, email } = data;

        const emailData = { name: firstName };

        const html = mustache.render(template, emailData);

        // Send an email:
        var client = new postmark.ServerClient(serverKey);


        const from = "josh@nftbrands-inc.com";

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

