import jwt from 'jsonwebtoken'

function generateJWT(user) {
    let token = jwt.sign({
        user_ID : user._id,
        user_pass : user.password
    }, process.env.JWT_KEY)

    return token
}

export default generateJWT