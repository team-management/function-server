
module.exports = deleteStatistic = async (clientId, selector, res) => {
    //Require mongoose
    const mongoose = require('mongoose');
    const log = require("online-log").log
    const { Statistic } = require('../../mongooseModel')


    //Starting logic---------------
    log("DEBUG", `Request recieved for deleting statistic:   ${clientId}, ${JSON.stringify(selector)}`);
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
    Statistic.deleteOne(selector, (err, result) => {
        if (err) {
            log("ERROR", "There has beeing an error trying to delete selected statistics")
            log("ERROR", err);
            db.close();
            res.status(500).json({ msg: "There has beeing an error trying to  delete selected statistic on database" });
        }
        if (result.ok !== 1) {
            log("ERROR", "There has beeing an error trying to delete selected statistics")
            log("ERROR", err);
            db.close();
            res.status(500).json({ msg: "There has beeing an error trying to  delete selected statistic on database" });
        }
        else if (result.ok === 1){
            log("DEBUG", `Deletion successfully executed with ${result.n} results`);
            db.close();
            res.status(200).json(result)
            
        }
        else{
            db.close();
        res.status(500).json({ msg: "There has beeing an error trying to  delete selected statistic on database" });
 
        }
       


    });










    //





}

