const express = require("express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const app = express();
const sqlite3 = require("sqlite3");
const port = 8000;
const moment = require("moment");
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(cors());
app.use(bodyParser.json());
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

// function
const generateRandomUserID = () => {
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let result = "";
	for (let i = 0; i < 8; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		result += characters[randomIndex];
	}
	return result;
};

const isUserIDUnique = (userid, callback) => {
	db.get(
		"SELECT userid FROM UserNames WHERE userid = ?",
		[userid],
		(err, row) => {
			callback(!row);
		}
	);
};

const generateRandomGroupID = () => {
	return Math.floor(1000 + Math.random() * 9000);
};

const isGroupIDUnique = (groupid, callback) => {
	db.get(
		"SELECT groupid FROM Groups WHERE groupid = ?",
		[groupid],
		(err, row) => {
			callback(!row);
		}
	);
};

function generateDummyData(userid) {
	const dummyData = [];

	for (let i = 0; i < 20; i++) {
		dummyData.push({
			userid: userid,
			num: i + 1,
			steps: Math.floor(Math.random() * 2000),
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
 *       - in: body
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
	console.log("setUserName called ok!");
	console.log("Request body:", req.body);
	const userName = req.body.userName;
	const newID = generateRandomUserID();

	isUserIDUnique(newID, (unique) => {
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
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           properties:
 *             userId:
 *               type: string
 *             stamina:
 *               type: integer
 *           required:
 *             - userId
 *             - stamina
 *     responses:
 *       200:
 *         description: Base stamina calculated successfully.
 *       500:
 *         description: Database error.
 */

app.post("/calculateBaseStaminaByUserInput", (req, res) => {
	console.log("calculateBaseStaminaByUserInput is called ok!");
	const { userId, stamina } = req.body;

	if (!userId || stamina === undefined) {
		return res.status(400).json({ error: "Missing userId or stamina" });
	}

	let staminaLevel;
	let baseStamina;

	if (stamina >= 1 && stamina <= 20) {
		staminaLevel = 1;
	} else if (stamina >= 21 && stamina <= 40) {
		staminaLevel = 2;
	} else if (stamina >= 41 && stamina <= 60) {
		staminaLevel = 3;
	} else if (stamina >= 61 && stamina <= 80) {
		staminaLevel = 4;
	} else if (stamina >= 81 && stamina <= 100) {
		staminaLevel = 5;
	} else {
		staminaLevel = 3; // デフォルトの値
	}

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

	const settingBaseStaminaQuery =
		"UPDATE BaseStamina SET base_stamina = ? WHERE userid = ?;";

	db.run(settingBaseStaminaQuery, [baseStamina, userId], (err) => {
		if (err) {
			console.error("Database error:", err);
			return res.status(500).json({ error: "Database error" });
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
	console.log("calculateInitialStaminaByCondition is called ok!");
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
		db.run(
			updateStaminaQuery,
			[calculatedStamina, calculatedStamina, userId],
			(err) => {
				if (err)
					return res
						.status(500)
						.json({ error: "Database error updating stamina" });
				res.json({
					userId,
					baseStamina,
					condition,
					currentStamina: calculatedStamina,
				});
			}
		);
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
	console.log("reduceStamina is called ok!");
	const userId = req.query.userId;
	const num = req.query.num;

	const getStepsQuery =
		"SELECT steps FROM Dummy WHERE userid = ? AND num = ?";
	db.get(getStepsQuery, [userId, num], (err, stepsRow) => {
		if (err) {
			console.error("Error getting steps from db:", err);
			return res.status(500).send("Error getting steps from db");
		}

		let newStamina;
		if (steps <= 300) {
			newStamina = staminaRow.current_stamina - 300;
		} else {
			newStamina = staminaRow.current_stamina - steps;
		}
		const updateStaminaQuery =
			"UPDATE CurrentStamina SET current_stamina = ? WHERE userid = ?";
		db.run(updateStaminaQuery, [newStamina, userId], (err) => {
			if (err) {
				console.error("Error updating stamina:", err);
				return res.status(500).send("Error updating stamina");
			}
			res.json({ currentstamina: newStamina });
		});
	});
});

/**
 * @swagger
 * /recoverStaminaByRest:
 *   post:
 *     summary: current_staminaをtodays_staminaと同じにします。
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Stamina recovered successfully.
 *       404:
 *         description: User not found or stamina not initialized.
 */

app.post("/recoverStaminaByRest", (req, res) => {
	console.log("recoverStaminaByRest is called ok!");
	const userId = req.query.userId;
	const getStaminaQuery =
		"SELECT todays_stamina FROM CurrentStamina WHERE userid = ?";
	db.get(getStaminaQuery, [userId], (err, staminaRow) => {
		if (err) {
			console.error("Error getting stamina from db:", err);
			return res.status(500).send("Error getting stamina from db");
		}

		if (!staminaRow) {
			console.log("No stamina data found for this user:", userId); // デバッグ用出力
			return res.status(404).send("No stamina data found for this user");
		}

		const todaysStamina = staminaRow.todays_stamina;
		const recoverStaminaQuery =
			"UPDATE CurrentStamina SET current_stamina = ? WHERE userid = ?";
		db.run(recoverStaminaQuery, [todaysStamina, userId], (err) => {
			if (err) {
				console.error("Error updating current_stamina", err);
				return res.status(500).send("Error updating current_stamina");
			}
		});
		res.json({ currentstamina: todaysStamina });
	});
});

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
	console.log("joinGroup is called ok!");
	const userId = req.query.userId;
	const groupId = req.query.groupId;
	const userGroupsQuery =
		"UPDATE UserGroups SET groupid = ? WHERE userId = ?";
	db.run(userGroupsQuery, [groupId, userId], (err) => {
		if (err) {
			return res.status(500).send("Error updating the group ID");
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
	console.log("generateRandomGroupId is called ok!");
	const userId = req.query.userId;
	const groupName = req.query.groupName;
	const newID = generateRandomGroupID();
	isGroupIDUnique(newID, (unique) => {
		if (unique) {
			db.run(
				"INSERT INTO Groups (groupid, group_name) VALUES (?, ?)",
				[newID, groupName],
				(err) => {
					if (err) {
						return res
							.status(500)
							.send("Error saving the group ID");
					}
					db.run(
						"UPDATE UserGroups SET groupid = ? WHERE userid = ?",
						[newID, userId],
						(err) => {
							if (err) {
								return res
									.status(500)
									.send("Error saving the group ID");
							}
							res.send({
								userid: userId,
								group_name: groupName,
								groupid: newID,
							});
						}
					);
				}
			);
		} else {
			res.redirect("/generate-groupid");
		}
	});
});

/**
 * @swagger
 * /storeMentionsInfo:
 *   post:
 *     summary: Accepts a user ID and a mentions string, then updates the mentions information in the BaseStamina table for the specified user.
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           properties:
 *             userId:
 *               type: string
 *             mentions:
 *               type: string
 *           required:
 *             - userId
 *             - mentions
 *     responses:
 *       200:
 *         description: Mentions information stored successfully.
 *       400:
 *         description: Missing userId or mentions in request.
 *       500:
 *         description: Database error while updating mentions.
 */

app.post("/storeMentionsInfo", (req, res) => {
	console.log("storeMentionsInfo is called ok!");
	const { userId, mentions } = req.body;

	if (!userId || !mentions) {
		return res.status(400).json({ error: "Missing userId or mentions" });
	}

	console.log("userId:", userId);
	console.log("mentions:", mentions);

	const updateMentionsQuery = `UPDATE BaseStamina SET mentions = ? WHERE userid = ?`;

	db.run(updateMentionsQuery, [mentions, userId], (err) => {
		if (err) {
			console.error("Database error:", err);
			return res.status(500).json({ error: "Database error updating mentions" });
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
 * /removeUserFromGroupAfterEvent:
 *   post:
 *     summary: おでかけ終了したときに、ユーザIDとグループIDの紐付けを削除する。
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: remove groupid successfully.
 *       404:
 *         description: User not found.
 */

app.post("/removeUserFromGroupAfterEvent", (req, res) => {
	console.log("removeUserFromGroupAfterEvent");
	const userId = req.query.userId;
	const removeGroupIdQuery =
		"UPDATE UserGroups SET groupid = ? WHERE userid = ?";
	db.run(removeGroupIdQuery, [null, userId], (err) => {
		if (err) {
			console.error(err.message);
			return res.status(500).json({ error: "Failed to remove groupid" });
		}
		res.status(200).json({
			message: "Groupid removed successfully",
			userId,
		});
	});
});

/**
 * @swagger
 * /getUserName:
 *   get:
 *     summary: useridからusernameを取得する
 *     description: Returns the name of the user based on the provided user ID from the UserNames table.
 *     parameters:
 *       - in: query
 *         name: userid
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user whose name is being retrieved.
 *     responses:
 *       200:
 *         description: User name retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userid:
 *                   type: string
 *                   example: "user123"
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Database error while retrieving user name.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Database error retrieving user name"
 */
app.get("/getUserName", (req, res) => {
	console.log("getUserName is called ok!");
	const { userid } = req.query;

	const getUserNameQuery = "SELECT name FROM UserNames WHERE userid = ?";

	db.get(getUserNameQuery, [userid], (err, row) => {
		if (err) {
			console.error("Database error:", err);
			return res
				.status(500)
				.json({ error: "Database error retrieving user name" });
		}

		if (!row) {
			return res.status(404).json({ error: "User not found" });
		}

		res.json({ userid, name: row.name });
	});
});

/**
 * @swagger
 * /displayTurtleStaminaLevel:
 *   get:
 *     summary: 現在のグループメンバーの体力から、亀にレベルを伝える。
 *     parameters:
 *       - in: query
 *         name: groupId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Stamina check result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: integer
 *                   description: Stamina check result (1, 2, or 3)
 *                   example: 2
 *       500:
 *         description: Database error
 */
app.get("/displayTurtleStaminaLevel", (req, res) => {
	console.log("displayTurtleStaminaLevel is called ok!");
	const groupId = req.query.groupId;

	const query = `
        SELECT cs.todays_stamina, cs.current_stamina 
        FROM CurrentStamina cs
        JOIN UserGroups ug ON cs.userid = ug.userid
        WHERE ug.groupId = ?
    `;

	db.all(query, [groupId], (err, rows) => {
		if (err) {
			res.status(500).json({ error: "Database error" });
			return;
		}

		let result;
		for (const row of rows) {
			const { todays_stamina, current_stamina } = row;
			console.log(row);
			if (current_stamina <= todays_stamina / 3) {
				result = 1;
				break;
			} else if (current_stamina <= (2 * todays_stamina) / 3) {
				result = 2;
			} else {
				result = 3;
			}
		}

		res.json({ result });
	});
});

/**
 * @swagger
 * /getGroupMembers:
 *   get:
 *     summary: 指定されたユーザIDと同じグループのメンバーを取得する
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         description: グループメンバーを取得するためのユーザID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 同じグループのユーザIDのリストを返す
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userid:
 *                     type: string
 *                     description: 同じグループに属するユーザのID
 *             example:
 *               - userid: "12345"
 *               - userid: "67890"
 *       400:
 *         description: userId パラメータが不足している場合のエラー
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error: userId is required"
 *       404:
 *         description: 指定されたユーザがどのグループにも属していない場合のエラー
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found in any group"
 *       500:
 *         description: サーバーエラーが発生した場合のエラー
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error retrieving group members"
 */
app.get("/getGroupMembers", (req, res) => {
	console.log("getGroupMembers is called ok!");
	const userId = req.query.userId;
	if (!userId) {
		return res.status(400).send("Error: userId is required");
	}

	const getGroupIdQuery = "SELECT groupid FROM UserGroups WHERE userid = ?";
	db.get(getGroupIdQuery, [userId], (err, row) => {
		if (err) {
			return res.status(500).send("Error retrieving group ID");
		}

		if (!row) {
			return res.status(404).send("User not found in any group");
		}

		const groupId = row.groupid;

		const getMembersQuery =
			"SELECT userid FROM UserGroups WHERE groupid = ?";
		db.all(getMembersQuery, [groupId], (err, rows) => {
			if (err) {
				return res.status(500).send("Error retrieving group members");
			}
			res.json(rows);
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
app.post("/generateDummy", (req, res) => {
	console.log("generateDummy is called ok!");
	const userid = req.query.userid;
	const dummyData = generateDummyData(userid);

	dummyData.forEach((data) => {
		db.run(
			`INSERT INTO Dummy (userid, num, steps) VALUES (?, ?, ?)`,
			[data.userid, data.num, data.steps],
			function (err) {
				if (err) {
					console.error(err.message);
				}
			}
		);
	});

	res.json({ message: "Dummy data generated successfully", data: dummyData });
});

/**
 * @swagger
 * /getGroupName:
 *   get:
 *     summary: Retrieve the group name associated with a specific group ID.
 *     description: Returns the name of the group based on the provided group ID from the Groups table.
 *     parameters:
 *       - in: query
 *         name: groupid
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the group whose name is being retrieved.
 *     responses:
 *       200:
 *         description: Group name retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 groupid:
 *                   type: integer
 *                   example: 1234
 *                 group_name:
 *                   type: string
 *                   example: "Development Team"
 *       404:
 *         description: Group not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Group not found"
 *       500:
 *         description: Database error while retrieving group name.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Database error retrieving group name"
 */
app.get("/getGroupName", (req, res) => {
	const { groupid } = req.query;

	const getGroupNameQuery = "SELECT group_name FROM Groups WHERE groupid = ?";

	db.get(getGroupNameQuery, [groupid], (err, row) => {
		if (err) {
			console.error("Database error:", err);
			return res
				.status(500)
				.json({ error: "Database error retrieving group name" });
		}

		if (!row) {
			return res.status(404).json({ error: "Group not found" });
		}

		res.json({
			groupid: parseInt(groupid, 10),
			group_name: row.group_name,
		});
	});
});

/**
 * @swagger
 * /getStaminaGauge:
 *   get:
 *     summary: Retrieves today's stamina and current stamina for a given user.
 *     description: Returns the today's stamina and current stamina values from the CurrentStamina table for the specified user ID.
 *     parameters:
 *       - in: query
 *         name: userid
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user whose stamina information is being retrieved.
 *     responses:
 *       200:
 *         description: Stamina information retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userid:
 *                   type: string
 *                   example: "user123"
 *                 todays_stamina:
 *                   type: integer
 *                   example: 7200
 *                 current_stamina:
 *                   type: integer
 *                   example: 5400
 *       404:
 *         description: User not found in CurrentStamina.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found in CurrentStamina"
 *       500:
 *         description: Database error while retrieving stamina data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Database error retrieving stamina data"
 */
app.get("/getStaminaGauge", (req, res) => {
	const { userid } = req.query;

	const getStaminaQuery = `
        SELECT todays_stamina, current_stamina
        FROM CurrentStamina
        WHERE userid = ?
    `;

	db.get(getStaminaQuery, [userid], (err, row) => {
		if (err) {
			console.error("Database error:", err);
			return res
				.status(500)
				.json({ error: "Database error retrieving stamina data" });
		}

		if (!row) {
			return res
				.status(404)
				.json({ error: "User not found in CurrentStamina" });
		}

		res.json({
			userid,
			todays_stamina: row.todays_stamina,
			current_stamina: row.current_stamina,
		});
	});
});

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
	console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});
