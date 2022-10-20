import Joi from 'joi';
import jwt from 'jsonwebtoken';

/* User Schemas */
export const registerUserSchema = Joi.object().keys({
    firstname: Joi.string().lowercase().required(),
    lastname: Joi.string().required(),
    email: Joi.string().trim().lowercase().required(),
    username: Joi.string().required(),
    phonenumber: Joi.string().required().length(11).pattern(/^[0-9]+$/),
    password: Joi.string().regex(/^[a-zA-Z0-9]{5,15}$/).required(),
    confirm_password: Joi.ref('password')
}).with('password', 'confirm_password');


export const updateUserSchema = Joi.object().keys({
    occupation: Joi.string(),
    firstname: Joi.string().lowercase(),
    lastname: Joi.string(),
    email: Joi.string(),
    username: Joi.string(),
    phonenumber: Joi.string().length(11).pattern(/^[0-9]+$/),
    licenseNo: Joi.string(),
    verified: Joi.boolean()
});


export const loginUserSchema = Joi.object().keys({
    email: Joi.string().trim().lowercase().required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{5,15}$/).required()
});

/* Post Schema */
export const postSchema = Joi.object().keys({
    content: Joi.string().required()
});

/* Reply Schema */
export const replySchema = Joi.object().keys({
    content: Joi.string().required()
});

/* Journal Schema */
export const journalSchema = Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required()
});


/* Helper Functions */
export const generateToken = (user: { [key: string]: unknown }): unknown => {
    const pass = process.env.JWT_SECRET as string;
    return jwt.sign(user, pass, { expiresIn: '7d' });
};


export const options = {
    abortEarly: false,
    errors: {
        wrap: {
            label: ''
        }
    }
};