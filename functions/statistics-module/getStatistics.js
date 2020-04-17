
module.exports = getStatistics = async (mongoUri, userId, filter, res) => {
    //Require mongoose
    const mongoose = require('mongoose');
    const log = require("online-log").log
    const { Statistic } = require('../mongooseModel')


    //Starting logic---------------
    log("DEBUG", `Request recieved for searching for statistic documents:  ${mongoUri} , ${userId}, ${JSON.stringify(filter)}`);

    //Connect to database
    try {
        await mongoose.connect(mongoUri + "/statistic-module", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            connectTimeoutMS: 10000
        });
        log("DEBUG", "Successfully connected to database");

    }
    catch (error) {
        log("ERROR", error);
    }
    //Once connected
    var db = mongoose.connection;
    //Execute find query
    try {


        Statistic.find(filter, (err, result) => {
            if (err) {
                log("ERROR", "There has beeing an error trying to store new statistic on databaseThere has beeing an error trying to get statistics from database")
                log("ERROR", err);
                db.close();
                res.status(500).json({ msg: "There has beeing an error trying to get statistics from database" });
            }

            log("DEBUG", `Query successfully executed with ${result.length} results`);
            db.close();
            res.status(200).json(result)

        });
    } catch (error) {
        log("ERROR", "There has beeing an error trying to store new statistic on databaseThere has beeing an error trying to get statistics from database")

        log("ERROR", err);

    }










    //





}

