// npm init
// npm install express
// npm install ejs
// npm install mongoose
// npm install method-override

//for import exress 
const express = require('express');
const app = express();
//automatic to mkdir view
const path = require('path');
//to parsing method patch,delete, put 
const methodOverride = require('method-override')
//for inisialisasi from mongoose
const mongoose = require('mongoose');

//connecting to monggoose
mongoose.connect('mongodb://127.0.0.1:27017/movie_Apps', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('CONNECTION OPEN!!!')
    })
    .catch(err => {
        console.log('OH NO ERROR!!!')
        console.log(err)
    })

//automation find directory public
app.use(express.static(path.join(__dirname, '/public')));
//parsing from html to req.body dan from json to req body
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));
//to parsing method patch,delete, put 
app.use(methodOverride('_method'))

//configuration to ejs
app.set('view engine', 'ejs');
//decide and find direktori view
app.set('views', path.join(__dirname, '/views'))

//create schema 
const mhsSchema = new mongoose.Schema({
    nama: String,
    umur: Number,
    pekerjaan: String,
    alamat: String
});
//create model from schema
const Mahasiswa = mongoose.model('mahasiswa', mhsSchema);
for (let i = 1; i <= 10000; i++) {
    const newMhs = new Mahasiswa({
        nama: `Mahasiswa ${i}`,
        umur: Math.floor(Math.random() * 30) + 18,
        pekerjaan: `Pekerjaan ${i}`,
        alamat: `Alamat ${i}`,
    });
    newMhs.save()
        .then(mahasiswa => {
            console.log('New mahasiswa added to database:' + i);
        })
        .catch(err => {
            console.log('Error adding new mahasiswa to database:', err);
        });
}

//route to dir listMhs.ejs
app.get('/', (req, res) => {
    res.render('index');
})
// views / form.ejs
app.get('/form', (req, res) => {
    res.render('form.ejs');
})
//insert form to database mhs
app.post('/post-form', (req, res) => {
    const { nama, umur, pekerjaan, alamat } = req.body;
    const newMhs = new Mahasiswa({ nama, umur, pekerjaan, alamat });
    newMhs.save()
        .then(mahasiswa => {
            console.log('New Student added to database:', mahasiswa);
            res.redirect('/mahasiswa');
        })
        .catch(err => {
            console.log('Error adding new Student to database:', err);
            res.redirect('/mahasiswa');
        });
})
//view MAHASISWA
app.get('/mahasiswa', async (req, res) => {
    const mhs = await Mahasiswa.find();
    res.render('listMhs', { mhs });
})

//view detail Mahasiswa
app.get('/mahasiswa/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const mhs = await Mahasiswa.findOne({ _id: id });
        res.render('detail', { mhs });
    } catch (err) {
        console.log(err);
        res.send('Error');
    }
})


//For DELETE ALL
app.delete('/deleteAll', async (req, res) => {
    await Mahasiswa.deleteMany({});
    console.log('Data berhasil dihapus');
    res.redirect('/mahasiswa');
});
//DELETE ONE
app.delete('/deleteOne/:id', async (req, res) => {
    const { id } = req.params;
    await Mahasiswa.deleteOne({ _id: id });
    console.log('delete selesai');
    res.redirect('/mahasiswa');
});
//FORM GET EDIT
app.get('/edit/:id/edit', async (req, res) => {
    const { id } = req.params;
    const mhs = await Mahasiswa.findOne({ _id: id });
    res.render('edit', { mhs });
});

//EDIT PATCH(POST METHOD)
app.patch('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { nama, umur, pekerjaan, alamat } = req.body;
    const foundMhs = await Mahasiswa.findOne({ _id: id });
    foundMhs.nama = nama;
    foundMhs.umur = umur;
    foundMhs.pekerjaan = pekerjaan;
    foundMhs.alamat = alamat;
    await foundMhs.save();
    res.redirect('/mahasiswa');
})


app.listen(3000, () => {
    console.log('LISTENING ON PORT 3000')
})
