const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
const mongojs = require('mongojs')
const connectionString = 'mongodb://Mukundh:123456a@ds026558.mlab.com:26558/urbanslap'
const mongoose = require('mongoose');
const {
    repairs
} = require('./models/repair')

const dbRepair = mongojs(connectionString, ['repairs'])

mongoose.connect(connectionString);



app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));


app.get('/', (req, res) => {
    res.render('home')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', (req, res) => {
    console.log("login", req.body)

    if (req.body.password != '') {
        res.redirect('/repair')
    } else {
        res.redirect('/login')
    }
})

app.get('/signup/customer', (req, res) => {
    res.render('customersignup')
})

app.get('/signup/serviceprovider', (req, res) => {
    res.render('serviceprod')
})

app.get('/repair', (req, res) => {
    res.render('repair')
})

app.post('/repair', (req, res, next) => {
    let rep = new repairs({
        requireImage: req.body.img,
        skill: req.body.selectservice,
        description: req.body.description,
        accName: "no",
        prices: []
    })
    rep.save()
    res.redirect('/carpenter/getrepairs')
})

app.get('/carpenter/getrepairs', (req, res) => {
    dbRepair.repairs.find({
        "skill": "carpenter"
    }, (err, docs) => {

        console.log(docs)
        res.render('carpenter', carps = docs)
    })

    //{"skill":"carpenter"}
})

app.post('/carpenter/getrepairs', (req, res) => {

    dbRepair.repairs.find({
        "skill": "carpenter"
    }, (err, docs) => {

        console.log(req.body)
        keys = Object.keys(req.body)


        keys.forEach(key => {
            console.log(key)
            console.log(req.body[key])
            var arr = req.body[key]
 
            dbRepair.repairs.findAndModify({
                query: {
                    _id: mongojs.ObjectId(key)
                },

                update: {
                    $set: {
                        acceptedState: arr[1]
                    },
                    $push: {
                        //"prices.$.NameWork": parseInt(arr[0])
                        'Workers': {
                            "Name": arr[0],
                            "price": parseInt(arr[1])
                        }
                    },

                    // $push: {
                    //     'Workers.NameWork.Name': (arr[0])
                    // }
                },
                new: false
            }, function (err, doc, lastErrorObject) {
                console.log("err", err)
            })
        })
        res.redirect('/seeList/carpenter')
    })
})

app.get('/plumber/getrepairs', (req, res) => {
    dbRepair.repairs.find({
        "skill": "plumber"
    }, (err, docs) => {

        console.log(req.body)
        keys = Object.keys(req.body)


        keys.forEach(key => {
            console.log(key)
            console.log(req.body[key])
            var arr = req.body[key]
            dbRepair.repairs.findAndModify({
                query: {
                    _id: mongojs.ObjectId(key)
                },

                update: {
                    $set: {
                        accepted: arr[1]
                    },
                    $push: {
                        //"prices.$.NameWork": parseInt(arr[0])
                        'Workers': {
                            "Name": arr[0],
                            "price": parseInt(arr[1])
                        }
                    },

                    // $push: {
                    //     'Workers.NameWork.Name': (arr[0])
                    // }
                },
                new: false
            }, function (err, doc, lastErrorObject) {
                console.log("err", err)
            })
        })
    })
})

app.get('/seeList/carpenter', (req, res) => {
    dbRepair.repairs.aggregate({
            $match: {
                "skill": "carpenter"
            }
        },

        {
            $unwind: '$Workers'
        },

        {
            $sort: {
                'Workers.prices': 1
            }
        },

        (err, docs) => {
            console.log("see list carpenter", docs)
            res.render('sortedCarpenter', carps = docs)
        }

    )
})

app.post('/seeList/carpenter', (req, res) => {
    res.send("ok cool")

})




app.listen(3000, () => {
    console.log('listening on 3000')
})