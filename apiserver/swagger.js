const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require("swagger-ui-express");
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger/apiV1.yaml');
const options = {
    swaggerDefinition: swaggerDocument,
    apis: ['./swagger/*'],
}

const specs = swaggerJsdoc(options)

module.exports = {
    swaggerUi,
    specs
}
