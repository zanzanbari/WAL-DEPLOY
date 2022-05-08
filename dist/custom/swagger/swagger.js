// import swaggerAutogen from "swagger-autogen";({openapi: "3.0.0"});
const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });
const options = {
    info: {
        title: "WAL API Document",
        description: "왈 API docs 입니다."
    },
    servers: [{
            url: "http://localhost:8080",
        }],
    schemes: ['http'],
    securityDefinitions: {
        bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            in: 'header',
            bearerFormat: 'JWT',
        },
    },
};
const outputFile = "./custom/swagger/swagger-api.json";
const endpointsFiles = ["./src/app.ts"];
swaggerAutogen(outputFile, endpointsFiles, options);
//# sourceMappingURL=swagger.js.map