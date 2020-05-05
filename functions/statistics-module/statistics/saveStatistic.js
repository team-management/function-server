
module.exports = getStatistics = async (clientId, statistic, res) => {
    //Require mongoose
    const mongoose = require('mongoose');
    const log = require("online-log").log
    const {Statistic} = require('../../mongooseModel')

    


    //Starting logic---------------
    log("DEBUG", `Request recieved for inserting new statistic :   ${clientId}, ${JSON.stringify(statistic)}`);
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
    
    let statistic_1;

    statistic_1 = new Statistic(statistic);
    const error = statistic_1.validateSync();
    if (error) {
        log("WARN", "Validation error on requerst body against Statistics schema")
        res.status(403).json({ msg: "Validation error on requerst body against Statistics schema" })
        return;
    }
    var db = mongoose.connection;
    statistic_1.save(function (err, statistic) {
        if (err) {
            log("ERROR", "There has beeing an error trying to store new statistic on database")
            log("ERROR", err);
            db.close();
            res.status(500).json({ msg: "There has beeing an error trying to store new statistic on database" });
        }
        log("DEBUG", "New statistics saved to statitcis collection.");
        db.close();

        res.status(200).json(statistic)
    });




    //





}

