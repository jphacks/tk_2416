const express = require("express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const app = express();
const sqlite3 = require('sqlite3')
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

const db = new sqlite3.Database("stamina.db")

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// function
const generateRandomID = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
};

const isIDUnique = (userid, callback) => {
    db.get('SELECT userid FROM UserNames WHERE userid = ?', [userid], (err, row) => {
        callback(!row); 
    });
};

/**
 * @swagger
 * /setUserName:
 *   post:
 *     summary: 名前とユーザIDのペアをUserNamesテーブルに格納する。
 *     parameters:
 *       - in: query
 *         name: userName
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: User name set successfully.
 *       500:
 *         description: Database error.
 */
app.post("/setUserName", (req, res) => {
    const userName = req.query.userName;
    const newID = generateRandomID();

    isIDUnique(newID, (unique) => {
        if (unique) {
            const insertUserIdIntoUserNamesQuery = "INSERT INTO UserNames (userid, name) VALUES (?, ?)";
            db.run(insertUserIdIntoUserNamesQuery, [newID, userName], (err) => {
                if (err) {
                    return res.status(500).send('Error saving the user ID');
                }
                const insertUserIdIntoBaseStaminaQuery = "INSERT INTO BaseStamina (userid, base_stamina, mentions) VALUES (?, ?, ?)";
                db.run(insertUserIdIntoBaseStaminaQuery, 
                    [newID, null, null], (err) => {
                        if (err) {
                            return res.status(500).send('Error saving to BaseStamina table');
                        }
                        const insertUserIdIntoCurrentStaminaQuery = "INSERT INTO CurrentStamina (userid, current_stamina) VALUES (?, ?)";
                        db.run(insertUserIdIntoCurrentStaminaQuery, 
                            [newID, null], (err) => {
                                if (err) {
                                    return res.status(500).send('Error saving to CurrentStamina table');
                                }
                                const insertUserIdIntoUserGroupsQuery = "INSERT INTO UserGroups (userid, groupid) VALUES (?, ?)";
                                db.run(insertUserIdIntoUserGroupsQuery, 
                                    [newID, null], (err) => {
                                        if (err) {
                                            return res.status(500).send('Error saving to userGroups table');
                                        }
                                        res.send({ userid: newID, user_name: userName });
                                    });
                            });
                    });
            });
        } else {
            res.redirect('/generate-username'); 
            return;
        }
    });
});


/**
 * @swagger
 * /calculateBaseStaminaByUserInput:
 *   post:
 *     summary: ユーザのスタミナレベルに基づいて基本スタミナを設定し、BaseStaminaテーブルを更新する。
 *     parameters:
 *       - in: body
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *       - in: body
 *         name: staminaLevel
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Base stamina calculated successfully.
 *       500:
 *         description: Database error.
 */

app.post('/calculateBaseStaminaByUserInput', (req, res) => {
    //req.body userid:userid, stamina_level(integer): 1-5
    const userId = req.body.userId;
    const staminaLevel = parseInt(req.body.staminaLevel);
    let baseStamina;
    switch (staminaLevel) {
        case 1:
            baseStamina = 1800;
            break;
        case 2:
            baseStamina = 3600;
            break;
        case 3:
            baseStamina = 5400;
            break;
        case 4:
            baseStamina = 7200;
            break;
        case 5:
            baseStamina = 9000;
            break;
        default:
            baseStamina = 5400;
            break;
    }
    settingBaseStaminaQuery = "UPDATE BaseStamina SET base_stamina = ? WHERE userid = ?;";
    db.run(settingBaseStaminaQuery, [baseStamina, userId], (err) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json({userId, baseStamina})
        });
});

/**
 * @swagger
 * /calculateInitialStaminaByCondition:
 *   post:
 *     summary: Calculate initial stamina for today based on condition.
 *     parameters:
 *       - in: body
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *       - in: body
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
app.post("/calculateInitialStaminaByCondition", (req, res) => {});

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
 *   post:
 *     summary: Generate a random group ID.
 *     responses:
 *       200:
 *         description: Random group ID generated successfully.
 */
app.post("/generateRandomGroupId", (req, res) => {});


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

app.post("/", (req, res) => {
	res.send("Hello, World!");
});

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
	console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});
