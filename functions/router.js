var express = require('express');
var router = express.Router();
const log = require("online-log").log


router.post("/newStatistic", (req, res) =>{
    //console.log(onlinelogger.logger.uid)

    const {  clientId , statistic} = req.body;

    require("./statistics-module/statistics/saveStatistic")(clientId, statistic, res )
    
});

router.get("/getStatistic", (req, res) =>{
    //console.log(onlinelogger.logger.uid)

    const {  clientId , filter} = req.body;
    try{
        require("./statistics-module/statistics/getStatistics")(clientId, filter, res )

    }
    catch(error){
        log('ERROR', error);
    }

    
    
});

router.put("/updateStatistic", (req, res) =>{
    //console.log(onlinelogger.logger.uid)

    const {  clientId , selector, values} = req.body;
    try{
        require("./statistics-module/statistics/updateStatistic")( clientId, selector, values, res )

    }
    catch(error){
        log('ERROR', error);
    }

    
    
});


router.put("/addValueStatistic", (req, res) =>{
    //console.log(onlinelogger.logger.uid)

    log('DEBUG', req.body);
    const {  clientId , selector, values} = req.body;
    try{
        require("./statistics-module/statistics/addValueStatistic")( clientId, selector, values, res )

    }
    catch(error){
        log('ERROR', error);
    }

    
    
});

router.delete("/deleteStatistic", (req, res) =>{
    //console.log(onlinelogger.logger.uid)

    const {  clientId , selector } = req.body;
    try{
        require("./statistics-module/statistics/deleteStatistic")( clientId, selector, res )

    }
    catch(error){
        log('ERROR', error);
    }

    
    
});


/**
 * 
 * Routes for season CRUD
 * 
 */
router.get("/getSeason", (req, res) =>{
    //console.log(onlinelogger.logger.uid)

    const {  clientId , filter} = req.body;
    try{
        require("./statistics-module/seasons/getSeason")(clientId, filter, res )

    }
    catch(error){
        log('ERROR', error);
    }

    
    
});

router.post("/newSeason", (req, res) =>{
    //console.log(onlinelogger.logger.uid)

    const {  clientId , season} = req.body;

    require("./statistics-module/seasons/saveSeason")(clientId, season, res )
    
});

router.delete("/deleteSeason", (req, res) =>{
    //console.log(onlinelogger.logger.uid)

    const {  clientId , selector } = req.body;
    try{
        require("./statistics-module/seasons/deleteSeason")( clientId, selector, res )

    }
    catch(error){
        log('ERROR', error);
    }

    
    
});

/**
 * 
 * Routes for event CRUD
 * 
 */
router.get("/getEvent", (req, res) =>{
    //console.log(onlinelogger.logger.uid)

    const {  clientId , filter} = req.body;
    try{
        require("./statistics-module/events/getEvent")(clientId, filter, res )

    }
    catch(error){
        log('ERROR', error);
    }

    
    
});

router.post("/newEvent", (req, res) =>{
    //console.log(onlinelogger.logger.uid)

    const {  clientId , event} = req.body;

    require("./statistics-module/events/saveEvent")(clientId, event, res )
    
});

router.delete("/deleteEvent", (req, res) =>{
    //console.log(onlinelogger.logger.uid)

    const {  clientId , selector } = req.body;
    try{
        require("./statistics-module/events/deleteEvent")( clientId, selector, res )

    }
    catch(error){
        log('ERROR', error);
    }

});

module.exports = router