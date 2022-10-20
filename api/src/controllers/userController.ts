import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { UserInstance } from '../models/user';
import bcrypt from 'bcryptjs';
import { registerUserSchema, loginUserSchema, updateUserSchema, generateToken, options } from '../utility/utils';
import { PostInstance } from '../models/post';


// Register User Controller
export async function signupUser(req: Request, res: Response, next: NextFunction) {
    const id = uuidv4();
    try {
        const validation = registerUserSchema.validate(req.body, options);
        if (validation.error) {
            return res.status(400).json({ Error: validation.error.details[0].message });
        }

        const usedUsername = await UserInstance.findOne({ where: { username: req.body.username } });
        if (usedUsername) {
            return res.status(409).json({ msg: "Username taken" });
        }

        const usedEmail = await UserInstance.findOne({ where: { email: req.body.email } });
        if (usedEmail) {
            return res.status(409).json({ msg: "Email has been used" });
        }

        const usedPhoneNo = await UserInstance.findOne({ where: { phonenumber: req.body.phonenumber } });
        if (usedPhoneNo) {
            return res.status(409).json({ msg: "Phonenumber has been used" });
        }

        const hashPassword = await bcrypt.hash(req.body.password, 8);
        const entry = await UserInstance.create({
            id: id,
            occupation: req.body.occupation,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            username: req.body.username,
            phonenumber: req.body.phonenumber,
            licenseNo: req.body.licenseNo,
            password: hashPassword,
            verified: false
        })

        return res.status(201).json({
            msg: `User created successfully. Welcome ${req.body.username}`,
            entry
        })
    } catch (err) {
        console.log(err) 
        res.status(500).json({ msg: "Couldn't Sign Up User ", route: '/register' }) 
    };
};


// Login User Controller
export async function loginUser(req: Request, res: Response, next: NextFunction) {
    try {
        const validation = loginUserSchema.validate(req.body, options);
        if (validation.error) {
            return res.status(400).json({ Error: validation.error.details[0].message });
        }
        
        const user = await UserInstance.findOne({ where: { email: req.body.email }/*, include: [{ model: JournalInstance, as: 'JOURNAL' }, { model: PostInstance, as: 'POSTS' }]*/ }) as unknown as { [key: string]: string };
        const { id } = user;
        const token = generateToken({ id });
        const validPass = await bcrypt.compare(req.body.password, user.password);

        if (!validPass) {
            res.status(401).json({ msg: "Invalid email or password" });
        } else {
            // res.cookie("auth", token, {
            //     httpOnly: true,
            //     secure: true,
            // });
            // res.cookie("id", id, {
            //     httpOnly: true,
            //     secure: true,
            // });
            console.log('wegj')
            return res.status(200).json({
                msg: "Login Successful",
                token,
                user
            });
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "Failed to Login", route: '/login' })
    };
}


//Edit User Controller
export async function editUser(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const { firstname, lastname, email, username, phonenumber } = req.body;
        const validation = updateUserSchema.validate(req.body, options);

        if (validation.error) {
            return res.status(400).json({ Error: validation.error.details[0].message });
        }

        const entry = await UserInstance.findOne({ where: { id } });
        if (!entry) {
            return res.status(404).json({ Error: "Can't find existing user" });
        }

        const updatedEntry = await entry.update({
            firstname: firstname,
            lastname: lastname,
            email: email,
            username: username,
            phonenumber: phonenumber
        })

        res.status(200).json({
            msg: "User data has been updated",
            updatedEntry
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "Failed to Update", route: '/edit/:id' })
    };
}


//Dashboard Controller
export async function dash(req: Request | any, res: Response, next: NextFunction) {
    try {
        const user = await UserInstance.findOne({ where: { id: req.user.id }/*, include: [{ model: JournalInstance, as: 'JOURNAL' }, { model: PostInstance, as: 'POSTS' }]*/ }) as unknown as { [key: string]: string };

        if (!user) { res.status(404).json({ msg: "Failed to Login, user not found", route: '/dashboard' }) };
        res.status(200).json({
            msg: "Login Successful",
            user
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "Failed to Login", route: '/dashboard' });
    };
}


//Logout Controller
export async function logout(req: Request, res: Response, next: NextFunction) {
    try {
        res.clearCookie("id")
        res.clearCookie("auth")
        res.status(200).json({ msg: "Logout Successful" });
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "Failed to Logout", route: '/logout' })
    };
}


//Request Verification Controller
let requests: object[] = [];

export interface Ver {
    'userId': string;
    'occupation': string;
    'licenseNo': string;
    'license': string;
}

export async function reqVerification(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.cookies.id
        const occupation = req.body.occupation;
        const licenseNo = req.body.licenseNo;
        const license = req.body.license;

        const verRequest: Ver = {
            'userId': userId,
            'occupation': occupation,
            'licenseNo': licenseNo,
            'license': license
        }

        if (!requests.includes(verRequest)) {
            requests.push(verRequest);
        } else {
            res.status(200).json({ msg: "Your request is pending verification please wait" });
        }

        res.status(200).json({ msg: "Your request is being processed" });

    } catch (err) { res.status(500).json({ msg: "Verification route unavailable", route: '/verify' }) }
}

export { requests };