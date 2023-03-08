import { request, response } from "express";
import { jwt } from "jsonwebtoken";

const validarJWT = (req = request, res = response, next) => {

    const token = req.header("x-token");

    console.log('token desde validar-jwt: ' + token);

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay un token en la peticion'
        });
    }

    try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET);

        //Estamos seguros de que el token es correcto.
        req.id = id;

        next();

    } catch (error) {
        return res.status(401).json({
            ok:false,
            msg: 'Token no valido'
        });
    }
}

module.exports = validarJWT;