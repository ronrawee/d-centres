const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Centre = require('./models/centre');

mongoose.connect('mongodb://localhost:27017/d-centre', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/centres', async (req, res) => {
  const centres = await Centre.find({});
  res.render('centres/index', { centres });
});

app.get('/centres/new', (req, res) => {
  res.render('centres/new');
});

app.post('/centres', async (req, res) => {
  const centre = new Centre(req.body.centre);
  await centre.save();
  res.redirect(`/centres/${centre._id}`);
});

app.get('/centres/:id', async (req, res) => {
  const centre = await Centre.findById(req.params.id);
  res.render('centres/show', { centre });
});

app.get('/centres/:id/edit', async (req, res) => {
  const centre = await Centre.findById(req.params.id);
  res.render('centres/edit', { centre });
});

app.put('/centres/:id', async (req, res) => {
  const { id } = req.params;
  const centre = await Centre.findByIdAndUpdate(id, { ...req.body.centre });
  res.redirect(`/centres/${centre._id}`);
});

app.delete('/centres/:id', async (req, res) => {
  const { id } = req.params;
  await Centre.findByIdAndDelete(id);
  res.redirect('/centres');
});

app.listen(3000, () => {
  console.log('Serving on port 3000');
});
