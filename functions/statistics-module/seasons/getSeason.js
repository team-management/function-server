
module.exports = getSeaon = async (clientId, filter, res) => {
    //Require mongoose
    const mongoose = require('mongoose');
    const log = require("online-log").log
    //const { Statistic } = require('@rugdev/module-statistic-moongose_model')
    const { Season } = require('../../mongooseModel')


    //Starting logic---------------
    log("DEBUG", `Request recieved for searching for season documents:   ${clientId}, ${JSON.stringify(filter)}`);
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
    var db = mongoose.connection;
    //Execute find query
    try {


        Season.find(filter, (err, result) => {
            if (err) {
                log("ERROR", "There has beeing an error trying to get season from database")
                log("ERROR", err);
                db.close();
                res.status(500).json({ msg: "There has beeing an error trying to get season from database" });
            }

            log("DEBUG", `Query successfully executed with ${result.length} results`);
            db.close();
            res.status(200).json(result)

        });
    } catch (error) {
        log("ERROR", "There has beeing an error trying to get season from database")

        log("ERROR", err);

    }










    //





}

