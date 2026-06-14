const validator = require("validator");

const validateRegisterData = (name, username, email, password) => {

    name = name?.trim();
    username = username?.trim();
    email = email?.trim();

    if (!name || !username || !email || !password) {
        return { error: "All fields are required" };
    }

    if (name.length < 3) {
        return { error: "Name should have at least 3 characters" };
    }

    if (username.length < 3) {
        return { error: "Username should have at least 3 characters" };
    }

    if (!validator.isEmail(email)) {
        return { error: "Please enter a valid email" };
    }

    if (!validator.isStrongPassword(password)) {
        return {
            error:
                "Password must contain uppercase, lowercase, number and special character"
        };
    }

    return { error: null };
};

const validateLoginData = (email, password) => {

    email = email?.trim();

    if (!email || !password) {
        return { error: "Email and password are required" };
    }

    if (!validator.isEmail(email)) {
        return { error: "Please enter a valid email" };
    }

    return { error: null };
};

module.exports = {
    validateRegisterData,
    validateLoginData
};