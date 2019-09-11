const db = require('../db');
const ExpressError = require("../expressError");

class Company {



  static async findAll(data){
    let min_employees;
    let max_employees;
    const baseQuery = `SELECT name FROM companies`
    const queries = [`WHERE name ILIKE $1`, `WHERE min_employees >= ${min_employees}`, `WHERE max_employees <= ${max_employees}`, ]
    const values = [];

    if(data.min_employees && data.max_employees){
        if(data.min_employees >= data.max_employees){
            throw new ExpressError("Minimum employees can not be greater than maxinum employees", 400)
        }

    }
    

    if (data.min_employees) {
        min_employees = +data.min_employees;
        const companies = await db.query(
            baseQuery + " " + `WHERE num_employees >= $1`,[min_employees]);

        return companies.rows;
    }

    if (data.max_employees) {
        max_employees = +data.max_employees;
        console.log(max_employees)
        const companies = await db.query(
            baseQuery + " " + `WHERE num_employees <= $1`,[max_employees]);

        return companies.rows;
    }

    if(data.search){
        values.push(data.search)

        const companies = await db.query(
        baseQuery + " " + queries[0], [`%${values[0]}%`])
        // const companies = await db.query(
        //     `SELECT * FROM companies`
        // )
        return companies.rows;

        
        

    }

    


  }
  












}

module.exports = Company;