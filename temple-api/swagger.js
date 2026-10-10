// The apiKey header is documented once as a security scheme (the Authorize
// button in Swagger UI) instead of as a parameter on every route.
const swaggerAutogen = require('swagger-autogen')({ autoHeaders: false });

const doc = {
  info: {
    title: 'Temple API',
    description:
      'Temples of The Church of Jesus Christ of Latter-day Saints, with their location and dedication date.',
  },
  host: 'localhost:8080',
  schemes: ['http'],
  securityDefinitions: {
    apiKeyAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'apiKey',
      description:
        'Click Authorize and enter the API key. Without a valid key these routes still respond 200, but the body is the text "Invalid apiKey, please read the documentation."',
    },
  },
  definitions: {
    Temple: {
      temple_id: 1,
      name: 'Aba Nigeria Temple',
      location: 'Aba, Abia, Nigeria',
      dedicated: '7 August 2005',
      additionalInfo: false,
    },
    // Example body for POST and PUT. temple_id 267 is not used by the
    // imported temples, so trying it out does not create a duplicate.
    TempleInput: {
      temple_id: 267,
      name: 'Test Temple',
      location: 'Rexburg, Idaho, United States',
      dedicated: 'Announced',
      additionalInfo: false,
    },
  },
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
