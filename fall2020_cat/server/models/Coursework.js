

const mongoose = require('mongoose');




const CourseworkSchema = mongoose.Schema({

    module: {
        type: Number,
        required: true

    },
    moduleId: {
        type: Number,
        requred: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    author: {
        first: String,
        last: String
    },
    lessonIds: [Number],
    lessonOrder: [Number]
    

}, {
    timestamps: true
});


const Coursework = mongoose.model("Coursework", CourseworkSchema);


module.exports = Coursework;



