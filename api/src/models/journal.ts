import { DataTypes, Model } from "sequelize";
import DB from '../db/database.config';

interface Journal {
    id: string;
    title: string;
    description: string;
    name: string;
    userId: string;
}

export class JournalInstance extends Model<Journal> { };

JournalInstance.init({
    id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "Title Required" },
            notEmpty: { msg: "Enter a Title" }
        }
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "Description Required" },
            notEmpty: { msg: "Enter a Description" }
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: DB,
    tableName: 'JOURNALS'
})