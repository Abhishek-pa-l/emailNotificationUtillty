const { sendMail } = require('@sap-cloud-sdk/mail-client');
const cheerio = require('cheerio');
  
const fs = require('fs');
const path = require('path');
module.exports = (srv) => {

  srv.on('sendmail', async (req) => {
    // let dataa =   JSON.parse(req.data.payload);
    const { to, subject } = req.data;

    // Configure the mail client
    try {
      // Read the HTML template file
      const templatePath = path.join(__dirname, 'templets', 'templet1.html');
      const htmlContent = fs.readFileSync(templatePath, 'utf8');

      // Load HTML content using cheerio
      const $ = cheerio.load(htmlContent);

      // Extract the text content within the <body> tag
      const bodyText = $('body').text();

      // Configure the mail client
      const mailConfig = {
        from: 'shobhittyagimit@gmail.com',
        to: to,
        subject: subject,
        text: bodyText // Set the extracted text content as the email body
      };

      sendMail({ destinationName: "sap_process_automation_mail" }, [mailConfig]);
      return "OK";
    } catch (error) {
      console.log(error);
    }
  });

};