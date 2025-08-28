require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const { URL } = require('url');

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
  if(!/^https?:\/\//i.test(url)) {
    return res.json({error: 'Invalid url'})
  }




  try {
    const urlObj = new URL(url); //Converte en objeto el URL
    //console.log('urlObj', urlObj);
    const hostname = urlObj.hostname;

    console.log('El Host: ', hostname);
    dns.lookup(hostname, (err) => {
      if(err) {
        return res.json({ error: 'invalid url' });
      }



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



            }); // fin del dns



  } catch(error){
    return res.json({ error: 'invalid url' });
  }




});




app.get('/api/shorturl/:short_url', (req, res) =>{
  const shortUrl = parseInt(req.params.short_url);


  //Buscar el objeto en el array
  const entry = urlDatabase.find(item => item.short_url === shortUrl);

  if(!entry){
    // Si no existe, mostrar el error
    return res.json({ error: 'No short URL found for the given input' });
  }

  console.log(entry.original_url);
  // Si existe redirigir a la URL original
  res.redirect(entry.original_url);

});

app.listen(port, function() {
  console.log(`Listening on port http://localhost:${port}`);
});
