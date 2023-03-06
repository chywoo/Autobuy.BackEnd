"use strict"

const express = require('express');
const router = express.Router();
const db = require('../services/database');


const resultOK = {
    result: "OK",
    message: ""
}



/**
 * Create post
 */
router.post('/', (req, res) => {

    // No parameters
    if (Object.keys(req.body).length === 0) {
        result.result = "NotOK";
        result.message = "No parameters";

        res.status(204).json(res);
    } else {
        console.info(req.body)
        let userName = req.body.userName;
        let title = req.body.title;
        let description = req.body.description;
        let year = req.body.year;
        let mileage = req.body.mileage;
        let condition = req.body.condition;
        let price = req.body.price;
        let carID = req.body.carID;

        // Invalid data
        if ( title === undefined
            || description === undefined
            || year === undefined
            || price === undefined
            || carID === undefined ) {

            res.status(400).json({
                result: "Error",
                message: "Post information is invalid."
            });

            return;
        }

        if ( condition === undefined ) {
            condition = "";
        }

        let sql =
            `INSERT INTO Post (title, userName, carID, \`year\`, mileage, \`condition\`, price, description)
             VALUES ( '${title}','${userName}', ${carID}, ${year}, ${mileage}, '${condition}', ${price}, '${description}' )`

        db.pool.query(sql, (err, data) => {
            let result = "OK";
            let message = "";

            if (err) {
                console.error(err.message);

                switch (err.code) {
                    case "ER_DUP_ENTRY":
                        result = "DUPLICATED";
                        message = "The post already exists.";
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
 * Get the list of posts
 */
router.get('/', (req, res) => {
    let sql =
        `SELECT A.postID, A.userName, A.carID, A.year, A.mileage, A.condition, A.price, A.description, 
                B.FullName, B.Email, 
                C.carID, C.makerID, C.carName, C.imageURL,
                D.makerName 
         FROM Post A 
              JOIN UserInfo B ON A.userName = B.userName
              JOIN CarInfo C ON A.carID = C.carID
              JOIN MakerInfo D ON C.makerID = D.makerID`

    db.pool.query(sql, (err, data) => {
        if (err) {
            console.error(err.message);
            switch (err.code) {
                default:
                    let result = "Error";
                    let message = err.sqlMessage
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
                    message: "post not found."
                });
                return;
            }

            try {
                let posts = [];

                for (let i = 0; i < data.length; i++) {
                    posts.push(makePostInfo(data[i]));
                }
                res.status(200).json(posts);
            }
            catch (err) {
                console.error(err.message)
                let result = "Error";
                let message = err.sqlMessage
                res.status(500).json({
                    result: result,
                    message: message
                });
            }
        }
    });
});

function makePostInfo(data) {
    let postInfo = {
        postID: data.postID,
        title: data.title,
        description: data.description,
        year: data.year,
        mileage: data.mileage,
        price: data.price,
        userName: data.userName,
        carID: data.carID,
        author: {
            userName: data.userName,
            password: "",
            email: data.Email,
            fullName: data.FullName,
            role: {
                roleID: 0,
                roleName: ""
            }
        },
        car: {
            carID: data.carID,
            makerID: data.makerID,
            carName: data.carName,
            imageURL: data.imageURL,
            maker: {
                makerID: data.makerID,
                makerName: data.makerName
            }
        }

    }

    return postInfo;
}

/**
 * Get the details of specific post.
 */
router.get('/:id', (req, res) => {
    let id = req.params.id;

    let sql =
        `SELECT A.postID, A.userName, A.carID, A.year, A.mileage, A.condition, A.price, A.description, 
                B.FullName, B.Email, 
                C.carID, C.makerID, C.carName, C.imageURL,
                D.makerName 
         FROM Post A 
              JOIN UserInfo B ON A.userName = B.userName
              JOIN CarInfo C ON A.carID = C.carID
              JOIN MakerInfo D ON C.makerID = D.makerID
         WHERE postID = ${id}`;

    db.pool.query(sql, (err, data) => {
        let result = "OK";
        let message = "";

        if (err) {
            console.error(err.message);

            switch (err.code) {
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
                    message: "post not found."
                });
                return;
            }

            try {
                let postInfo = makePostInfo(data[0]);
                res.status(200).json(postInfo);
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
 * Delete the specific post.
 */
router.delete('/:id', (req, res) => {
    let id = req.params.id;
    let sql = "";

    try {
        sql = `DELETE FROM Post WHERE postID = '${id}'`;
    }
    catch (err) {
        console.error(err.message)
        let result = "Error";
        let message = err.message

        // 400 Bad Request: Invalid data
        res.status(400).json({
            result: result,
            message: message
        });

        return;
    }

    db.pool.query(sql, (err, data) => {
        if (err) {
            console.error(err.message);

            switch (err.code) {
                default:
                    let result = "Error";
                    let message = err.sqlMessage
                    res.status(500).json({
                        result: result,
                        message: message
                    });
                    break;
            }
        } else {
            if (data.affectedRows === 0) {
                res.status(404).json({
                    result: "NotOK",
                    message: "post not found."
                });
            } else {
                res.status(200).json(resultOK);
            }
        }
    });
});


module.exports = router;

