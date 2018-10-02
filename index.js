console.log("starting up!!");

const express = require('express');
const methodOverride = require('method-override');
const pg = require('pg');

const configs = {
  user: 'liangxin',
  host: '127.0.0.1',
  database: 'tunr_db',
  port: 5432,
};

const pool = new pg.Pool(configs);

pool.on('error', function (err) {
  console.log('idle client error', err.message, err.stack);
});

/**
 * ===================================
 * Configurations and set up
 * ===================================
 */

const app = express();

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(methodOverride('_method'));

const reactEngine = require('express-react-views').createEngine();
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', reactEngine);

/**
 * ===================================
 * Routes
 * ===================================
 */

app.get('/artists', (request, response) => {
  const sql = 'SELECT * FROM artists';
  pool.query(sql, (err, res) => {
    if (err) {
      console.log('query err:', err.message);
      response.status(500).send('Error');
    } else {
      response.render('Artists', { artists: res.rows });
    }
  });
});

app.get('/artists/:id', (request, response) => {
  const sql = `SELECT * FROM artists WHERE id = ${request.params.id}`;
  pool.query(sql, (err, res) => {
    if (err) {
      console.log('query err:', err.message);
      response.status(500).send('Error');
    } else {
      response.render('ArtistsShow', res.rows[0]);
    }
  });
});

/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
const server = app.listen(3000, () => console.log('~~~ Tuning in to the waves of port 3000 ~~~'));

server.on('close', () => {
  console.log('Closed express server');

  db.pool.end(() => {
    console.log('Shut down db connection pool');
  });
});
