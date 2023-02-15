const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require("swagger-ui-express");

const options = {
	swaggerDefinition:{
    	openapi: "3.0.3",
        info:{
        	title: 'API ME',
            version: '1.0.0',
            description: 'API Server with express',
        },
        servers:[
        	{
            	url:"http://localhost:3000/api/v1",
            },
       ],
	},
    apis:['./swagger/*']
};

const specs = swaggerJsdoc(options);

module.exports = {
    swaggerUi,
    specs
}
