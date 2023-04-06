var express = require('express');
const db = require("../services/database");
var router = express.Router();

/**
 * Check if user is logged in
 */
router.get('/', (req, res) => {
    // check system status
    if (req.app.locals.suspendSystem) {
        res.status(503).json({
            result: "Error",
            message: "Service suspended"
        });
        return;
    }

    if (req.session.islogin) {
        res.json({
            result: "OK",
            message: "Already logged in"
        });
    } else {
        res.status(401).json({
            result: "Error",
            message: "Not logged in"
        });
    }
});

/**
 * Log out
 */
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            res.status(500).json({
                result: "Error",
                message: "Internal server error"
            });
        } else {
            res.json({
                result: "OK",
                message: "Logout success"
            });
        }
    });
});


/**
 * Login with username and password, or with access key.
 */
router.post('/login', (req, res) => {
    // check system status
    if (req.app.locals.suspendSystem) {
        res.status(503).json({
            result: "Error",
            message: "Service suspended"
        });
        return;
    }

    // session check
    if (req.session.islogin) {
        res.json({
            result: "OK",
            message: "Already logged in"
        });
        return;
    }

    // strip "Bearer " from the header
    // Data: Bearer e9ffa2784d1a4e75985105b6267ca867
    let accessKey = req.headers.authorization;
    if (accessKey != undefined)
        accessKey = accessKey.substring(7);

    if (Object.keys(req.body).length < 2 && accessKey == undefined) {
        var result = "Error";
        var message = "Wrong parameters";

        console.debug(message);

        res.status(401).json({
            result: result,
            message: message
        });

        return;
    } else {
        let sql = "";

        if ( accessKey )
        {
            // check system status
            if (req.app.locals.suspendAccessToken) {
                res.status(503).json({
                    result: "Error",
                    message: "Service suspended"
                });
                return;
            }

            sql =
                `SELECT B.*, C.roleName 
                FROM AccessKeys A 
                     JOIN UserInfo B ON A.userName = B.userName 
                     JOIN Roles C ON B.roleID = C.roleID
                WHERE A.accessKey = '${accessKey}'`;
        } else {
            var userName, password

            // Check username and password parameters
            try {
                userName = req.body.userName;
                password = req.body.password;
            } catch (ex) {
                console.error(ex.message);
                result = "Error";
                message = "Wrong parameters";
                res.status(401).json({
                    result: result,
                    message: message
                });

                return
            }

            sql = `
            SELECT userName, fullName, roleID 
            FROM UserInfo 
            WHERE userName = '${userName}' AND password = SHA2('${password}', 256)`;
        }

        db.pool.query(sql, (err, data) => {
            let result = "OK";
            let message = "";

            if (err) {
                console.error(err.message);

                switch (err.code) {
                    default:
                        result = "Error";
                        message = err.sqlMessage
                        res.status(500);
                        break;
                }
            } else {
                if (data.length > 0) {
                    result = "OK";
                    req.session.islogin = true;
                    req.session.userName = data[0].userName;
                    req.session.roleID = data[0].roleID;
                } else {
                    console.error(sql);
                    res.status(401);
                    result = "Error";
                    message = "Wrong information";
                }
            }
            res.json({
                result: result,
                message: message
            });
        });
    }
});

module.exports = router;
