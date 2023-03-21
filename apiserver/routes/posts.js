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
        let description = req.body.description
            .replaceAll("'", "\\'" )
            .replaceAll("\"", "\\");
        let year = req.body.year;
        let mileage = req.body.mileage;
        let condition = req.body.condition;
        let price = req.body.price;
        let carID = req.body.carID;

        // Invalid data
        if ( title === undefined
            || description === undefined
            || year === undefined
            || mileage === undefined
            || condition === undefined
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

        console.log(sql);
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
                res.status(201).json({
                    result: result,
                    message: message
                });
            }
        });
    }
});

/**
 * Get the list of posts
 *
 * @param offset
 * @param limit
 * @returns {Array}
 */
router.get('/', (req, res) => {
    let pageSize = req.query.pageSize;
    let page = req.query.page;
    let filterQuery = "";
    let dbOffset = 0;
    let dbLimit = 10;

    if (pageSize === undefined) {
        pageSize = 10;
    }

    if (page === undefined || page < 0 ) {
        page = 0;
    }

    dbOffset = page * pageSize;
    dbLimit = pageSize;

    // filter by userName
    if (req.query.userName != undefined) {
        filterQuery += ` AND A.userName = '${req.query.userName}'`;
    }

    // filter by makerID
    if (req.query.makeID != undefined) {
        filterQuery += ` AND C.makerID = '${req.query.makerID}'`;
    }

    // filter by maxPrice
    if (req.query.maxPrice != undefined) {
        filterQuery += ` AND A.price <= ${req.query.maxPrice}`;
    }

    // filter by minYear
    if (req.query.minYear != undefined) {
        filterQuery += ` AND A.year >= ${req.query.minYear}`;
    }

    let sql =
        `
        SELECT COUNT(*)
        FROM Post A 
             JOIN UserInfo B ON A.userName = B.userName
             JOIN CarInfo C ON A.carID = C.carID
             JOIN MakerInfo D ON C.makerID = D.makerID
        WHERE 1 = 1 
             ${filterQuery};
        SELECT A.postID, A.userName, A.carID, A.year, A.mileage, A.condition, 
                A.price, A.title, A.description, 
                B.FullName, B.Email, 
                C.carID, C.makerID, C.carModel, C.imageURL,
                D.makerName 
        FROM Post A 
             JOIN UserInfo B ON A.userName = B.userName
             JOIN CarInfo C ON A.carID = C.carID
             JOIN MakerInfo D ON C.makerID = D.makerID
        WHERE 1 = 1 
             ${filterQuery}
        ORDER BY A.postID DESC
        LIMIT ${dbOffset }, ${dbLimit}`;

    db.pool.query(sql, (err, data) => {
        if (err) {
            console.error(sql)
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
            if (data[1].length === 0) {
                console.log(sql);
                res.status(404).json({
                    result: "NotOK",
                    message: "post not found."
                });
                return;
            }

            try {
                let numPosts = data[0][0]["COUNT(*)"];

                let posts = [];

                for (let i = 0; i < data[1].length; i++) {
                    posts.push(makePostInfo(data[1][i]));
                }

                let postList = {
                    total: numPosts,
                    pageSize: pageSize,
                    page: page,
                    posts: posts
                }

                res.status(200).json(postList);
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

/**
 * Get JSON object of post information.
 */
function makePostInfo(data) {
    let postInfo = {
        postID: data.postID,
        title: data.title,
        description: data.description,
        year: data.year,
        mileage: data.mileage,
        condition: data.condition,
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
            carModel: data.carModel,
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
        `SELECT A.postID, A.userName, A.carID, A.year, A.mileage, A.condition,  
                A.price, A.title, A.description, 
                B.FullName, B.Email, 
                C.carID, C.makerID, C.carModel, C.imageURL,
                D.makerName 
         FROM Post A 
              JOIN UserInfo B ON A.userName = B.userName
              JOIN CarInfo C ON A.carID = C.carID
              JOIN MakerInfo D ON C.makerID = D.makerID
         WHERE postID = ${id}
         ORDER BY A.postID DESC`;

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
 * Update the specific post.
 */
router.put('/:id', (req, res) => {
    let id = req.params.id;
    let post = req.body;
    let sql = "";

    let title = post.title;
    let description = post.description;
    let year = post.year;
    let mileage = post.mileage;
    let condition = post.condition;
    let price = post.price;

    if (title === undefined || title === "") {
        res.status(400).json({
            result: "Error",
            message: "title is required."
        });
        return;
    }

    if (description === undefined || description === "") {
        res.status(400).json({
            result: "Error",
            message: "description is required."
        });
        return;
    }

    if (year === undefined || year === "") {
        res.status(400).json({
            result: "Error",
            message: "year is required."
        });
        return;
    }

    if (mileage === undefined || mileage === "") {
        res.status(400).json({
            result: "Error",
            message: "mileage is required."
        });
        return;
    }

    if (condition === undefined || condition === "") {
        res.status(400).json({
            result: "Error",
            message: "condition is required."
        });
        return;
    }

    if (price === undefined || price === "") {
        res.status(400).json({
            result: "Error",
            message: "price is required."
        });
        return;
    }

    try {
        sql =
            `UPDATE Post
            SET 
                title = '${post.title}',
                description = '${post.description}',
                year = ${post.year},
                mileage = ${post.mileage},
                \`condition\` = '${post.condition}',
                price = ${post.price}
            WHERE postID = ${id}`;
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
        let result = "OK";
        let message = "";

        if (err) {
            console.error(sql)
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
            if (data.affectedRows === 0) {
                res.status(404).json({
                    result: "NotOK",
                    message: "The post not found."
                });
            } else {
                res.status(200).json(resultOK);
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

