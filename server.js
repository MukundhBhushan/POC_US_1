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

const {skills}=require('./models/skilloptions')

const dbRepair = mongojs(connectionString, ['repairs'])

mongoose.connect(connectionString);

app.use( express.static( "public" ) );

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/admin',(req,res)=>{
    res.render('admin')
})

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', (req, res) => {
    console.log("login", req.body)

    if (req.body.password != '') {
        res.render('/repair')
    } else {
        res.render('/login')
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
    app.set('skill',req.body.selectservice)
    console.log(app.set('skill',req.body.selectservice))
    res.redirect(`/getrepairs/${req.body.selectservice}`)
})

app.get(`/getrepairs/:${app.get('skill')}`, (req, res) => {
    dbRepair.repairs.find({
        "skill": app.get('skill')
    }, (err, docs) => {

        console.log(docs)
        res.render('skilled', carps = docs)
    })

    //{"skill":"carpenter"}${app.get('skill')}
})

app.post(`/getrepairs/:${app.get('skill')}`, (req, res) => {

    dbRepair.repairs.find({
        "skill": app.get('skill')
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
                            "planofaction":arr[1],
                            "price": parseInt(arr[2])
                            
                        }
                    },

                },
                new: false
            }, function (err, doc, lastErrorObject) {
                console.log("err", err)
            })
        })
        res.redirect(`/seeList/${app.get('skill')}`)
    })
})


app.get(`/seeList/:${app.get('skill')}`, (req, res) => {
    dbRepair.repairs.aggregate({
            $match: {
                "skill": app.get('skill')
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

app.post(`/seeList/:${app.get('skill')}`, (req, res) => {
    res.render("rating")

})

// app.post('/getRating',(req,res)=>{
    
// })


// app.get('/seeList/plumber', (req, res) => {
//     dbRepair.repairs.aggregate({
//             $match: {
//                 "skill": "plumber"
//             }
//         },

//         {
//             $unwind: '$Workers'
//         },

//         {
//             $sort: {
//                 'Workers.prices': 1
//             }
//         },

//         (err, docs) => {
//             console.log("see list plumner", docs)
//             res.render('sortedPlumber', carps = docs)
//         }

//     )
// })

// app.post('/seeList/plumber', (req, res) => {
//     res.send("ok cool plumber")

// })



app.listen(3000, () => {
    console.log('listening on 3000')
})