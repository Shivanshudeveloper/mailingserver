// Require:
var postmark = require("postmark");
const mustache = require('mustache');
const csv = require('csv-parser');
const fs = require('fs');
const request = require("request");

const servers = ["1437341d-03df-425e-83a1-6913276f0289","40040c8f-b160-44be-b299-2c5687644790","b398079a-423c-400b-8ccf-755e39321385","2701fcae-65b5-49ca-8735-45d64d8467aa","871fb12e-93f8-4496-91ad-1f607e9b0f4f","91544462-f272-4b57-b119-84eeffd31530", "eacbc1f9-3eed-445d-837a-56fd3ffb5e56", "f6a9551c-2a98-440c-bbb2-da5498d4058f", "f90885e1-4839-4c9c-be23-d72ee170e0cf", "bbdf4a86-13e8-44d2-af27-1d74274e8608", "fbfe19e0-75df-4a74-8df6-154dcb8e3594", "599b697b-02b2-48f5-8b84-e0465e19ac32", "ecacd9d4-1df0-4b06-8fb0-0d3deecbcffc", "158c7988-c349-46fd-80f0-58652530b834", "7ae69de2-4855-4e75-8e4f-1f4ac929274f", "efb80930-1c79-427b-8999-f71c90f29427", "81b2ed32-8256-4106-8e92-9d5da67e86e7", "c323a51d-5c44-44d6-80a5-9e8eb26f4bcb", "481c5496-e81c-4d76-8314-5062add9d189", "f2e571cd-248d-4381-98b7-1bdb808b4049", "39185e1d-a87c-40c2-bc39-23f5b1010af4", "7ab232d4-f4c9-4393-9ff6-51c9e964019b", "4c9da566-7673-4fff-92b2-58f257709408", "41f3db5e-1fae-4957-9f60-34bb13023d7a", "95a4e140-3abc-48af-9409-961607e4bd48", "d294992b-0cb3-4bd9-97c9-40f80d846507", "31bdb8e4-0185-4e04-ab04-c7b1c0c4a888", "313905bc-52e3-49fc-8dee-3ae55640e732", "8903a631-a2a8-402e-a0cf-9267cb36705d", "b8583fdf-e074-47c3-8445-2fe4d9b03a95"];


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
        var temp = ["email", body?.data?.status]
        resolve(temp);
     });
  })
}



async function processData() {
  var count = 0;
  return new Promise((resolve) => {
    fs.createReadStream('output_1.csv')
      .pipe(csv())
      .on('data', async (data) => {
        const template = fs.readFileSync('./templates/template1.html', 'utf8');

        const { firstName, email } = data;

        const statusEmail = await verifyEmail(email);

        if (statusEmail[1]) {
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
  
            const from = "david@nft.nftbrands-inc.com";
  
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
                console.log("Email sent successfully!", email, statusEmail[1], serverKey);
              }
            });
            await delay(5000); // pause for 1 second
          }
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

