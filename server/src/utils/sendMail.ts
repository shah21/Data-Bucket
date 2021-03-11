// Load the AWS SDK for Node.js
import AWS from 'aws-sdk';



// Set the region 
AWS.config.loadFromPath('./config.json');
// AWS.config.update({region: 'REGION'});


export const sendMail = (email: string,subject:string,body:string) => {
  // Create sendEmail params
  var params = {
    Destination: {
      /* required */
      CcAddresses: [
        /* more items */
      ],
      ToAddresses: [
        email,
        /* more items */
      ],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data: body,
        },
        Text: {
          Charset: "UTF-8",
          Data: '',
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: "muhsinshah21@gmail.com" /* required */,
    ReplyToAddresses: [
      /* more items */
    ],
  };

  // Create the promise and SES service object
  var sendPromise = new AWS.SES({ apiVersion: "2010-12-01" })
    .sendEmail(params)
    .promise();

  // Handle promise's fulfilled/rejected states
  return sendPromise;
};

