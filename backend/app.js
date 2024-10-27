const express = require("express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const app = express();
const sqlite3 = require("sqlite3");
const port = 3000;
const moment = require("moment");

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

const db = new sqlite3.Database("stamina.db");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const generateRandomGroupID = () => {
    return Math.floor(1000 + Math.random() * 9000);
};

const isGroupIDUnique = (groupid, callback) => {
    db.get('SELECT groupid FROM Groups WHERE groupid = ?', [groupid], (err, row) => {
        callback(!row);
    });
};

function generateDummyData(userid) {
    const dummyData = [];

    for (let i = 0; i < 20; i++) {
        dummyData.push({
            userid: userid,
            num: i+1,
            steps: Math.floor(Math.random() * 2000)
        });
    }
    return dummyData;
}

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
  const newID = generateRandomUserID();

	isIDUnique(newID, (unique) => {
		if (unique) {
			const insertUserIdIntoUserNamesQuery =
				"INSERT INTO UserNames (userid, name) VALUES (?, ?)";
			db.run(insertUserIdIntoUserNamesQuery, [newID, userName], (err) => {
				if (err) {
					return res.status(500).send("Error saving the user ID");
				}
				const insertUserIdIntoBaseStaminaQuery =
					"INSERT INTO BaseStamina (userid, base_stamina, mentions) VALUES (?, ?, ?)";
				db.run(
					insertUserIdIntoBaseStaminaQuery,
					[newID, null, null],
					(err) => {
						if (err) {
							return res
								.status(500)
								.send("Error saving to BaseStamina table");
						}
						const insertUserIdIntoCurrentStaminaQuery =
							"INSERT INTO CurrentStamina (userid, current_stamina) VALUES (?, ?)";
						db.run(
							insertUserIdIntoCurrentStaminaQuery,
							[newID, null],
							(err) => {
								if (err) {
									return res
										.status(500)
										.send(
											"Error saving to CurrentStamina table"
										);
								}
								const insertUserIdIntoUserGroupsQuery =
									"INSERT INTO UserGroups (userid, groupid) VALUES (?, ?)";
								db.run(
									insertUserIdIntoUserGroupsQuery,
									[newID, null],
									(err) => {
										if (err) {
											return res
												.status(500)
												.send(
													"Error saving to userGroups table"
												);
										}
										res.send({
											userid: newID,
											user_name: userName,
										});
									}
								);
							}
						);
					}
				);
			});
		} else {
			res.redirect("/generate-username");
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
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
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
    const userId = req.query.userId;
    const staminaLevel = parseInt(req.query.staminaLevel);
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

    const settingBaseStaminaQuery = "UPDATE BaseStamina SET base_stamina = ? WHERE userid = ?;";
    
    db.run(settingBaseStaminaQuery, [baseStamina, userId], (err) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ userId, baseStamina });
    });
});


/**
 * @swagger
 * /calculateInitialStaminaByCondition:
 *   post:
 *     summary: ユーザの今日のコンディションに基づいてCurrentStaminaテーブルを更新する。
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: condition
 *         schema:
 *           type: integer
 *         required: true
 *         description: Today's condition
 *     responses:
 *       200:
 *         description: Initial stamina calculated successfully.
 *       500:
 *         description: Database error.
 */
app.post("/calculateInitialStaminaByCondition", (req, res) => {
	const { userId, condition } = req.query;

	const baseStaminaQuery = `SELECT base_stamina FROM BaseStamina WHERE userid = ?`;
	db.get(baseStaminaQuery, [userId], (err, row) => {
		if (err) return res.status(500).json({ error: "Database error" });
		if (!row)
			return res
				.status(404)
				.json({ error: "User not found in BaseStamina" });

		const baseStamina = row.base_stamina;

		const conditionMultipliers = {
			5: 1.3, // とても良い
			4: 1.1, // 良い
			3: 1.0, // 普通
			2: 0.9, // 悪い
			1: 0.7, // とても悪い
		};

		const multiplier = conditionMultipliers[condition];

		if (multiplier === undefined) {
			return res.status(400).json({ error: "Invalid condition value" });
		}

		const calculatedStamina = Math.round(baseStamina * multiplier);

		const updateStaminaQuery = `UPDATE CurrentStamina SET current_stamina = ?, todays_stamina = ? WHERE userid = ?`;
		db.run(updateStaminaQuery, [calculatedStamina, calculatedStamina, userId], (err) => {
			if (err)
				return res
					.status(500)
					.json({ error: "Database error updating stamina" });
			res.json({
				userId,
				baseStamina,
				condition,
				currentStamina: calculatedStamina
			});
		});
	});
});

/**
 * @swagger
 * /reduceStamina:
 *   post:
 *     summary: 10分に1回呼び出され、時間や歩数に応じてスタミナを減らす。
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: num
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Stamina reduced successfully.
 *       404:
 *         description: User not found or stamina not initialized.
 */
app.post("/reduceStamina", (req, res) => {
    const userId = req.query.userId;
    const num = req.query.num;

    console.log("Received userId:", userId, "num:", num);  // デバッグ用出力

    const getStepsQuery = "SELECT steps FROM Dummy WHERE userid = ? AND num = ?";
    db.get(getStepsQuery, [userId, num], (err, stepsRow) => {
        if (err) {
            console.error("Error getting steps from db:", err);
            return res.status(500).send('Error getting steps from db');
        }

        if (!stepsRow) {
            console.log("No steps found for this user and num:", userId, num);  // デバッグ用出力
            return res.status(404).send('No steps found for this user and num');
        }

        const getStaminaQuery = "SELECT todays_stamina, current_stamina FROM CurrentStamina WHERE userid = ?";
        db.get(getStaminaQuery, [userId], (err, staminaRow) => {
            if (err) {
                console.error("Error getting stamina from db:", err);
                return res.status(500).send('Error getting stamina from db');
            }

            if (!staminaRow) {
                console.log("No stamina data found for this user:", userId);  // デバッグ用出力
                return res.status(404).send('No stamina data found for this user');
            }

            console.log("Steps:", stepsRow, "Stamina:", staminaRow);
            res.json({ steps: stepsRow.steps, stamina: staminaRow });
        });
    });
});




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
 * /joinGroup:
 *   post:
 *     summary: ユーザIDとグループIDのペアをUserGroupsテーブルに格納する
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: groupId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Group created successfully.
 *       500:
 *         description: Database error.
 */
app.post("/joinGroup", (req, res) => {
    const userId = req.query.userId;
    const groupId = req.query.groupId;
    const userGroupsQuery = "UPDATE UserGroups SET groupid = ? WHERE userId = ?";
    db.run(userGroupsQuery, [groupId, userId], (err) => {
        if (err) {
            return res.status(500).send('Error updating the group ID');
        }
        res.send({ userid: userId, groupid: groupId });
    });
});

/**
 * @swagger
 * /generateRandomGroupId:
 *   post:
 *     summary: グループ名とグループIDのペアをGroupsテーブルに格納する。
 *     parameters:
 *       - in: query
 *         name: groupName
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: User name set successfully.
 *       500:
 *         description: Database error.
 */
app.post("/generateRandomGroupId", (req, res) => {
    const userId = req.query.userId;
    const groupName = req.query.groupName;
    const newID = generateRandomGroupID();
    isGroupIDUnique(newID, (unique) => {
        if (unique) {
            db.run("INSERT INTO Groups (groupid, group_name) VALUES (?, ?)", [newID, groupName], (err) => {
                if (err) {
                    return res.status(500).send('Error saving the group ID');
                }
                db.run("UPDATE UserGroups SET groupid = ? WHERE userid = ?", [newID, userId], (err) => {
                    if (err) {
                        return res.status(500).send('Error saving the group ID');
                    }
                    res.send({ userid: userId, group_name:groupName, groupid: newID });
                });
            });
        } else {
            res.redirect('/generate-groupid');
        }
    });
});

/**
 * @swagger
 * /storeMentionsInfo:
 *   post:
 *     summary: Accepts a user ID and a mentions string, then updates the mentions information in the BaseStamina table for the specified user.
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: mentions
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Mentions information stored successfully.
 *       400:
 *         description: Missing userId or mentions in request.
 *       500:
 *         description: Database error while updating mentions.
 */

app.post("/storeMentionsInfo", (req, res) => {
	const { userId, mentions } = req.query;

	console.log("userId:", userId);
	console.log("mentions:", mentions);

	if (!userId || !mentions) {
		return res.status(400).json({ error: "Missing userId or mentions" });
	}

	const updateMentionsQuery = `UPDATE BaseStamina SET mentions = ? WHERE userid = ?`;

	db.run(updateMentionsQuery, [mentions, userId], (err) => {
		if (err) {
			return res
				.status(500)
				.json({ error: "Database error updating mentions" });
		}

		res.json({
			message: "Mentions information stored successfully",
			userId,
			mentions,
		});
	});
});

/**
 * @swagger
 * /generateDummy/:
 *   post:
 *     summary: ユーザIDごとに20個のダミーデータを作成する。
 *     parameters:
 *       - in: query
 *         name: userid
 *         required: true
 *         description: The ID of the user for whom to generate dummy data.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dummy data generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userid:
 *                         type: string
 *                       num:
 *                         type: integer
 *                       steps:
 *                         type: integer
 */
app.post('/generateDummy', (req, res) => {
    const userid = req.query.userid;
    const dummyData = generateDummyData(userid);

    dummyData.forEach(data => {
        db.run(`INSERT INTO Dummy (userid, num, steps) VALUES (?, ?, ?)`, [data.userid, data.num, data.steps], function(err) {
            if (err) {
                console.error(err.message);
            }
        });
    });

    res.json({ message: 'Dummy data generated successfully', data: dummyData });
});

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
	console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});
