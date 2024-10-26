const express = require("express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const app = express();
const port = 3000;

app.use(express.json());

const swaggerOptions = {
	swaggerDefinition: {
		openapi: "3.0.0",
		info: {
			title: "Stamina API",
			version: "1.0.0",
			description: "API documentation for stamina management system",
		},
		servers: [{ url: `http://localhost:${port}` }],
	},
	apis: [__filename],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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
app.get("/calculateBaseStaminaByUserInput", (req, res) => {});

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
app.get("/calculateInitialStaminaByCondition", (req, res) => {});

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
app.post("/reduceStaminaByTime", (req, res) => {});

/**
 * @swagger
 * /reduceStaminaBySteps:
 *   post:
 *     summary: Reduce stamina based on steps.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               steps:
 *                 type: integer
 *                 description: Number of steps for stamina reduction
 *     responses:
 *       200:
 *         description: Stamina reduced successfully.
 *       404:
 *         description: User not found or stamina not initialized.
 */
app.post("/reduceStaminaBySteps", (req, res) => {});

/**
 * @swagger
 * /recoverStaminaByRest:
 *   post:
 *     summary: Recover stamina based on rest time.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               minutes:
 *                 type: integer
 *                 description: Number of minutes for stamina recovery
 *     responses:
 *       200:
 *         description: Stamina recovered successfully.
 *       404:
 *         description: User not found or stamina not initialized.
 */
app.post("/recoverStaminaByRest", (req, res) => {});

/**
 * @swagger
 * /createGroup:
 *   post:
 *     summary: Create a group with given user IDs.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               groupName:
 *                 type: string
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Group created successfully.
 *       500:
 *         description: Database error.
 */
app.post("/createGroup", (req, res) => {});

/**
 * @swagger
 * /generateRandomGroupId:
 *   get:
 *     summary: Generate a random group ID.
 *     responses:
 *       200:
 *         description: Random group ID generated successfully.
 */
app.get("/generateRandomGroupId", (req, res) => {});

/**
 * @swagger
 * /setUserName:
 *   post:
 *     summary: Set the user's name.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               userName:
 *                 type: string
 *     responses:
 *       200:
 *         description: User name set successfully.
 *       500:
 *         description: Database error.
 */
app.post("/setUserName", (req, res) => {});

/**
 * @swagger
 * /storeMentionsInfo:
 *   post:
 *     summary: Store mentions information for a user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               mentions:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Mentions information stored successfully.
 *       500:
 *         description: Database error.
 */
app.post("/storeMentionsInfo", (req, res) => {});

app.get("/", (req, res) => {
	res.send("Hello, World!");
});

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
	console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});
