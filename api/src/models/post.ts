import { DataTypes, Model } from "sequelize";
import DB from "../db/database.config";
import { ReplyInstance } from './reply';


interface PostAttributes {
    id: string;
    content: string;
    userId: string;
    // createdAt: Date;
    // updatedAt: Date;
}

export class PostInstance extends Model<PostAttributes> { };

PostInstance.init({
    id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Content is required"
            },
            notEmpty: {
                msg: "Please provide a content"
            }
        }
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false
    }
    // createdAt:{
    //     type: DataTypes.DATE,
    //     allowNull: false
    // },
    // updatedAt:{
    //     type: DataTypes.DATE,
    //     allowNull: false
    // }
}, {
    sequelize: DB,
    tableName: "POSTS"
}
);

PostInstance.hasMany(ReplyInstance, { foreignKey: 'postId', as: 'REPLY' });

ReplyInstance.belongsTo(PostInstance, { foreignKey: 'postId', as: 'POSTS' });
