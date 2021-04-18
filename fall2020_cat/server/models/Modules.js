
const mongoose = require("mongoose");

var Schema = mongoose.Schema;



/**This module is used to get course work modules with lessons for presenting to the registered users to
 * take the course
 */
const ModuleSchema = mongoose.Schema({

    module: Number,
    moduleType: String,
    description: String,
    lessonId: Number,
    author: String,
    stepPosition: Number,
    lessontitle: String,
    lessonSubtitle: String,
    names: String,
    lessonText: String,
    subtext1: String,
    subtext2: String,
    subtext3: String,
    subtext4: String,
    backgroundImage: String,
    images: [Schema.Types.Mixed],
    audios: [Schema.Types.Mixed],
    videos: [Schema.Types.Mixed],
    slides: [Schema.Types.Mixed],
    quizs: [Schema.Types.Mixed],
    notes: String


},{
    timestamps: true
});





const Module = mongoose.model("Module", ModuleSchema);

module.exports = Module;
