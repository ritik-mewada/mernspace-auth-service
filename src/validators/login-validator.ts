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
    password: {
        trim: true,
        errorMessage: "Password is required!",
        notEmpty: true,
    },
});
// export default [body("email").notEmpty().withMessage("Email is required!")];
