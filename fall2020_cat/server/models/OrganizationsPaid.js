

const mongoose = require('mongoose');



/**This is the OrganizationPaidSchema definition and model creation file used to register paid organizations
 * into the mongo database. If the user paid by using the Stripe Credit card box then this model will be used.
 * This has the paid user name and the license id number used to register other users without payment.
 */
//schema model definition for mongo
const OrganizationsPaidSchema = mongoose.Schema({
     //the following are key/schema type definitions for documents to be added to the User collection

    customerStripeId: {
        type: String,
        required: true,
        unique: true
    },
    //name of organization or person who is purchasing
    organizationName: {
        type: String,
        required: [true, "please provide representative"]
    },
    //name of the person who paid for the course
    payer: {
        type: String,
        required: true
    },

    accountType: {
        //Only 2 types of entities. A single person license = 1 or organization = 2+ (school=2, business=3, gov=4, nonprofit=5)
        type: String,
        required: [true, "please provide an entity type"],
        //unique: true,

    },

    billingAmount: {
        type: Number,
        required: [true, "please enter bill total"],
        select: false   //false = don't return password when doing a mongodb query
    },

    //license information
    licenseIdNumber: {
        type: String,
        required: [true, 'license id required'],
        minLength: 5
    },

    licenseTotal: Number,
    licenseUsed: Number,

    orgAddress: String,
    orgCity: String,
    orgStates: String,
    orgZipcode: String,
    orgPhone: String
}, {

    //used to add timestamp when the user was added to the database
    timestamps: true,
});



//Create the model schema for export
const OrganizationPaid = mongoose.model("OrganizationPaid", OrganizationsPaidSchema);

module.exports = OrganizationPaid;
