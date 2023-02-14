var express = require('express');
var router = express.Router();
var db = require('../services/database');


resultOK = {
  result: "OK",
  message: ""
}



/**
 * Create user
 */
router.post('/', (req, res) => {

    // No prameters
    if (Object.keys(req.body).length === 0) {
        result.result = "NotOK";
        result.message = "No parameters";

        res.status(204).json(res);
    } else {
        console.info(req.body)

        userID = req.body.userId;
        password = req.body.password;
        fullName = req.body.userName;
        email = req.body.email;

        let sql = `INSERT INTO UserInfo(UserId, Password, FullName, Email) 
                VALUES ( '${userID}', '${password}', '${fullName}', '${email}' )`

        resultFail = {
            result: "NotOK",
            message: "ID or password are invalid."
        };

        db.pool.query(sql, (err, data) => {
            let result = "OK";
            let message = "";

            if (err) {
                console.error(err.message);

                switch (err.code) {
                    case "ER_DUP_ENTRY":
                        result = "DUPLIATED";
                        message = "The user already exists.";
                        res.status(400);
                        break;

                    default:
                        result = "Error";
                        message = err.sqlMessage
                        res.status(500);
                        break;
                }
            }
            res.json({
                result: result,
                message: message
            });
        });
    }
});

/**
 * Get User information
 */
router.get('/', (req, res) => {

    let result = {
        result: "OK",
        message: ""
    }

    // No prameters
    if (Object.keys(req.body).length === 0) {
        result.result = "NotOK";
        result.message = "No parameters";

        res.status(204).end(); //.send("Bad Request");
        //res.json(result);
    } else {
        console.info(req.body)

        userID = req.body.userId;
        password = req.body.password;
        fullName = req.body.userName;
        email = req.body.email;

        let sql = `INSERT INTO UserInfo(UserId, Password, FullName, Email) 
                VALUES ( ${userID}, ${password}, ${fullName}, ${email} )`

        resultFail = {
            result: "NotOK",
            message: "ID or password are invalid."
        };
        db.DBPool.query(sql, (err, data) => {
            if (err) throw err;

            console.log(data);
        });

        res.json(resultOK);
    }
});


module.exports = router;
