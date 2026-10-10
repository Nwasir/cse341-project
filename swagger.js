// Generates swagger.json from the routes and the #swagger comments in
// controllers/contacts.js. Run "npm run swagger" after changing either one.
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Contacts API',
    description:
      'Create, read, update and delete contacts stored in MongoDB. Each contact has a firstName, lastName, email, favoriteColor and birthday.',
  },
  // null leaves host and schemes out of swagger.json, so "Try it out" sends
  // requests to the server showing the docs: localhost or Render.
  host: null,
  schemes: null,
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [{ name: 'Contacts', description: 'The contacts collection' }],
  // '@definitions' is copied into swagger.json as written.
  '@definitions': {
    Contact: {
      type: 'object',
      required: ['firstName', 'lastName', 'email', 'favoriteColor', 'birthday'],
      properties: {
        _id: {
          type: 'string',
          readOnly: true,
          description: 'Created by MongoDB. Ignored if sent in a request body.',
          example: '64f1c2e9a1b2c3d4e5f60718',
        },
        firstName: { type: 'string', example: 'Ngozi' },
        lastName: { type: 'string', example: 'Eze' },
        email: { type: 'string', example: 'ngozieze@example.com' },
        favoriteColor: { type: 'string', example: 'Yellow' },
        birthday: { type: 'string', example: '1999-09-09' },
      },
    },
    ContactId: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: "The new contact's _id",
          example: '64f1c2e9a1b2c3d4e5f60718',
        },
      },
    },
    Error: {
      type: 'object',
      properties: {
        message: { type: 'string', description: 'Explains what went wrong' },
      },
    },
  },
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
