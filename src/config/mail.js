import nodemailer from 'nodemailer';

require('dotenv/config');

export default nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  secure: false,
  tls: {
    rejectUnauthorized: false,
    ciphers: 'HIGH:MEDIUM:!aNULL:!eNULL:@STRENGTH:!DH:!kEDH',
  },
});
