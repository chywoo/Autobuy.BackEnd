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

        userName = req.body.userName;
        password = req.body.password;
        fullName = req.body.fullName;
        email = req.body.email;

        // Invalid data
        if ( userName === undefined
            || password === undefined
            || fullName === undefined
            || email === undefined ) {

            res.status(400).json({
                result: "Error",
                message: "ID or password are invalid."
            });

            return;
        }

        let sql = `INSERT INTO UserInfo (UserName, Password, FullName, Email) 
                VALUES ( '${userName}', '${password}', '${fullName}', '${email}' )`


        db.pool.query(sql, (err, data) => {
            let result = "OK";
            let message = "";

            if (err) {
                console.error(err.message);

                switch (err.code) {
                    case "ER_DUP_ENTRY":
                        result = "DUPLICATED";
                        message = "The user already exists.";
                        res.status(200).json({
                            result: result,
                            message: message
                        });
                        break;

                    default:
                        result = "Error";
                        message = err.sqlMessage
                        res.status(500).json({
                            result: result,
                            message: message
                        });
                        break;
                }
            } else {
                res.status(200).json({
                    result: result,
                    message: message
                });
            }
        });
    }
});

/**
 * Get the list of users
 */
router.get('/', (req, res) => {
});

/**
 * Get the details of specific user.
 */
router.get('/:userName', (req, res) => {
    userName = req.params.userName;

    let sql = `SELECT * FROM UserInfo WHERE userName = '${userName}'`;

    db.pool.query(sql, (err, data) => {
        if (err) {
            console.error(err.message);

            switch (erro.code) {
                case "ER_DUP_ENTRY":
                    result = "DUPLICATED";
                    message = "The user already exists.";
                    res.status(200).json({
                        result: result,
                        message: message
                    });
                    break;

                default:
                    result = "Error";
                    message = err.sqlMessage
                    res.status(500).json({
                        result: result,
                        message: message
                    });
                    break;
            }
        } else {
            if (data.length === 0) {
                res.status(404).json({
                    result: "NotOK",
                    message: "User not found."
                });
                return;
            }

            try {
                userInfo = {
                    userName: data[0].userName,
                    password: "",
                    fullName: data[0].fullName,
                    email: data[0].Email
                }
                res.status(200).json(userInfo);
            }
            catch (err) {
                console.error(err.message)
                result = "Error";
                message = err.sqlMessage
                res.status(500).json({
                    result: result,
                    message: message
                });
            }
        }
    });
});

/**
 * Update the specific user.
 */
router.put('/:userName', (req, res) => {
});

/**
 * Delete the specific user.
 */
router.delete('/:userName', (req, res) => {
});


module.exports = router;
