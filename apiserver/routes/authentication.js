var express = require('express');
const db = require("../services/database");
var router = express.Router();

/**
 * /auth/login
 */
router.post('/login', (req, res) => {
    // session check
    if (req.session.islogin) {
        res.json({
            result: "OK",
            message: "Already logged in"
        });
        return;
    }

    if (Object.keys(req.body).length < 2) {
        var result = "Error";
        var message = "Wrong parameters";

        console.debug(message);

        res.status(204).json({
            result: result,
            message: message
        });

        return;
    } else {
        console.debug(req.body)
        var userName, password


        // Check user Id and password parameters
        try {
            userName = req.body.userName;
            password = req.body.password;
        } catch (ex) {
            console.error(ex.message);
            result = "Error";
            message = "Wrong parameters";
            res.status(204).json({
                result: result,
                message: message
            });

            return
        }

        let sql = `SELECT COUNT(*) AS Count FROM UserInfo WHERE UserName = '${userName}' AND Password = '${password}'`;

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
                console.debug(data);

                if (data[0].Count > 0) {
                    result = "OK";
                    req.session.islogin = true;
                } else {
                    result = "Failure";
                    message = "Wrong user name or password";
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
