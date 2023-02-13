var express = require('express');
var router = express.Router();


resultOK = {
  result: "OK",
  message: ""
}

/* GET users listing. */
router.get('/', (req, res) => {

      resultFail = {
      }

      res.json(resultOK)
    })
router.post('/', (req, res) => {
      console.info(req.body)

      userID = req.body.userId
      password = req.body.password

      resultFail = {
          result: "NotOK",
          message: "ID or password are invalid."
      }

      res.json(resultFail)
    });


module.exports = router;
