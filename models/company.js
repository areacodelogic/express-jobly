const db = require('../db');
const ExpressError = require("../expressError");
const sqlForPartialUpdate = require("../helpers/partialUpdate");

class Company {



    static async findAll(data) {
        let min_employees;
        let max_employees;
        let baseQuery = `SELECT name FROM companies`
        let queries = [];
        let values = [];

        if (data.min_employees && data.max_employees) {
            if (data.min_employees >= data.max_employees) {
                throw new ExpressError("Minimum employees can not be greater than maxinum employees", 400)
            }
        }

        if (Object.keys(data).length > 0) {
            let count = 0;

            if (data.min_employees) {
                min_employees = +data.min_employees;
                values.push(min_employees);
                let minQuery = `num_employees >= $`;
                queries.push(minQuery);
            }

            if (data.max_employees) {
                max_employees = +data.max_employees;
                values.push(max_employees);
                let maxQuery = `num_employees <= $`;
                queries.push(maxQuery);
            }

            if (data.search) {
                let search = data.search;
                values.push(search);
                let searchQuery = `name ILIKE $`;
                queries.push(searchQuery);
            }
            baseQuery = baseQuery + " " + "WHERE";
            for (let query of queries) {
                count += 1;
                baseQuery += (" " + query + `${count}` + " " + "AND");
            }
            baseQuery = baseQuery.slice(0, -4);
            let companies = await db.query(baseQuery, values);
            return companies.rows;
        } else {
            let companies = await db.query(baseQuery);
            return companies.rows;
        }
    }

    static async create(data) {
        const result = await db.query(`
        INSERT INTO companies (
            handle,
            name,
            num_employees,
            description,
            logo_url)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING
        handle,
        name,
        num_employees,
        description,
        logo_url
        `,
            [data.handle,
            data.name,
            data.num_employees,
            data.description,
            data.logo_url]
        );

        return result.rows[0];
    }

    static async findCompany(handle) {
        const result = await db.query(`
        SELECT handle, name, num_employees, description, logo_url
        FROM companies
        WHERE handle=$1`, [handle]
        );

         if (result.rows.length === 0) {
           throw {
             message: `There is no company with handle '${handle}`,
             status: 404
           };
         }

        return result.rows[0];
    }

    static async update(handle, data) {
        let company = sqlForPartialUpdate("companies", data, "handle", handle);
        console.log(company);
        const result = await db.query(company.query, company.values);
        console.log(result);
        
        if (result.rows.length === 0) {
            throw {
                message: `There is no company with handle '${handle}`,
                status: 404
            };
        }
        return result.rows[0];
    }

    static async delete(handle){

        const result = await db.query(`
            DELETE from companies
            WHERE handle = $1
            RETURNING handle`, [handle]);

         if (result.rows.length === 0) {
           throw {
             message: `There is no company with handle '${handle}`,
             status: 404
           };
         }
    }
}


module.exports = Company;