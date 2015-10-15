/** schemas.js **/

schemas = {
    user: {
        username: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        resetPasswordToken: String,
        resetPasswordExpires: Date,
        fName: {
            type: String,
            required: true
        }
        lName: {
            type: String,
            required: true
        }
    }
}

module.exports = schemas;