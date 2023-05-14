import { db } from '../database/database.connection.js';

export async function getRentals(req, res) {
    try {
        const rentals = await db.query(`
        SELECT customers.name AS customer_name, games.name AS game_name, rentals.*, 
        TO_CHAR("rentDate", 'YYYY-MM-DD') as "rentDate" FROM rentals
        JOIN customers
            ON customers.id=rentals."customerId"
        JOIN games
            ON games.id=rentals."gameId";`);
  
        const obj = rentals.rows.map(
            ({ customer_name, game_name, ...rentals }) => ({
                ...rentals,
                customer: { id: rentals.customerId, name: customer_name },
                game: { id: rentals.gameId, name: game_name },
            })
        );
  
        res.send(obj);
    } catch (err) {
      res.status(500).send(err.message);
    }
}