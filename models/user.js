const db = require("../db");
const ExpressError = require("../expressError");
const sqlForPartialUpdate = require("../helpers/partialUpdate");


class User {
  static async create(data) {
    const result = await db.query(
      ` INSERT INTO users (
          username,
          password,
          first_name,
          last_name,
          email,
          photo_url,
          is_admin)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING 
          username,
          password,
          first_name,
          last_name,
          email,
          photo_url,
          is_admin`,
      [data.username, 
       data.password, 
       data.first_name, 
       data.last_name, 
       data.email, 
       data.photo_url, 
       data.is_admin
      ]
    );

    return result.rows[0];
  }

  static async getUsers() {
    const result = await db.query(`
      SELECT username, password, first_name, last_name, email, photo_url, is_admin
      FROM users
      ORDER BY last_name
    `);

    return result.rows;
  }

  static async findUser(username) {
    const result = await db.query(
      ` SELECT username, password, first_name, last_name, email, photo_url, is_admin
        FROM users
        WHERE username=$1`,
      [username]
    );

    if (result.rows.length === 0) {
      throw new ExpressError(`There is no user with username ${username}`, 404);
    }

    return result.rows[0];
  }

  static async update(username, data) {
    const user = sqlForPartialUpdate("users", data, "username", username);
    const result = await db.query(user.query, user.values);

    if (result.rows.length === 0) {
      throw new ExpressError(`There is no user with username '${username}`, 404);
    }

    return result.rows[0];
  }

  static async delete(username) {
    const result = await db.query(
      ` DELETE from users
        WHERE username = $1
        RETURNING username`,
      [username]
    );

    if (result.rows.length === 0) {
      throw new ExpressError(`There is no user with username '${username}`, 404);
    }
  }
}

module.exports = User;