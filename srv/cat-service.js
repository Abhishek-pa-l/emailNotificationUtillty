const { sendMail } = require('@sap-cloud-sdk/mail-client');
 
module.exports = (srv) => {
 
  srv.on('sendmail', async (req) => {
    // let dataa =   JSON.parse(req.data.payload);
    const { to, subject, body } = req.data;
 
    // Configure the mail client
    try {
        const mailConfig = {
          from: "shobhittyagimit@gmail.com",
          to: to ,
          subject: subject,
          text: body,
        };
     
        sendMail({ destinationName: "sap_process_automation_mail" }, [mailConfig]);
        return "OK";
      } catch (error) {
        console.log(error);
      }
  });
 
};