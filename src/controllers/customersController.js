import { db } from '../database/database.connection.js';

export async function getCustomers(req, res) {
    try {
      const customers = await db.query("SELECT * FROM customers");
      res.send(customers.rows);
    } catch (err) {
      res.status(500).send(err.message);
    }
}

export async function getCustomerById(req, res){
    const { id } = req.params;

    try {
        const customer = await db.query(`SELECT * FROM customers WHERE id = $1;`, [id]);
        if(!customer.rowCount) return res.sendStatus(404);

        res.send(customer.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
}