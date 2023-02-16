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

            res.status(400);
            res.json({
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
 * Get the list of users
 */
router.get('/', (req, res) => {
});

/**
 * Get the details of specific user.
 */
router.get('/:userID', (req, res) => {
});

/**
 * Delete the specific user.
 */
router.delete('/:userID', (req, res) => {
});


module.exports = router;
