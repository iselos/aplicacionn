import { sign } from "jsonwebtoken";

const generarJWT = (id) => {
    return new Promise((resolve, reject) => {
        const payload = {id};
        sign(payload, process.env.JWT_SECRET, {expiresIn: '10m'}, (error, token) => {
            if (error) {
                console.log(error);
                reject('No se pudo generar el token');
            } else {
                console.log('se genero el token');
                resolve(token);
            }
        });
    });
}

module.exports = {
    generarJWT
}