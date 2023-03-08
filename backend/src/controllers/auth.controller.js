import { request, response } from 'express';
import { getConnection } from '../database/database';
import { compareSync } from 'bcrypt';
import { generarJWT } from '../helpers/jwt';

const login = async (req = request, res = response) => {
    const { username, password } = req.body;

    try {
        const connection = await getConnection();
        const resultado = await connection.query('SELECT id, password FROM accounts WHERE username = ?', username);

        // SE BUSCA QUE ESTE EL USUARIO EN LA BASE DE DATOS
        if (resultado.lenght < 1) {
            return res.status(404).json({
                ok: false,
                msg: 'Datos incorrectos'
            })
        }

        // SI EXISTE EL USUARIO, SE COMPARA LA CONTRASEÑA INGRESADA CON LA QUE ESTA ENCRIPTADA EN LA BASE DE DATOS
        const validPassword = compareSync(password, (resultado[0].password));
        if (!validPassword) {
            return res.status(404).json({
                ok: false,
                msg: 'Contraseña incorrecta'
            });
        }

        // SI EXISTE EL USUARIO Y LA CONTRASEÑA ES CORRECTA GENERA EL TOKEN
        const token = await generarJWT(resultado[0].id);

        return res.status(200).json({
            ok: true,
            token
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'algo salio mal',
        })
    }
}

module.exports = { login }