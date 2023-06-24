const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    nama: {
        type: String,
        required: true,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024,
    },
    kelas: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024,
    },
    kelasId: {
        type: String,
        required: true,
    },
    noAbsen: Number,
    foto: {
        type: String,
        minlength: 5,
        maxlength: 1024,
    },
    hadir: {
        type: String,
        default: "Tidak Hadir"
    },
    keterangan: {
        type: String,
        default: "-",
        maxlength: 1024,
    },
    role: String,
    isAdmin: Boolean,
});

userSchema.methods.generateAuthToken = function (res, ingat) {
    const token = jwt.sign(
        {
            _id: this._id,
            isAdmin: this.isAdmin,
            name: this.name,
            isVisitor: this.visitor
        },
        config.get("jwtPrivateKey")
    );
    if (ingat) {
        return res.cookie("token", token, {
            expires: new Date(253402300000000),
        });
    } else {
        return res.cookie("token", token);
    }
};

const User = mongoose.model("User", userSchema);

const validateData = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(5).required(),
        email: Joi.string().email().min(5).required(),
        password: Joi.string().min(5).required(),
    });
    return schema.validate(data);
};

exports.User = User;
exports.userSchema = userSchema;
exports.validate = validateData;
