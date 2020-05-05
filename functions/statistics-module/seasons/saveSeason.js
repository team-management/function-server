
module.exports = saveSeason = async (clientId, season, res) => {
    //Require mongoose
    const mongoose = require('mongoose');
    const log = require("online-log").log
    const {Season} = require('../../mongooseModel')

    


    //Starting logic---------------
    log("DEBUG", `Request recieved for inserting new season :   ${clientId}, ${JSON.stringify(season)}`);
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
    
    let o_season_1;

    o_season_1 = new Season(season);
    const o_error = o_season_1.validateSync();
    if (o_error) {
        log("WARN", "Validation error on requerst body against Season schema")
        res.status(403).json({ msg: "Validation error on requerst body against Season schema" })
        return;
    }
    var db = mongoose.connection;
    o_season_1.save(function (err, season) {
        if (err) {
            log("ERROR", "There has beeing an error trying to store new season on database")
            log("ERROR", err);
            db.close();
            res.status(500).json({ msg: "There has beeing an error trying to store new season on database" });
        }
        log("DEBUG", "New season saved to seasons collection.");
        db.close();

        res.status(200).json(season)
    });




    //





}

