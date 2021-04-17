const admin = require("firebase-admin");
const functions = require("firebase-functions");
const nodemailer = require('nodemailer');
const cors = require('cors')({origin: true});

admin.initializeApp();

exports.emailNotificationsNews = functions.firestore.document('/news/{newsId}').onCreate((snap, context) => {
  const data = snap.data();

  return nodemailer.createTestAccount().then(testAccount => {
    return admin.firestore().collection('users').where('locations', 'array-contains-any', data.locations).get().then(querySnapshot => {
      /*
      const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user, // generated ethereal user
          pass: testAccount.pass, // generated ethereal password
        },
      });
      */

      const transporter = nodemailer.createTransport({
        service: 'FastMail',
        auth: {
          user: 'unit2021@fastmail.com',
          pass: 'bu4dysvlbmg3zafp'
        }
      });

      const promises = [];

      querySnapshot.forEach(doc => {
        const userData = doc.data();
        promises.push(transporter.sendMail({
          from: '"UnIT 2021" <unit2021@fastmail.com>',
          to: userData.email,
          subject: "[UnIT] New news item: " + (data.title_en || data.title_cs),
          text: "New news item was added for you. Got to app to read it!",
          // html: "", // html body
        }));
      });

      return Promise.all(promises);
    });
  });
});
