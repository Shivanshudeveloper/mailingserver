// Require:
var postmark = require("postmark");
const mustache = require('mustache');
const csv = require('csv-parser');
const fs = require('fs');
const request = require("request");

const servers = ["027f6195-a495-489f-bdfd-ca628275bb5b"];


function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

async function verifyEmail(emailVerify) {
  return new Promise((resolve) => {
    var options = {
      method: 'POST',
      url: 'https://api.clearout.io/v2/email_verify/instant',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': '94e277148db2a5e2e6ab39647ec64cbd:4a27f77f1679c5cd2f0e6c998fed9d79f4831b9401283a37a8dd2943f41cc626',
      },
      body: {
       email: emailVerify
      },
      json: true
     };
     
     request(options, function (err, response, body) {
       if (err) throw new Error(err);
      //  console.log('Email address: ', body.data.email_address);
      //  console.log('Status: ', body.data.status);
      // return body.data.email_address;
        var temp = [body.data.email_address, body.data.status]
        resolve(temp);
     });
  })
}



async function processData() {
  var count = 0;
  return new Promise((resolve) => {
    fs.createReadStream('main.csv')
      .pipe(csv())
      .on('data', async (data) => {
        const template = fs.readFileSync('./templates/template.html', 'utf8');

        const { firstName, email } = data;

        const statusEmail = await verifyEmail(email);

        if (statusEmail[1] === "valid") {
          if (count === servers.length) {
            count = 0;
          }
          var serverKey = servers[count];
          count = count + 1;

          const emailData = { name: firstName };

          const html = mustache.render(template, emailData);

          // Send an email:
          var client = new postmark.ServerClient(serverKey);

          const from = "info@consultwithshiv.com";

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
              console.log("Email sent successfully!", email, statusEmail[1]);
            }
          });
            await delay(5000); // pause for 1 second

        }
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

async function validateEmail(email) {
  const statusEmail = await verifyEmail(email);
  console.log(statusEmail);
}

main();


// processData2();

