import db from "../config/db.js";

class AdminModels {

  // Category Functions 
  static async createCategory(name) {
    let connection;
    try {
      connection = await db.getConnection();
      const [result] = await connection.execute(
        'INSERT INTO categories (name) VALUES (?)',
        [name]
      );
      return result.insertId;
    } catch (error) {
      console.error("Error creating category.", error);
      throw new Error("Failed to create category.");
    } finally {
      if (connection) connection.release();
    }
  }

  static async getCategoryById(id) {
    let connection;
    try {
      connection = await db.getConnection();
      const [rows] = await connection.execute(
        'SELECT * FROM categories WHERE id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      console.error("Error fetching category.", error);
      throw new Error("Failed to fetch category.");
    } finally {
      if (connection) connection.release();
    }
  }

  static async updateCategory(id, name) {
    let connection;
    try {
      connection = await db.getConnection();
      const [result] = await connection.execute(
        'UPDATE categories SET name = ? WHERE id = ?',
        [name, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error updating category.", error);
      throw new Error("Failed to update category.");
    } finally {
      if (connection) connection.release();
    }
  }

  static async getAllCategories() {
    let connection;
    try {
      connection = await db.getConnection();
      const [rows] = await connection.execute(
        'SELECT * FROM categories ORDER BY name'
      );
      return rows;
    } catch (error) {
      console.error("Error fetching categories.", error);
      throw new Error("Failed to fetch categories.");
    } finally {
      if (connection) connection.release();
    }
  }

  // Item Functions 
  static async createItem({ name, description, price, category_id }) {
    let connection;
    try {
      connection = await db.getConnection();
      const [result] = await connection.execute(
        `INSERT INTO items (name, description, price, category_id)
         VALUES (?, ?, ?, ?)`,
        [name, description, parseFloat(price), parseInt(category_id)]
      );
      return result.insertId;
    } catch (error) {
      console.error("Error creating item.", error);
      throw new Error("Failed to create item.");
    } finally {
      if (connection) connection.release();
    }
  }

  static async getItemById(id) {
    let connection;
    try {
      connection = await db.getConnection();
      const [rows] = await connection.execute(
        'SELECT * FROM items WHERE id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      console.error("Error fetching item.", error);
      throw new Error("Failed to fetch item.");
    } finally {
      if (connection) connection.release();
    }
  }

  static async updateItem(id, { name, description, price, category_id }) {
    let connection;
    try {
      connection = await db.getConnection();
      const [result] = await connection.execute(
        `UPDATE items SET name = ?, description = ?, price = ?, category_id = ?
         WHERE id = ?`,
        [name, description, parseFloat(price), parseInt(category_id), id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error updating item.", error);
      throw new Error("Failed to update item.");
    } finally {
      if (connection) connection.release();
    }
  }
}

export default AdminModels;