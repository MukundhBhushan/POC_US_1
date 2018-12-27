const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
const mongojs = require('mongojs')
var connectionString = 'mongodb://Mukundh:123456a@ds026558.mlab.com:26558/urbanslap'
const mongoose = require('mongoose');
const {
    repairs
} = require('./models/repair')

const {skills}=require('./models/skilloptions')

const dbRepair = mongojs(connectionString, ['repairs'])
const dbSkill = mongojs(connectionString, ['skills'])

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
        res.redirect('/repair')
    } else {
        res.redirect('/login')
    }
})
// app.get('/login/admin',(req,res)=>{
//     res.render('adminLogin')
// })

app.get('/admin',(req,res)=>{
    res.render('admin')
})

app.post('/admin',(req,res)=>{
    var newField=req.body.newfield
    console.log(req.body)
    let skill=new skills({
        skillType:newField
    }).save()
    res.redirect('/')

})

app.get('/signup/customer', (req, res) => {
    res.render('customersignup')
})

app.get('/signup/serviceprovider', (req, res) => {
    res.render('serviceprod')
})

app.get('/repair', (req, res) => {
    dbSkill.skills.find({},function (err, docs) {
        console.log('repair',docs)   
        res.render('repair',skilltypes=docs) 
    })
    
    
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
    res.redirect(`/getrepairs/${req.body.selectservice}`).reload()
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
    selected=[]
    console.log(req.body)
    keys = Object.keys(req.body)
    
    console.log(keys)
    app.set("selectedarr",keys)
    // keyslength=keys.length()
    res.redirect("/rateservice")

})

app.get('/rateservice',(req,res)=>{

    res.render('rating',keys=app.get('selectedarr'))
})

app.post('/rateservice',(req,res)=>{
    //dbRepair.repairs.remove()
    res.send('thanks')
})






app.listen(process.env.PORT|| 3000, () => {
    console.log('listening on 3000')
})