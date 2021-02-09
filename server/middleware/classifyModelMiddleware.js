module.exports = options => {
    return (req,res,next) => {
        const resource = req.params.resource
        req.Model = require('inflection').classify(resource)
        next()
    }
}