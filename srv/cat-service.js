const { sendMail } = require('@sap-cloud-sdk/mail-client');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

module.exports = (srv) => {
  srv.on('sendmail', async (req) => {
    const { to, subject, html, attachments, templetType } = req.data;

    try {
      // Determine the template file based on templetType
      let templateFile;
      switch (templetType) {
        case 'templet2':
          templateFile = 'templet2.html';
          break;
          case 'templet3':
          templateFile = 'templet3.html';
          break;
          case 'templet4':
          templateFile = 'templet4.html';
          break;
        
        case 'templet1':
        default:
          templateFile = 'templet1.html';
      }

      // Read the HTML template file if html content is not provided in the payload
      let htmlContent;
      if (html) {
        htmlContent = html;
      } else {
        const templatePath = path.join(__dirname, 'templets', templateFile);

        // Check if the template file exists
        if (fs.existsSync(templatePath)) {
          htmlContent = fs.readFileSync(templatePath, 'utf8');
        } else {
          throw new Error(`Template file ${templateFile} not found.`);
        }
      }

      // Load HTML content using cheerio to optionally manipulate or extract content
      const $ = cheerio.load(htmlContent);
      const bodyContent = $('body').html(); // Get the HTML content inside the <body> tag

      // Prepare the mail configuration
      const mailConfig = {
        from: 'shobhittyagimit@gmail.com',
        to: to,
        subject: subject,
        html: bodyContent, // Set the extracted HTML content as the email body
        attachments: [] // Initialize empty attachments array
      };

      // Add attachments from the payload if provided, otherwise use predefined attachment
      if (attachments && Array.isArray(attachments) && attachments.length > 0) {
        attachments.forEach(att => {
          mailConfig.attachments.push({
            filename: att.filename,
            content: att.content,
            encoding: 'base64'
          });
        });
      } else {
        // Path to the predefined attachment file
        const predefinedAttachmentPath = path.join(__dirname, 'templets', 'Northwind CAPM Project Document - Google Docs.pdf');
        const predefinedAttachmentContent = fs.readFileSync(predefinedAttachmentPath).toString('base64');
        
        mailConfig.attachments.push({
          filename: 'file.pdf',
          content: predefinedAttachmentContent,
          encoding: 'base64'
        });
      }

      await sendMail({ destinationName: "sap_process_automation_mail" }, [mailConfig]);
      return "OK";
    } catch (error) {
      console.log(error);
      throw error; // Ensure the error is propagated correctly
    }
  });
};