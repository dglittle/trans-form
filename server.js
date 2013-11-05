
var _ = require('gl519')
require('./server_utils.js')

_.run(function () {
    defaultEnv("PORT", 5000)
    defaultEnv("NODE_ENV", "production")
    defaultEnv("MONGOHQ_URL", "mongodb://localhost:27017/trans-form")
    defaultEnv("SESSION_SECRET", "super_secret")

    var db = require('mongojs')(process.env.MONGOHQ_URL)
    var express = require('express')
    var app = express()
    var rpc_version = 1
    var rpc = {}

    rpc.grab = function (arg, req) {
        return dbEval(db, function () {
            db.records.ensureIndex({ answerCount : 1, random : 1 }, { background : true })
            var x = db.records.find({}).sort({ answerCount : 1, random : 1 }).limit(1).toArray()[0]
            db.records.update({ _id : x._id }, {
                $inc : { answerCount : 0.0001 }
            })
            return x
        })
    }

    rpc.getResults = function (arg, req) {
        return dbEval(db, function (arg) {
            return db.results.find({}).skip(arg).limit(100).toArray()
        }, arg)
    }

    rpc.submit = function (arg, req) {
        return dbEval(db, function (arg, user) {
            db.results.insert({
                user : user,
                result : arg
            })
        }, arg, req.user)
    }

    createServer(express, app, db,
        process.env.PORT, process.env.SESSION_SECRET,
        rpc_version, rpc)

})
