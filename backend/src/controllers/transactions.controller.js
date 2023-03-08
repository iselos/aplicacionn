import { request, response } from 'express';
import { getConnection } from '../database/database';

// GET TRANSACTIONS -------------------------------------------------------------------------------------------------------------------------
const getTransactions = async (_req = request, res = response) => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM transactions');

        return res.status(200).json({
            ok: true,
            result
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: error.message
        });
    }
}

// GET TRANSACTION ID -------------------------------------------------------------------------------------------------------------------------
const getTransactionId = async (req = request, res = response) => {
    const { id } = req.params;

    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM transactions WHERE id = ?', [id]);

        return res.status(200).json({
            ok: true,
            result
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: error.message
        });
    }
}


// POST NEW TRANSACTIONS -----------------------------------------------------------------------------------------------------------------------
const newTransaction = async(req = request, res = response) => {
    const { origen, destino, cantidad } = req.body;

    const transaction = {
        origen,
        destino,
        cantidad
    }

    try {
        const connection = await getConnection();
        await connection.query("INSERT INTO `transactions` SET ?", [transaction]);

        return res.status(200).json({
            ok: true,
            msg: "Transferencia realizada con exito!!"
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: error
        });
    }
}

module.exports = { getTransactions, getTransactionId, newTransaction }