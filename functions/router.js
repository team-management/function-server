var express = require('express');
var router = express.Router();
const log = require("../online-log").log


router.post("/newStatistic", (req, res) =>{
    //console.log(onlinelogger.logger.uid)

    const { mongoUri, userId , statistic} = req.body;

    require("./saveStatistic")(mongoUri,userId, statistic, res )

    
    
});

router.get("/getstatistic", (req, res) =>{
    //console.log(onlinelogger.logger.uid)

    const { mongoUri, userId , filter} = req.body;

    require("./getStatistics")(mongoUri,userId, filter, res )

    
    
});



module.exports = router