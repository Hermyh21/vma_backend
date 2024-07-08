const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  fname: {
    required: true,
    type: String,
    trim: true,
  },
  lname: {
    required: true,
    type: String,
    trim: true,
  },
  phonenumber: {
    required: true,
    type: String,
    trim: true,
    unique: true,
  },
  department: {
    required: true,
    type: String,
    trim: true,
  },
  role: {
    required: true,
    type: String,
    trim: true,
  },
  email: {
    required: true,
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
    validate: {
      validator(value) {
        const re =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(value).toLowerCase());
      },
      message: (props) => `${props.value} is not a valid email address`,
    },
  },
  password: {
    required: true,
    type: String,
    trim: true,
    // validate: {
    //   validator(value) {
    //     // Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character
    //     const re =
    //       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    //     return re.test(String(value));
    //   },
    //   message: (props) => `${props.value} is not a valid password`,
    // },
  },
});
const User = mongoose.model("User", userSchema);
module.exports = User;
