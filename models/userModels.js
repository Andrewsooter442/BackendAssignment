import db from "../config/db.js"
import bcrypt from "bcryptjs";

class UserModels{
    static async getItems(category){
            let connection;
            try{
                connection = await db.getConnection();
                const [items]  = await connection.execute(
                    'SELECT * FROM items WHERE category_id=?;', [category]
                );
                return items;
            }
            catch(error){
                console.log(`Error getting the items from category: ${category}, ${error.message}`);
                throw new Error('Failed to retrive items');
            }
            finally{
                if (connection) connection.release();
            }
        }

    static async createNewUser(userObject){
        let connection;
        try{
            connection = await db.getConnection();
            const query = `
                INSERT INTO users (name, mail, phone, score, isAdmin, isCheff, password_hash)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `
            const values = [userObject.name, userObject.mail, userObject.phone, 0, false, false, userObject.hashedPassword];
            
            const [result] = await connection.execute(query,values);
            return result;
        }

        catch(error){
            console.error(`Error creating new user ${error}`);
            throw new Error(`Failed to create user`);
        }
        finally{
            if (connection){
                connection.release();
            }
        }
    }

    static async checkUserExists(username) {
        let connection;
        try{
            connection = await db.getConnection();
            const [verdict] = await connection.execute(
                `SELECT EXISTS (
                SELECT 1 from users WHERE name=?
                ) AS userExists`, [username]
            );
            return (verdict[0].userExists === 1);
        }
        catch(error){
            console.error(`Error checkUserExists ${error.message}`);
            throw new Error("Failed to check if user exists");
        }
        finally{
            if (connection) connection.release();
        }
    }

    static async checkUserPasswd(username, password) {
        let connection;
        try{
            connection = await db.getConnection();
            const [result] = await connection.execute(
                `SELECT * FROM users WHERE name=?`, [username]
            );
            if (result.length === 0){
                throw new Error("User not found");
            }
            const user = result[0];
            const hashedPassword = user.password_hash;
            //console.log(hashedPassword, password); 
            //console.log(bcrypt.compareSync(password, hashedPassword)); 
            return bcrypt.compareSync(password, hashedPassword);
        }
        catch(error){
            console.error(`Error checkUserPasswd ${error.message}`);
            throw new Error("Failed to check if user exists");
        }
        finally{
            if (connection) connection.release();
        }  
    }
    static async getUserId(username) {
        let connection;
        try{
            connection = await db.getConnection();
            const [result] = await connection.execute(
                `SELECT id FROM users WHERE name=?`, [username]
            );
            if (result.length === 0){
                throw new Error("User not found");
            }
            return result[0].id;
        }
        finally{
            if (connection) connection.release();
        }  
    }

    static async isUserAdmin(id){
        let connection;
        try{
            connection = await db.getConnection();
            const [result] = await connection.execute(
                `SELECT isAdmin FROM users WHERE id=?`, [id]
            );
            if (result.length === 0){
                throw new Error("User not found");
            }
            return result[0].isAdmin;
        }
        finally{
            if (connection) connection.release();
        }  
    }
    static async isUserCheff(id){
        let connection;
        try{
            connection = await db.getConnection();
            const [result] = await connection.execute(
                `SELECT isCheff FROM users WHERE id=?`, [id]
            );
            if (result.length === 0){
                throw new Error("User not found");
            }
            return result[0].isCheff;
        }
        finally{
            if (connection) connection.release();
        }  
    }
}

export default  UserModels;