/**
 * Adds an array of value objects to an statistic object by selector
 * @param clientId client id of the  user executing teh operation
 * @param selector objects with the keys and values to select the statistc object to operate in
 * @param values array of objects of any value type
 */
module.exports = addValueStatistic = async (clientId, selector, values, res) => {
    //Require mongoose
    const mongoose = require('mongoose');
    const { Statistic, Value_Simple_Accumulated, Value_Comparison,
        Temporal_Accumulated, Temporal_Proportion,
        Temporal_Interval,
        Multiple_Temporal_Interval,
        Proportion,
        Multiple_Proportion,
        Multiple_Temporal_Proportion } = require('../../mongooseModel')


    //Starting logic---------------
    console.log("DEBUG", `Request recieved for adding values to statistic documents: ${clientId}, ${JSON.stringify(selector)}`);
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
        console.log("ERROR", error);
    }

    //Once connected
    var db = mongoose.connection;
    //Execute find query
    try {

        const statistic = await Statistic.findOne(selector);

        console.log('DEBUG', statistic);
        //Once got the statistic objects, check type property and compare its value subschema to the value sent

        let typed_values;

        typed_values = f_validateValuesAndGenerteList(values, statistic.type)


        f_addValuesAndSave(typed_values, statistic, db, res);




    } catch (error) {
        console.log("ERROR", "There has beeing an error trying to update statistics object's values")
        console.log("ERROR", error);
        res.status(500).json({ msg: "There has beeing an error trying to update statistics object's values" });

    }






    /**
     * Function to add a list of values to value porperty of statistic selected object
     * @param {Array} typed_values array of values to insert to statistic values property
     * @param {StatisticSchema} statistic objecto to add values to
     * @param {Object} db database moongoose instance
     * @param {Object} res function response object
     */
    function f_addValuesAndSave(typed_values, statistic, db, res) {
        for (let value in typed_values) {
            statistic.values.push(typed_values[value])
        }
        statistic.save(function (err, statistic) {
            if (err) {
                console.log("ERROR", "There has beeing an error trying to update statistics object's values")
                console.log("ERROR", err);
                db.close();
                res.status(500).json({ msg: "There has beeing an error trying to update statistics object's values" });
            }
            console.log("DEBUG", "Query successfully executed");
            db.close();

            res.status(200).json(statistic)
        });
    }

    /**
     * Processes values array and validate each value with the schema
     *  based on the statistic object type
     * @param {Array} values 
     * @param {String} type 
     * 
     * @returns {Array} Mongo Schemas Array depending on the type of the statistic object
     */
    function f_validateValuesAndGenerteList(values, type) {


        let typed_values = [];
        //for each value in values array, validate schema and update statistic object
        for (let value in values) {

            let typed_value;
            switch (type) {
                case "simple_accumulated":
                    typed_value = new Value_Simple_Accumulated(values[value]);

                    break;
                case "comparison":
                    typed_value = new Value_Comparison(values[value]);

                    break;
                case "temporal_accumulated":
                    typed_value = new Temporal_Accumulated(values[value]);

                    break;
                case "temporal_proportion":
                    typed_value = new Temporal_Proportion(values[value]);

                    break;
                case "temporal_interval":
                    typed_value = new Temporal_Interval(values[value]);

                    break;
                case "multiple_temporal_interval":
                    typed_value = new Multiple_Temporal_Interval(values[value]);

                    break;
                case "proportion":
                    typed_value = new Proportion(values[value]);

                    break;
                case "multiple_proportion":
                    typed_value = new Multiple_Proportion(values[value]);

                    break;
                case "multiple_temporal_proportion":
                    typed_value = new Multiple_Temporal_Proportion(values[value]);

                    break;
            }
            const error_value_object = typed_value.validateSync();
            if (error_value_object) {

                console.log("WARN", `Validation error on requerst body against ${type} schema`)
                console.log('ERROR', error_value_object);
                res.status(403).json({ msg: `Sent values object doesn't match statistic type value format` })
                return;
            }
            typed_values.push(typed_value)
        }
        return typed_values;
    }

}

    //







