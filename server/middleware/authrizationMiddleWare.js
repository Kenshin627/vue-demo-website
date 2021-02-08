

module.exports = options => {
    const jwt = require('jsonwebtoken')
          assert = require('http-assert')
    return (req,res,next) => {
        const authorization = req.headers.authorization? req.headers.authorization.split(' ').pop() : ''
        assert(authorization,401,'请先登录',)
        jwt.verify(authorization,req.app.get('tokenPrivateKey'),function(err,res) {
            assert(!err,401,'请先登录')
            next()
        })
    }
}