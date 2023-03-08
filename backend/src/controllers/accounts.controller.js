import { request, response } from 'express';
import { getConnection } from '../database/database';

const bcrypt = require('bcrypt');

// GET ACCOUNTS -------------------------------------------------------------------------------------------------------------------------
const getAccounts = async (_req = request, res = response) => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM accounts');

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

// GET ACCOUNT ID -------------------------------------------------------------------------------------------------------------------------
const getAccountId = async (req = request, res = response) => {
    const { id, username } = req.params;

    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM accounts WHERE id = ? OR username = ?', [id, username]);

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

// POST NEW ACCOUNT -------------------------------------------------------------------------------------------------------------------------
const newAccount = async (req = request, res = response) => {
    const { username, first_name, last_name, email, password, groups, user_permissions, is_staff, is_root } = req.body;

    const account = {
        username,
        first_name,
        last_name,
        email,
        password,
        groups,
        user_permissions,
        is_staff,
        is_root
    }

    // se encripta la contraseña
    const salt = bcrypt.genSaltSync();
    account.password = bcrypt.hashSync(password, salt);

    try {
        const connection = await getConnection();
        await connection.query('INSERT INTO accounts SET ?', [account]);

        return res.status(200).json({
            ok: true,
            msg: 'Cuenta agregada'
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: error.message
        });
    }
}

// PUT ACCOUNT -------------------------------------------------------------------------------------------------------------------------
const updAccount = async (req = request, res = response) => {
    const { id } = req.params;
    const { saldo, first_name, last_name, email, password, groups, user_permissions, is_staff, is_root } = req.body;

    const account = {
        saldo,
        first_name,
        last_name,
        email,
        password,
        groups,
        user_permissions,
        is_staff,
        is_root
    }

    // bcrypt.compareSync(password,)

    // // se encripta la contraseña
    // const salt = bcrypt.genSaltSync();
    // account.password = bcrypt.hashSync(password, salt);

    try {
        const connection = await getConnection();
        await connection.query('UPDATE accounts SET ? WHERE `accounts` . `id` = ?', [account, id]);

        return res.status(200).json({
            ok: true,
            msg: 'Cuenta actualizada'
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: error.message
        });
    }
}

// DELETE ACCOUNT -------------------------------------------------------------------------------------------------------------------------
const delAccount = async (req = request, res = response) => {
    const { id } = req.params;

    try {
        const connection = await getConnection();
        await connection.query('DELETE FROM accounts WHERE `accounts`.`id` = ?', [id]);

        return res.status(200).json({
            ok: true,
            msg: 'Cuenta eliminada'
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: error.message
        });
    }
}

module.exports = { getAccounts, getAccountId, newAccount, updAccount, delAccount }