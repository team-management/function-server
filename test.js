
module.exports.Value = {
    startDate: {
        type: Date,
        required: true,
        default: new Date()
    },
    endDate: {type: Date, default: null},
    author: "User"

}

const Simple_accumulated_schema = () =>{
    let schema = {};
    Object.keys(module.exports.Value).map(function (key) {
        schema[key] = module.exports.Value[key];
    });
    schema.value = {type: Number, required: true};
    console.log(schema)
    return schema
};

console.log(Simple_accumulated_schema())