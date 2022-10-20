import { Request, Response, NextFunction } from "express";
import { ReplyInstance } from '../models/reply';
import { UserInstance } from "../models/user";
import { v4 as uuidv4 } from "uuid";
import { replySchema, options } from "../utility/utils"
import { PostInstance } from "../models/post";

//Create a reply 
export async function reply(req: Request | any, res: Response, next: NextFunction) {
    const id = uuidv4()
    try {
        const username = req.user.username; 
        const postId = req.post.id;
        const validateResult = replySchema.validate(req.body, options)
        if (validateResult.error) {
            return res.status(400).json({ Error: validateResult.error.details[0].message })
        };
        
        if (req.user.verified === true){
            const record = await ReplyInstance.create({ id, ...req.body, postId, username })
            res.status(201).json({
                message: "Reply sent",
                record
            })
        } else {
            return res.status(401).json({
                msg: "user not verified"
            })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'failed to reply',
            route: '/reply'

        })
    }
};

export async function getReplies(req: Request, res: Response, next: NextFunction) {
    try {
        const limit = req.query?.limit as number | undefined
        const offset = req.query.offset as number | undefined

        const replies = await ReplyInstance.findAndCountAll({
            limit, offset, include:
                [{
                    model: PostInstance,
                    as: 'POSTS'
                }]
        });

        res.status(200).json({
            msg: 'All replies fetched successfully',
            count: replies.count,
            reply: replies.rows
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'failed to fetch replies',
            route: '/replies'
        })
    }
};

//Delete a reply
export async function delReply(req: Request | any, res: Response, next: NextFunction) {
    try {
        const { id } = req.params
        const record = await ReplyInstance.findOne({ where: { id } });
        if (!record) {
            res.status(404).json({
                message: "Reply does not exist"
            })
        }
        if (req.user.verified === true){
            const deletedReply = await record?.destroy();
            res.status(200).json({
                msg: 'Your reply has been deleted successfully',
                deletedReply
            })
        } else {
            return res.status(401).json({
                msg:"user not verified"
            })
        }
    } catch (err) {
        res.status(500).json({
            msg: 'failed to delete',
            route: '/del-reply/:id'
        })
    }
};