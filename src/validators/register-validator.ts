import { checkSchema } from "express-validator";

export default checkSchema({
    email: {
        errorMessage: "Email is required!",
        notEmpty: true,
        trim: true,
        isEmail: {
            errorMessage: "Email field is requied!",
        },
    },
    firstName: {
        errorMessage: "FirstName is required!",
        notEmpty: true,
        trim: true,
    },
    lastName: {
        errorMessage: "LastName is required!",
        notEmpty: true,
        trim: true,
    },
    password: {
        trim: true,
        errorMessage: "Password is required!",
        notEmpty: true,
        isLength: {
            options: {
                min: 8,
            },
            errorMessage: "Password length should be atleast 8 characters!",
        },
    },
});
// export default [body("email").notEmpty().withMessage("Email is required!")];
