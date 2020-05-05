
module.exports = saveEvent = async (clientId, event, res) => {
    //Require mongoose
    const mongoose = require('mongoose');
    const log = require("online-log").log
    const {Event, Season} = require('../../mongooseModel')

    


    //Starting logic---------------
    log("DEBUG", `Request recieved for inserting new event :   ${clientId}, ${JSON.stringify(event)}`);
    //console.log('TRACE', values);
    //Connect to database
    //FIXME: Uri generating in production (with APIGateway for mongos databases)
    //const mongoUri = `mongodb://localhost:27017/${clientId}/statistic-module`
    //Uri generating for development (unique mongo uri)
    const mongoUri = `mongodb://localhost:27017/statistic-module`

    try {
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            connectTimeoutMS: 10000
        });
        console.log("DEBUG", "Successfully connected to database");

    }
    catch (error) {
        log("ERROR", error);
    }

    //Once connected
    
    let o_event_1;
    //If season prop of event object is not null, we have to get it from database to make the relationship
    
    let o_season = null;
    try{
        o_season = await Season.findOne(event.season)
        console.log(o_season);
    }
    catch (e){
        log('ERROR', e);
        log('DEBUG', 'New event has no season property');
    }

    o_event_1 = new Event(event);
    if(o_season !== null){
        o_event_1.season = o_season;
    }
    log('DEBUG', o_event_1);
    const o_error = o_event_1.validateSync();
    if (o_error) {
        log("WARN", "Validation error on requerst body against Event schema")
        res.status(403).json({ msg: "Validation error on requerst body against Event schema" })
        return;
    }
    var db = mongoose.connection;
    o_event_1.save(function (err, event) {
        if (err) {
            log("ERROR", "There has beeing an error trying to store new event on database")
            log("ERROR", err);
            db.close();
            res.status(500).json({ msg: "There has beeing an error trying to store new event on database" });
        }
        log("DEBUG", "New season saved to event collection.");
        db.close();

        res.status(200).json(event)
    });


    
}

