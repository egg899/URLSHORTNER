require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true })); // para forms (x-www-form-urlencoded)
app.use(express.json()); // para JSON

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// Array para almacenar las URLs
let urlDatabase = [];

app.post('/api/shorturl', (req, res) => {
  const {url} = req.body; // la URL enviada por el usuario

  // Aquí luego pondremos la validación y generación del short_url

  //Si existe
  const existing = urlDatabase.find(entry => entry.original_url === url)
  console.log('Existing: ',existing);
  let object;
  if(existing) {
    
    object = {
      original_url : existing.original_url,
      short_url : existing.short_url
    }

  }
  else {
     // Si no existe, la agregamos con short_url nuevo
  const shortUrl = urlDatabase.length + 1;
  urlDatabase.push({
    original_url: url,
    short_url: shortUrl
  });

  object = {
     original_url: url,
     short_url: shortUrl
  }
  }
 
  // console.log('url en la database: ',url);
  res.json(object); // respuesta temporal
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
