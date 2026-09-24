// Data for the professional page frontend (frontend/index.html).
// To use a different photo, replace profile.png with another PNG image.
const fs = require('fs');
const path = require('path');

const base64Image = fs
  .readFileSync(path.join(__dirname, 'profile.png'))
  .toString('base64');

module.exports = {
  professionalName: 'Nnanna Arua Uko',
  base64Image,
  nameLink: {
    firstName: 'Nnanna',
    url: 'https://github.com/Nwasir',
  },
  primaryDescription: ' is a software developer and web services student.',
  workDescription1:
    'Nnanna is studying Web Services (CSE 341), building REST APIs with Node.js, Express, and MongoDB, and connecting them to real frontends like this one.',
  workDescription2:
    'Outside of class, Nnanna enjoys turning real-world problems into useful software and is always looking for new ways to learn and grow as an engineer.',
  linkTitleText: 'Want to connect? Here are my links:',
  linkedInLink: {
    text: 'LinkedIn',
    link: 'https://www.linkedin.com/in/nnanna-arua-uko-42453821a/',
  },
  githubLink: {
    text: 'GitHub',
    link: 'https://github.com/Nwasir',
  },
  contactText: "Feel free to reach out through either link if you'd like to work together!",
};
