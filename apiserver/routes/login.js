var express = require('express');
const db = require("../services/database");
var router = express.Router();

/**
 * User login
 */
router.post('/', (req, res) => {
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
        var userId, password


        // Check user Id and password parameters
        try {
            userId = req.body.userId;
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

        let sql = `SELECT COUNT(*) AS Count FROM UserInfo WHERE UserId = '${userId}' AND Password = '${password}'`;

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
                } else {
                    result = "Failure";
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
