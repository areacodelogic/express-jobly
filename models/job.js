const db = require("../db");
const ExpressError = require("../expressError");
const sqlForPartialUpdate = require("../helpers/partialUpdate");

class Job {
  static async findAll(data) {
    let min_salary;
    let min_equity;

    let baseQuery = `SELECT title, salary, equity, company_handle, date_posted FROM jobs`;
    let queries = [];
    let values = [];
    let searchTerms = Object.keys(data).length > 0;

    if (searchTerms) {
      let count = 0;

      if (data.min_salary) {
        min_salary = +data.min_salary;
        values.push(min_salary);
        let minSalaryQuery = `salary >= $`;
        queries.push(minSalaryQuery);
      }

      if (data.min_equity) {
        min_equity = +data.min_equity;
        values.push(min_equity);
        let minEquityQuery = `equity >= $`;
        queries.push(minEquityQuery);
      }

      if (data.search) {
        let search = data.search;
        values.push(search);
        let searchQuery = `title ILIKE $`;
        queries.push(searchQuery);
      }

      baseQuery = baseQuery + " " + "WHERE";

      for (let query of queries) {
        count += 1;
        baseQuery += " " + query + `${count}` + " " + "AND";
      }

      baseQuery = baseQuery.slice(0, -4);

      let jobs = await db.query(baseQuery, values);
      return jobs.rows;
    } else {
      let jobs = await db.query(baseQuery);
      return jobs.rows;
    }
  }

  static async create(data) {
    const result = await db.query(
      ` INSERT INTO jobs (
            title,
            salary,
            equity,
            company_handle,
            date_posted)
        VALUES ($1, $2, $3, $4, current_timestamp)
        RETURNING 
        id, 
        title, 
        salary, 
        equity, 
        company_handle, 
        date_posted`,
      [data.title, data.salary, data.equity, data.company_handle]
    );

    return result.rows[0];
  }

  static async findJob(id) {
    const result = await db.query(
      ` SELECT id, title, salary, equity, company_handle, date_posted
        FROM jobs
        JOIN companies
        ON companies.handle = jobs.company_handle
        WHERE id=$1`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new ExpressError(`There is no job with id '${id}`, 404);
    }

    return result.rows[0];
  }

  static async update(id, data) {
    const job = sqlForPartialUpdate("jobs", data, "id", id);
    const result = await db.query(job.query, job.values);

    if (result.rows.length === 0) {
      throw new ExpressError(`There is no job with id '${id}`, 404);
    }

    return result.rows[0];
  }

  static async delete(id) {
    const result = await db.query(
      ` DELETE from jobs
        WHERE id = $1
        RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new ExpressError(`There is no job with id '${id}`, 404);
    }
  }
}

module.exports = Job;
