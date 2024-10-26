const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();
const sqlite3 = require('sqlite3')
const port = 3000;

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Stamina API',
            version: '1.0.0',
            description: 'API documentation for stamina management system',
        },
        servers: [{ url: `http://localhost:${port}` }],
    },
    apis: [__filename],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const db = new sqlite3.Database("stamina.db")

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /calculateBaseStaminaByUserInput:
 *   get:
 *     summary: Calculate base stamina based on user input.
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: age
 *         schema:
 *           type: integer
 *         required: true
 *       - in: query
 *         name: activityLevel
 *         schema:
 *           type: string
 *         required: true
 *         description: User activity level (e.g., high, medium, low)
 *     responses:
 *       200:
 *         description: Base stamina calculated successfully.
 *       500:
 *         description: Database error.
 */
app.get('/calculateBaseStaminaByUserInput', (req, res) => {
    const testQuery = "SELECT * FROM BaseStamina";
    const response = "aaa"
    db.run(testQuery, (err) => {
        if(err){
            console.error(err.message);
        }else{
            console.log("成功")
        }
        res.json({response});
    })
});

/**
 * @swagger
 * /calculateInitialStaminaByCondition:
 *   get:
 *     summary: Calculate initial stamina for today based on condition.
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: condition
 *         schema:
 *           type: string
 *         required: true
 *         description: Today's condition (e.g., good, average, bad)
 *     responses:
 *       200:
 *         description: Initial stamina calculated successfully.
 *       500:
 *         description: Database error.
 */
app.get('/calculateInitialStaminaByCondition', (req, res) => {
    
});

/**
 * @swagger
 * /reduceStaminaByTime:
 *   post:
 *     summary: Reduce stamina based on time.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               hours:
 *                 type: integer
 *                 description: Number of hours for stamina reduction
 *     responses:
 *       200:
 *         description: Stamina reduced successfully.
 *       404:
 *         description: User not found or stamina not initialized.
 */
app.post('/reduceStaminaByTime', (req, res) => {
    
});


app.get('/', (req, res) => {
    res.send('Hello, World!');
});
  
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});
