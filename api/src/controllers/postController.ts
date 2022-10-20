import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { PostInstance } from '../models/post';
import { options, postSchema } from '../utility/utils';
import { UserInstance } from '../models/user';
import { ReplyInstance } from '../models/reply';

//Create a post
export async function createPosts(req: Request |any , res: Response, next: NextFunction) {
    const id = uuidv4();
    try {
        const userId = req.user.id;
        const validatePost = postSchema.validate(req.body, options)
        if (validatePost.error) {
            return res.status(400).json({ Error: validatePost.error.details[0].message })
        };
    
        const posts = await PostInstance.create({ id, ...req.body, userId})
        res.status(201).json({
            msg: 'You have sucessfully created a post',
            posts
        })
    } catch (err) {
        res.status(500).json({
            msg: 'failed to create',
            route: '/create'
        })
    }
};


//View All posts
export async function getPosts(req: Request, res: Response, next: NextFunction) {
    try {
        const limit = req.query?.limit as number | undefined
        const offset = req.query.offset as number | undefined

        const posts = await PostInstance.findAndCountAll({
            limit, offset, include:
                [{
                    model: UserInstance,
                    as: 'USERS'
                },
                {
                    model: ReplyInstance,
                    as: 'REPLY'
                }]
        });

        res.status(200).json({
            msg: 'All posts fetched successfully',
            count: posts.count,
            posts: posts.rows
        })
    } catch (error) {
        res.status(500).json({
            msg: 'failed to fetch posts',
            route: '/posts'
        })
    }
};


//View just a post
export async function getPost(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params

        const post = await PostInstance.findOne({
            where: { id }, include: [{
                model: ReplyInstance,
                as: 'REPLY'
            },
            {
                model: UserInstance,
                as: 'USERS'
            }]
        });
        return res.status(200).json({
            msg: "Successfully fetched single post",
            post
        })
    } catch (error) {
        res.status(500).json({
            msg: 'failed to fetch single post',
            route: '/post/:id'
        })

    }
}


//Deletes a post
export async function delPosts(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params
        const post = await PostInstance.findOne({
            where: { id }, include: [{
                model: ReplyInstance,
                as: 'REPLY'
            },
            {
                model: UserInstance,
                as: 'USERS'
            }]
        })
        if (!post) {
            return res.status(400).json({
                msg: 'post does not exist'
            })
        }
        const deletedPost = await post.destroy();
        return res.status(200).json({
            msg: 'post deleted successfully',
            deletedPost
        })
    } catch (error) {
        res.status(500).json({
            msg: 'failed to delete post',
            route: '/del-post/:id'
        })
    }
};