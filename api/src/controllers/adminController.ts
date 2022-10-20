import { Request, Response, NextFunction } from 'express';
import { UserInstance } from '../models/user';
import { PostInstance } from '../models/post';
import { requests, Ver } from './userController';

// View all Users in the database
export async function viewUsers(req: Request, res: Response, next: NextFunction) {
    try {
        const limit = req.query?.limit as number | undefined;
        const offset = req.query?.offset as number | undefined;

        const response = await UserInstance.findAndCountAll({
            limit, offset, include: [
                { model: PostInstance, as: 'POSTS' }]
        });
        res.status(200).json({
            msg: "View Users",
            count: response.count,
            response: response.rows
        })
    } catch (err) { res.status(500).json({ msg: "Unable to show Users", route: '/users' }) };
};


// View a particular User
export async function getUser(req: Request | any, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const entry: any = await UserInstance.findOne({ where: { id }, include: [{ model: PostInstance, as: 'POSTS' }] });

        return res.status(200).json({
            msg: `User ${id}`,
            entry
        })
    } catch (err) { res.status(500).json({ msg: "User doesn't exist", route: "/user/:id" }) };
};


// Delete a User
export async function delUser(req: Request, res: Response, net: NextFunction) {
    try {
        const { id } = req.params;
        const user = await UserInstance.findOne({ where: { id }, include: [{ model: PostInstance, as: 'POSTS' }] });
        if (!user) {
            return res.status(404).json({ msg: "Can't find existing user" });
        }

        const delEntry = await user.destroy();

        res.status(200).json({
            msg: "User deleted successfully",
            delEntry
        });
    } catch (err) { res.status(500).json({ msg: "Failed to delete user", route: '/delete/:id' }) };
};


//Verify a User
export async function verify(req: Request, res: Response, next: NextFunction) {
    try {
        let verifiedUser: unknown | UserInstance;

        async function setVer(requester: Ver | any) {
            const user = await UserInstance.findOne({ where: { id: requester.userId } });
            if (!user) { return res.status(404).json({ msg: "Can't find existing user" }) };
            verifiedUser = await user.update({
                occupation: requester.occupation,
                licenseNo: requester.licenseNo,
                verified: true
            })
            requests.shift();
        };

        requests.forEach(setVer);

        res.status(200).json({
            msg: "User has been verified",
            verifiedUser
        });
    } catch (err) { res.status(500).json({ msg: "Unable to verify at the moment", route: '/verify' }) }
}


//Login the admin
export async function adLogin(req: Request, res: Response, next: NextFunction) {
    try {
        const admin = req.body.admin;
        const password = req.body.password;

        if (admin === "QUESTER" && password === "quester8") {
            res.status(200).json({
                msg: "Login Successful"
            })
        } else {
            res.status(409).json({ msg: "Not an admin go back", route: "/admin/login" });
        }
    } catch (err) { res.status(500).json({ msg: "Failed to Login", route: '/login' }) };
}