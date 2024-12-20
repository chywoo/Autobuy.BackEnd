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
    let makeID = req.query.makeID;
    let sql =
        `SELECT A.carID, A.makeID, A.carModel, A.imageURL, B.makeName,
         C.displacement, C.wheelbase, C.length, C.width, C.height 
         FROM CarInfo A 
              JOIN MakeInfo B ON (A.makeID = B.makeID) 
              LEFT JOIN CarTrim C ON (A.carID = C.carID)`;

    if (makeID != undefined && makeID != "") {
        sql = `${sql} WHERE A.makeID = ${makeID}`;
    }

    sql = `${sql} ORDER BY makeName`;

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
                    message: "Not found."
                });
                return;
            }

            try {
                let cars = [];

                for (let i = 0; i < data.length; i++) {
                    let carInfo = {
                        carID: data[i].carID,
                        carModel: data[i].carModel,
                        makeID: data[i].makeID,
                        imageURL: data[i].imageURL,
                        make: {
                            makeID: data[i].makeID,
                            makeName: data[i].makeName
                        },
                        displacement: data[i].displacement,
                        wheelbase: data[i].wheelbase,
                        length: data[i].length,
                        width: data[i].width,
                        height: data[i].height
                    }
                    cars.push(carInfo);
                }
                res.status(200).json(cars);
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
    let id = parseInt(req.params.id);

    // Check if ID is a number.
    if ( typeof id != 'number' ) {
        res.status(400).json({
            result: "Error",
            message: "ID must be a number."
        });
        return;
    }

    let sql =
        `SELECT A.carID, A.makeID, A.carModel, A.imageURL, B.makeName,
         C.displacement, C.wheelbase, C.length, C.width, C.height 
         FROM CarInfo A 
              JOIN MakeInfo B ON (A.makeID = B.makeID) 
              LEFT JOIN CarTrim C ON (A.carID = C.carID)
         WHERE A.carID = ${id}`;

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
                    carModel: data[0].carModel,
                    makeID: data[0].makeID,
                    imageURL: data[0].imageURL,
                    make: {
                        makeID: data[0].makeID,
                        makeName: data[0].makeName
                    },
                    displacement: data[0].displacement,
                    wheelbase: data[0].wheelbase,
                    length: data[0].length,
                    width: data[0].width,
                    height: data[0].height
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
