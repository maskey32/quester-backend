import { DataTypes, Model } from "sequelize";
import DB from "../db/database.config";
interface ReplyAttributes {
    id: string;
    content: string;
    postId: string;
    createdAt: Date;
    updatedAt: Date;
}

export class ReplyInstance extends Model<ReplyAttributes> { };

ReplyInstance.init({
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
                msg: "Please provide content"
            }
        }
    },
    postId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt:{
        type: DataTypes.DATE,
        allowNull: false
    },
    updatedAt:{
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize: DB,
    tableName: "REPLY"
}
);
