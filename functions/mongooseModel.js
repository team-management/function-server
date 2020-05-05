const mongoose = require('mongoose');
    const log = require("online-log").log


    //TODO: Object validation 
    //Create squema
    const Schema = mongoose.Schema;



   




    ////------------ Main schemas -------------

   

    const Season = new Schema({
        startDate:{
            type: Date,
            required: true
        },
        endDate:{
            type: Date,
            required: true
        }
        
    })

    const Event = Schema({
        startDate:{
            type: Date,
            required: true
        },
        endDate:{
            type: Date,
            required: true
        },
        name:{
            type: String,
            required: true
        },
        type:{
            type: String,
            required: true
        },
        season:{
            type: Season,
            required: false,
            default: null
        }

    })

     //Statistics (stcs) object main schema
    //Properties:
    /**
     * name : name of the stcs object
     * author: object of the user that created the stcs
     * creationDate
     * description
     * season: season object to group all statistics
     * labels: list of strings ach label will be a string used to identify statistics of the same kind or subject, for grouping or filtering
     * type: type identifier of the stcs object. allowed types are: 
     * [simple_accumulated, comparision, temporal_accumulated, temporal_proportion, 
     * proportion, multiple_proportion, temporal_interval, multiple_temporal_interval]
     * value: lists of value objects. Each stcs type has its own value subschema
     */
    const Statistic = new Schema({
        
        name: {
            type: String,
            required: true
        }, // String is shorthand for {type: String}
        author: {
            type: Object,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        cretionDate: { type: Date, default: Date.now }, 
        description: {
            type: String,
            required: true
        },
        season:{
            type: Season
        },
        values: [{}],
        labels:[String], //each label will be a string used to identify statistics of the same kind or subject, for grouping or filtering
         event: Event   
        
    });


    //------------------ Subdocuments value schemas 

    //value main schema

    /**
     * Base value raw schema with common properties
     * @property endDate if null, value corresponds to a single moment
     * @property startDate required, if there is a start and a end date, the value corresponds to that time period
     */
    module.exports.Value = {
        startDate: {
            type: Date,
            required: true,
            default: new Date()
        },
        endDate: {type: Date, default: null},
        author: {type: Object, required: true},
        event: {
            type: Event,
            required: false,
            default: null
        }

    }

    /**
     * Function to generate a base object to construct the values Schemas
     */
    const value_schema = () => {
        let schema = {};
        Object.keys(module.exports.Value).map(function (key) {
            schema[key] = module.exports.Value[key];
        });
        return schema;
    }

    /**
     * type key: simple_accumulated 
     * base value object + value prop
     */
    
    const Simple_accumulated_schema = () =>{

        let schema = value_schema()

        schema.value = {type: Number, required: true};
        
        return schema
    };

    /** 
     * type key: comparision
     * This type contains two main series or elemnts and it value, to compare between them
     * 
     * base value object
     * element_a [String] name of the first element
     * element_b [String] name of the second element
     * value_a [Number] value of the second element
     * value_b [Number] value of the second element
     */
    
    const Comparison_schema = () =>{

        let schema = value_schema()

        schema.element_a = {type: String, required: true};
        schema.element_b = {type: String, required: true};
        schema.value_a = {type: Number, required: true};
        schema.value_b = {type: Number, required: true};
        
        return schema
    };

    /** 
     * type key: temporal_accumulated
     * This type that contains an amount of time in miliseconds
     * 
     * base value object
     * milliseconds [Number] time span in milliseconds
     */
    const Temporal_accumulated_schema = () =>{

        let schema = value_schema();
        schema.milliseconds = {type: Number, required: true};

        return schema;
    }

    /** 
     * type key: temporal_proportion
     * This type that contains une value with total amount of time and other value with an amount of time 
     * that is part of the total amount
     * 
     * base value object
     * milliseconds [Number] time span in milliseconds
     * total_milliseconds [Number] total time span
     */
    const Temporal_proportion_schema = () =>{

        let schema = value_schema();
        schema.milliseconds = {type: Number, required: true};
        schema.total_milliseconds = {type: Number, required: true};

        return schema;
    }

    /** 
     * type key: temporal_interval
     * This type that contains one value with total amount of time and other value with an amount of time 
     * that is part of the total amount
     * 
     * base value object
     * milliseconds [Number] time span in milliseconds
     * total_milliseconds [Number] total time span
     */
    const Temporal_interval_schema = () =>{

        let schema = value_schema();
        schema.start_milliseconds = {type: Number, required: true};
        schema.end_milliseconds = {type: Number, required: true};

        return schema;
    }

     /** 
     * type key: multiple_temporal_interval
     * This type that contains a series of temporal intervals for diferent labels
     * 
     * base value object
     * series [String] Series names
     * timeinterval_object [Object] total time span
     * 
     * Each series is correlated with its interval by is index
     */
    const Multiple_temporal_interval_schema = () =>{

        let schema = value_schema();
        schema.series = {type: Array, required: true};
        schema.intervals = {type: Array, required: true};
        /**
         * Each intervals object:
         * {
         *  start_miliseconds
         *  end_miliseconds
         * 
         * }
         */
        return schema;
    }


    /** 
     * type key: proportion
     * Contains a total value an a value that represents a portion of that total.
     * It can be then expresed by %, value/total, 0.X....
     * 
     * base value object
     * total [Number] Total amount
     * value [Number] Value 
     *
     */
    const Proportion_schema = () =>{

        let schema = value_schema();
        schema.value = {type: Number, required: true};
        schema.total = {type: Number, required: true};
        
        return schema;
    }
    /** 
     * type key: multiple_proportion
     * Contains an array of values and an array of series. Each value represents a portion of the total value
     * witch is the sum of the values .
     * It can be then expresed by %, value/total, 0.X....
     * 
     * base value object
     * series [String] Series
     * values [Number] Value 
     *
     */
    const Multiple_proportion_schema = () =>{

        let schema = value_schema();
        schema.series = {type: Array, required: true};
        schema.values = {type: Array, required: true};
        
        return schema;
    }

      /** 
     * type key: multiple_temporal_proportion
     * Contains an array of miliseconds and an array of series. Each value represents a portion of the total value
     * witch is the sum of the values .
     * It can be then expresed by %, value/total, 0.X....
     * 
     * base value object
     * series [String] Series
     * miliseconds [Number] Value 
     *
     */
    const Multiple_temporal_proportion_schema = () =>{

        let schema = value_schema();
        schema.series = {type: Array, required: true};
        schema.miliseconds = {type: Array, required: true};
        
        return schema;
    }


    const Simple_accumulated = new Schema(Simple_accumulated_schema())
    const Comparison = new Schema(Comparison_schema())
    const Temporal_accumulated = new Schema(Temporal_accumulated_schema())
    const Temporal_proportion = new Schema(Temporal_proportion_schema())
    const Temporal_interval = new Schema(Temporal_interval_schema())
    const Multiple_temporal_interval = new Schema(Multiple_temporal_interval_schema())
    const Proportion = new Schema(Proportion_schema())
    const Multiple_proportion = new Schema(Multiple_proportion_schema())
    const Multiple_temporal_proportion = new Schema(Multiple_temporal_proportion_schema())



    module.exports.Season = mongoose.model("Season", Season)
    module.exports.Event = mongoose.model("Event", Event)
    module.exports.Value_Simple_Accumulated = mongoose.model("Value_Simple_Accumulated", Simple_accumulated);
    module.exports.Value_Comparison = mongoose.model("Value_Comparison", Comparison);
    module.exports.Temporal_Accumulated = mongoose.model("Temporal_Accumulated", Temporal_accumulated);
    module.exports.Temporal_Proportion = mongoose.model("Temporal_Proportion", Temporal_proportion);
    module.exports.Temporal_Interval = mongoose.model("Temporal_Interval", Temporal_interval);
    module.exports.Multiple_Temporal_Interval = mongoose.model("Multiple_Temporal_Interval", Multiple_temporal_interval);
    module.exports.Proportion = mongoose.model("Proportion", Proportion);
    module.exports.Multiple_Proportion = mongoose.model("Multiple_Proportion", Multiple_proportion);
    module.exports.Multiple_Temporal_Proportion = mongoose.model("Multiple_Temporal_Proportion", Multiple_temporal_proportion);



    module.exports.Statistic = mongoose.model("Statistic", Statistic);

    
