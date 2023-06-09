import { db } from '../database/database.connection.js';
import dayjs from "dayjs";

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

export async function postRentals(req, res){
    const {customerId, gameId, daysRented } = req.body;

    try{
        if (daysRented <= 0) res.sendStatus(400);

        const {rowCount} = await db.query(`
        INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
        SELECT $1, $2, $3, $4, $5, 
            (SELECT "pricePerDay" FROM games WHERE games.id = $2)*$4, 
            $6
        WHERE EXISTS (
            SELECT 1 FROM games
            WHERE id = $2 AND "stockTotal" > (SELECT COUNT(*) FROM rentals WHERE "gameId" = $2)
        )
        AND EXISTS (
            SELECT 1 FROM customers
            WHERE id = $1
        );        
        `, [customerId, gameId, dayjs().format("YYYY-MM-DD"), daysRented, null, null])

        if(!rowCount) return res.sendStatus(400);
        res.sendStatus(201);
    }catch (err){
        res.status(500).send(err.message);
    }
}

export async function finishRentals(req, res){
    const { id } = req.params;

    try{
        const {rowCount} = await db.query(`
        UPDATE rentals SET "returnDate"=$2,
        "delayFee" = CASE
            WHEN ($2 - "rentDate") > "daysRented"
            THEN (($2 - "rentDate")-"daysRented")*"originalPrice"/"daysRented"
            ELSE 0
        END
        WHERE id=$1 AND "returnDate" IS NULL
        `,
            [id, dayjs().format("YYYY-MM-DD")]
        );
    
        if (!rowCount) {
            const rent = await db.query( `SELECT * FROM rentals WHERE id = $1`, [id]);
            if (rent.rows[0]) return res.sendStatus(400); 
            return res.sendStatus(404);
        }
    
        res.sendStatus(200);
    } catch (err){
        res.status(500).send(err.message);
    }
}

export async function deleteRentals(req, res){
    const { id } = req.params;

    try{
        const {rowCount} = await db.query(`
        DELETE FROM rentals WHERE id=$1 AND "returnDate" IS NOT NULL`, [id]
        );

        if(!rowCount){
            const rent = await db.query( `SELECT * FROM rentals WHERE id = $1`, [id]);
            if (rent.rows[0]) return res.sendStatus(400); 
            return res.sendStatus(404);
        }

        res.sendStatus(200);
    } catch (err){
        res.status(500).send(err.message);
    }
}
