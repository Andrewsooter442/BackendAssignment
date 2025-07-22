import db from "../config/db.js";
class kitchenModels {
  // For Cheff
  static async getItems() {
    let connection;
    try {
      connection = await db.getConnection();
      const [items] = await connection.execute(`
                SELECT * from items; 
            `);
      return items;
    } catch (error) {
      console.error(`Error getting items${error}`);
    } finally {
      if (connection) connection.release();
    }
  }
  static async getItemOrdersNotCompleted() {
    let connection;
    try {
      connection = await db.getConnection();
      const [orders] = await connection.execute(`
                SELECT * from order_items WHERE complete=false;
            `);
      return orders;
    } catch (error) {
      console.error(`Error getting orders ${error}`);
    } finally {
      if (connection) connection.release();
    }
  }
  static async makePayment(userObject){
          let connection;
          try{
              connection = await db.getConnection();
              const query = `
                  INSERT INTO payment (order_id, user_id, total, tip, paid,method)
                  VALUES (?, ?, ?, ?, ?, ?)
              `
              const values = [userObject.orderId, userObject.userid, userObject.totalBill, 0, true, userObject.method];
              
              const [result] = await connection.execute(query,values);
              return result;
          }

          catch(error){
              console.error(`Error completing payment${error}`);
              throw new Error(`Failed to complete payment.`);
          }
          finally{
              if (connection){
                  connection.release();
              }
          }
  }
  static async getAllOrders() {
    let connection;
    try {
      connection = await db.getConnection();
      const [orders] = await connection.execute(`
                SELECT * from orders; 
            `);
      return orders;
    } catch (error) {
      console.error(`Error getting orders ${error}`);
    } finally {
      if (connection) connection.release();
    }
  }

  static async markComplete(order_id, item_id) {
    let connection;
    try {
      connection = await db.getConnection();

      await connection.beginTransaction();

      const [result] = await connection.execute(
        `UPDATE order_items SET complete = true WHERE order_id=? AND item_id=?`,
        [order_id, item_id]
      );

      const [remaining] = await connection.execute(
        `SELECT COUNT(*) AS incomplete FROM order_items WHERE order_id = ? AND complete = FALSE`,
        [order_id]
      );

      const incompleteCount = remaining[0].incomplete;

      if (incompleteCount === 0) {
        const [orderUpdateResult] = await connection.execute(
          `UPDATE orders SET complete = TRUE WHERE id = ?`,
          [order_id]
        );
      }
      await connection.commit();
      return result;
    } catch (error) {
      console.error(`Error getting orders ${error}`);
    } finally {
      if (connection) connection.release();
    }
  }

  // For Menu
  static async getCategoriesAndItems() {
    let connection;
    try {
      connection = await db.getConnection();

      const [categories] = await connection.execute(`
            SELECT
               categories.id AS category_id,
               categories.name AS category_name
            FROM categories
            ORDER BY id;
            `);

      const [items] = await connection.execute(`
            SELECT
                categories.id AS category_id,
                categories.name AS category_name,
                items.id AS item_id,
                items.name AS item_name,
                items.price,
                items.description
            FROM categories
            LEFT JOIN items ON categories.id = items.category_id
            ORDER BY categories.id, items.id;
        `);

      const menu = { categories, items };
      return menu;
    } catch (error) {
      console.error(`Error getting the menu: ${error}`);
      throw new Error("Failed to retrieve categories and items.");
    } finally {
      if (connection) connection.release();
    }
  }

  // For menu edit.
  static async getItemById(item_id) {
    let connection;
    try {
      connection = await db.getConnection();
      const [result] = await connection.execute(
        `
                SELECT * FROM items WHERE id=?
            `,
        [item_id]
      );
      return result;
    } catch (error) {
      console.error(`Error getting item: ${error}`);
      throw new Error("Failed to get the item.");
    } finally {
      if (connection) connection.release();
    }
  }
  static async getOrderAndItemById(order_id) {
    let connection;
    try {
      connection = await db.getConnection();
      const [result] = await connection.execute(
        `
        SELECT
          orders.*,
          order_items.quantity,
          order_items.instruction,
          order_items.complete AS item_complete,
          items.name AS item_name,
          items.price,
          items.description
        FROM
          orders
        JOIN
          order_items ON orders.id = order_items.order_id
        JOIN
          items ON order_items.item_id = items.id
        WHERE
          orders.id = ? AND orders.complete = FALSE;

        `,
        [order_id]
      );
      return result;
    } catch (error) {
      console.error(`Error getting item: ${error}`);
      throw new Error("Failed to get the item.");
    } finally {
      if (connection) connection.release();
    }
  }

  static async editItemById(item) {
    let connection;
    try {
      connection = await db.getConnection();
      const query = `UPDATE items SET name = ?, description = ?, price = ? WHERE id = ?`;
      const value = [item.name, item.description, item.price, item.item_id];
      const [result] = await connection.execute(query, value);
      return result;
    } catch (error) {
      console.error(`Error editing item: ${error}`);
      throw new Error("Failed to edit the item.");
    } finally {
      if (connection) connection.release();
    }
  }

  // For users.
  static async placeOrder(order, clientObj) {
    let connection;
    try {
      connection = await db.getConnection();
      await connection.beginTransaction();

      const query = `
                INSERT INTO orders (user_id,table_no)
                VALUES (?,?)
                `;
      const values = [clientObj.Id, clientObj.table_no];
      const [result] = await connection.execute(query, values);
      const order_id = result.insertId;

      const query2 = `
                INSERT INTO order_items (order_id, item_id, quantity, instruction)
                VALUES (?,?,?,?)
                `;
      for (const element of order.items) {
        const values2 = [
          order_id,
          element.id,
          element.quantity,
          element.instructions,
        ];
        await connection.execute(query2, values2);
      }
      await connection.commit();
      return order_id;
    } catch (error) {
      console.error(`Error placeing order: ${error}`);
      throw new Error("Failed to place the order.");
    } finally {
      if (connection) connection.release();
    }
  }
}

export default kitchenModels;
