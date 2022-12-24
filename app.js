const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Panchayath = require('./models/panchayath');
const Complaint = require('./models/complaint');
const Scheme = require('./models/scheme');
const Admin1 = require('./models/admin1');
const Admin2 = require('./models/admin2');
require('dotenv').config();


//session management
const session = require('express-session');
const MongoDbSession = require('connect-mongodb-session')(session)

////////////////////////

const app = express();

//view engine set
app.set('view engine', 'ejs');



//database related

const dbURI = process.env.DB_URI;

mongoose.connect(dbURI, { useNewUrlParser : true, useUnifiedTopology: true })
    .then((result) =>{
        console.log("Db connected..");
        //listen on port 3000
        app.listen(3000);
    })
    .catch(err => console.log(err))



//url encoding to access req.body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//serving static files
app.use(express.static('public'));

//middleware for cookies 

//admin1
const adminStore = new MongoDbSession({
    uri: dbURI,
    collection: "adminSession"
})


app.use(session({
    secret: "secret sign for cookie",
    resave: false,
    saveUninitialized: false,
    store: adminStore
}))

const isAuthAdmin1 = (req, res, next) =>{
    if(req.session.isAuthAdmin1){
        next();
    }
    else{
        res.redirect('/')
    }
}

//admin2
// const admin2Store = new MongoDbSession({
//     uri: dbURI,
//     collection: "admin2Session"
// })


// app.use(session({
//     secret: "secret signature for cookie",
//     resave: false,
//     saveUninitialized: false,
//     store: admin2Store
// }))

const isAuthAdmin2 = (req, res, next) =>{
    if(req.session.isAuthAdmin2){
        next();
    }
    else{
        res.redirect('/')
    }
}












//Routes

// Home page ==============================
app.get('/', (req, res) =>{
    Panchayath.find()
        .then(result =>{
            res.render('index', { title: "Home", panchayaths: result});
        })
        .catch(err => console.log(err));
    
})


//adding admins
// app.post('/registerAdmin2', async (req, res) =>{
//     const { username, password, panchayath } = req.body;

//     const hashedPsw = await bcrypt.hash(password, 12);
//     const hashedusr = await bcrypt.hash(username, 13);

//     admin2 = new Admin2({
//         username: hashedusr,
//         password: hashedPsw,
//         panchayath: panchayath
//     })

//     admin2.save()
//         .then(result =>{
//             console.log("Admin 2 user registered");
//             res.json({response: "Success"})
//         })
//         .catch(err => console.log(err));
// })


app.get('/admin1Login', (req, res) =>{
    res.render('admin1Login', { title: "Admin1Login"});
})

app.post('/admin1Login', (req, res) =>{
    const { username, password } = req.body;
    
    Admin1.find()
        .then(async(result) =>{
            let isMatch = await bcrypt.compare(username, result[0].username);
            if(!isMatch){
                return res.redirect('/admin1Login');
            }

            isMatch = await bcrypt.compare(password, result[0].password);
            if(!isMatch){
                return res.redirect('/admin1Login');
            }

            req.session.isAuthAdmin1 = true;

            res.redirect('/admin1');
        })
        .catch(err => console.log(err));
})

app.post('/admin1Logout', (req, res) =>{
    console.log("logout..");
    req.session.destroy(err =>{
        if(err)console.log(err);
        else{
            res.redirect('/');
        }
    })
})

app.get('/admin1', isAuthAdmin1, (req, res) =>{
    res.render('admin1Dashboard', { title: "Admin1" });
})


//admin2 login details
app.get('/admin2Login', (req, res) =>{
    res.render('admin2Login', { title: "Admin2Login"});
})

app.post('/admin2Login', (req, res) =>{
    const { username, password } = req.body;
    
    Admin2.find()
        .then(async(result) =>{
            let isMatch = await bcrypt.compare(username, result[0].username);
            if(!isMatch){
                return res.redirect('/admin2Login');
            }

            isMatch = await bcrypt.compare(password, result[0].password);
            if(!isMatch){
                return res.redirect('/admin2Login');
            }

            req.session.isAuthAdmin2 = true;
            req.session.panchayathName = result[0].panchayath;

            res.redirect('/admin2');
        })
        .catch(err => console.log(err));
})

app.get('/admin2Logout', (req, res) =>{
    console.log("logout..");
    req.session.destroy(err =>{
        if(err)console.log(err);
        else{
            res.redirect('/');
        }
    })
})

//admin2 login details

app.get('/admin2', isAuthAdmin2, (req, res) =>{
    let schemeNames = [];

    Panchayath.findOne({Pname: req.session.panchayathName})
        .then(result =>{
            schemeNames = result.schemes.map(scheme => scheme.scheme_name)
            res.render('admin2', { title: "Admin2", panchayath: req.session.panchayathName, schemes: schemeNames});
        })
        .catch(err => console.log(err))


    // Panchayath.find()
    //     .then(result =>{
    //         const names = result.map((panch) => panch.Pname)
    //         res.render('admin2', { title: "Admin2", panchayaths: names, schemes: schemeNames});
    //     })
    //     .catch(err => console.log(err));

})


//scheme details from home page
// app.get('/info/schemedet', (req, res) =>{
//     // Panchayath.

//     res.render('schemeDetails', { title: "Details"})
// })
app.get('/info/beneficiaries', (req, res) =>{
    // Panchayath.

    res.send("<p>This is response</p>")
})

app.get('/info/:id', (req, res) =>{
    const id = req.params.id;

    Panchayath.findOne({ _id: id})
        .then(result =>{
            res.render('info', { title: "info", result });
        })
        .catch(err => console.log(err));

})


// Home page ==============================

//Add scheme==========
app.post('/addScheme', (req, res) =>{
    const { name, yt_url, fee, description } = req.body;

    const newScheme = new Scheme({
        name,
        yt_url,
        fee,
        description
    })

    newScheme.save()
    .then(result => {
        console.log("scheme added");
        res.redirect('/admin1')
    })
    .catch(err => console.log(err))
    
})


//Add scheme==========

//get schemes=======

app.get('/schemeList', (req, res) =>{

    Scheme.find()
    .then(result =>{
        res.render('allSchemes', { schemeList: result });
    })
    .catch(err => console.log(err))

    
})


//get schemes=======

//Add beneficiary================
app.post('/addBeneficiary', (req, res) =>{
    const { Bname, scheme_name, funds_recieved, Pname } = req.body;

    const newBeneficiary = {
        name: Bname,
        funds_recieved
    }

    Panchayath.findOne({ })
})


//Add beneficiary================


// Add panchayath==========================

app.post('/addPanchayath', (req, res) =>{
    const { Pname, total } = req.body;
    // const Pname = "Ganadhalu"
    // const total = 20000000
    const used = 0
    const schemes = []
    const staff = []

    const panchayath = new Panchayath({
        Pname : Pname,
        issued_money: total,
        used_money: used,
        schemes: schemes,
        staff: staff
    });

    panchayath.save()
        .then(result =>{
            console.log("Saved data..");
            res.json("Success");
        })
        .catch(err => console.log(err));

})

// Add panchayath==========================






// Add complaint===========================
app.get('/complaint', (req, res) =>{
    res.render('complaint', { title: "Raise complaint"});
})

app.post('/complaint', (req, res) =>{
    const { panchayath_name, username, phone_no, description } = req.body;

    const complaint = new Complaint({
        panchayath_name,
        username,
        phone_no,
        description
    });

    complaint.save()
        .then(result => {
            console.log("Complaint raised..");
            res.redirect('/');
        })
        .catch(err => console.log(err));
})


// Add complaint===========================




app.use((req, res) =>{
    res.status(404).render('404', { title: "Page not found"})
})