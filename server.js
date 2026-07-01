const express = require('express')
const path = require('path')
const bodyparser = require('body-parser')
const nodemailer = require('nodemailer')
const compareRoute = require('./routes/compare')

const app = express()
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/api/compare', compareRoute)


app.post("/", function(req, res) {
     const name = req.body.name;      
     const email = req.body.email;
     const subject = req.body.subject;
     const message = req.body.message;
     //successMessage.style.display = 'block';

     if (!name || !email || !subject || !message) {
        return;
     }else{
     // console.log(`Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`);
     var transporter = nodemailer.createTransport({
         service: 'gmail',
         auth:   {
             user: 'dhulopqtel1312@gmail.com',
             pass: 'wvuwfbxqiaihkbte' 
         }
     })
     var mailOptions = {
         from: email,
         to: 'dhulopqtel1312@gmail.com',
         subject: 'New Contact Form Submission',
         //text: `User Name: ${name} \nEmail: ${email} \nSubject: ${subject} \nMessage: ${message}`
          html: `
            <h2>New Contact Form Submission</h2>
            <h4><b>User Name:</b> ${name}</h4>
            <h5><b>Email:</b> ${email}</h5>
            <h5><b>Subject:</b> ${subject}</h5>
            <p><b>Message:</b> ${message}</p>
        `
     };
     transporter.sendMail(mailOptions, function(error, info){
         if (error) {
             console.log(error);
             // res.send('Error sending message.');
             //alert("error");
             
         } else {
             console.log('Email sent: ' + info.response);
             // res.send('Message sent successfully!');
            // alert("Message sent successfully!");
             
         }
     });
    }
 });


const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`))

