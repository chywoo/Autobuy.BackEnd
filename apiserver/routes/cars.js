"use strict"

const express = require('express');
const router = express.Router();
const db = require('../services/database');

const resultOK = {
    result: "OK",
    message: ""
}

/**
 * Get the list of cars
 */
router.get('/', (req, res) => {
    let makerID = req.query.makerID;
    let sql =
        "SELECT A.carID, A.makerID, A.carName, A.imageURL, B.makerName " +
        "FROM CarInfo A JOIN MakerInfo B ON (A.makerID = B.makerID)";

    if (makerID != undefined && makerID != "") {
        sql = `${sql} WHERE A.makerID = ${makerID}`;
    }

    sql = `${sql} ORDER BY makerName`;

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
                    message: "User not found."
                });
                return;
            }

            try {
                let users = [];

                for (let i = 0; i < data.length; i++) {
                    let carInfo = {
                        carID: data[i].carID,
                        carName: data[i].carName,
                        makerID: data[i].makerID,
                        imageURL: data[i].imageURL,
                        maker: {
                            makerID: data[i].makerID,
                            makerName: data[i].makerName
                        }
                    }
                    users.push(carInfo);
                }
                res.status(200).json(users);
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
 * Get the details of specific car    .
 */
router.get('/:id', (req, res) => {
    let id = req.params.id;

    let sql =
        `SELECT A.carID, A.makerID, A.carName, A.imageURL, B.makerName 
         FROM CarInfo A JOIN MakerInfo B ON (A.makerID = B.makerID) 
         WHERE carID = ${id}`;

    console.log(sql);

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
                    message: "Car not found."
                });
                return;
            }

            try {
                let carInfo = {
                    carID: data[0].carID,
                    carName: data[0].carName,
                    makerID: data[0].makerID,
                    imageURL: data[0].imageURL,
                    maker: {
                        makerID: data[0].makerID,
                        makerName: data[0].makerName
                    }
                }
                res.status(200).json(carInfo);
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

module.exports = router;
