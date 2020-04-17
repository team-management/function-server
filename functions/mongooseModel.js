const mongoose = require('mongoose');
    const log = require("online-log").log

    //TODO: Object validation 
    //Create squema
    const Schema = mongoose.Schema;

    const statisticSchema = new Schema({
        name: {
            type: String,
            required: true
        }, // String is shorthand for {type: String}
        author: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        cretionDate: { type: Date, default: Date.now }, //TODO: Change to Date tipe once test are finished
        description: {
            type: String,
            required: true
        },
        values: []
    });

    module.exports.Statistic = mongoose.model("Statistic", statisticSchema);

    
