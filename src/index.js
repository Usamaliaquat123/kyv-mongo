const mongo = require('mongojs')
const EventEmitter = require('events')
const pify = require('pify')
class kyvMongo extends EventEmitter { 
    constructor(url, opts){
        super()

        this.ttlSupport = false

        url = url || {}
        if(typeof url === 'string'){
            url = {url}
        }

        if(url.uri){
            url = Object.assign({url : url.uri}, url)
        }
        this.opts = Object.assign({
            url : 'mongodb://127.0.0.1:27017',
            collection : 'kyv'
        })

        this.db = mongo(this.opts.url)


        const collection = this.db.collection(this.opts.collection)



        collection.createIndex({ key: 1 },{
            unique : true,
            background : true
        })


        collection.createIndex({ expiresAt: 1 }, {
            expireAfterSeconds: 0,
            background: true
        })

        this.mongo = ['update', 'findone', 'remove'].reduce((obj, method) => {
            obj[method] = pify(collection[method].bind(collection))
            return obj;
        },{})

        this.db.on('error', err => this.emit('error',err))
    }

    get(key){
        return this.mongo.findOne({ key })
            .then(doc => {
                if(doc === null){
                    return undefined
                }
                return doc.value
            })
    }

    set(key,value,ttl) {
        const expiresAt = (typeof ttl === "number") ? new Date(Date.now() + ttl) : null;
        return this.mongo.update({key}, {key, value, expiresAt}, {unset : true})
    }
}


module.exports  = kyvMongo