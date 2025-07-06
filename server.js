const express = require('express'); 
const cors = require('cors'); 
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json()); //ليقدر يستخدم ال body parameters


const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});


const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Welcome to CarLiX Garage API Server');
});

app.post('/enter', (req, res) => {
  const { firstName, lastName, mobileNumber } = req.body;

  if (!firstName || !lastName || !mobileNumber) {
    return res.status(400).json({ error: 'Please fill all the required fields' });
  }

  const query = 'INSERT INTO customers (first_name, last_name, mobile_number) VALUES (?, ?, ?)';
  connection.query(query, [firstName, lastName, mobileNumber], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error inserting customer' });
    const customerId = results.insertId;
    res.json({ message: 'Customer entered', customerId });
  });
});

app.post('/check-car-availability', (req, res) => {
  const { carId } = req.body;
  if (!carId) return res.status(400).json({ error: 'carId is required' });

  const query = 'SELECT status FROM cars WHERE car_id = ?';
  connection.query(query, [carId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length === 0) return res.status(404).json({ error: 'Car not found' });
    const isAvailable = results[0].status === 'available';
    res.json({ available: isAvailable });
  });
});

app.post('/reserve-car', (req, res) => {
  const { customerId, carId } = req.body;

  const checkCustomerQuery = 'SELECT * FROM customers WHERE customer_id = ?';
  connection.query(checkCustomerQuery, [customerId], (err, customerResults) => {
    if (err || customerResults.length === 0) return res.status(400).json({ error: 'Customer not found' });

    const carQuery = 'SELECT * FROM cars WHERE car_id = ?';
    connection.query(carQuery, [carId], (err, carResults) => {
      if (err || carResults.length === 0) return res.status(400).json({ error: 'Car not found' });
      if (carResults[0].status !== 'available') return res.status(400).json({ error: 'Car not available' });

      const updateCarStatusQuery = 'UPDATE cars SET status = "reserved" WHERE car_id = ?';
      connection.query(updateCarStatusQuery, [carId], (err) => {
        if (err) return res.status(500).json({ error: 'Failed to update status' });

        const insertReservationQuery = 'INSERT INTO reservations (customer_id, car_id) VALUES (?, ?)';
        connection.query(insertReservationQuery, [customerId, carId], (err) => {
          if (err) return res.status(500).json({ error: 'Failed to insert reservation' });
          res.json({ message: 'Car reserved successfully for the test drive!' });
        });
      });
    });
  });
});

app.post('/sell-car', (req, res) => {
  const { customerId, carId } = req.body;

  const checkReservationQuery = 'SELECT * FROM reservations WHERE customer_id = ? AND car_id = ?';
  connection.query(checkReservationQuery, [customerId, carId], (err, results) => {
    if (err || results.length === 0) return res.status(400).json({ error: 'Car not reserved' });

    const carQuery = 'SELECT * FROM cars WHERE car_id = ?';
    connection.query(carQuery, [carId], (err, carResults) => {
      if (err || carResults.length === 0 || carResults[0].status !== 'reserved')
        return res.status(400).json({ error: 'Car not available for sale' });

      const updateCarStatusQuery = 'UPDATE cars SET status = "sold" WHERE car_id = ?';
      connection.query(updateCarStatusQuery, [carId], (err) => {
        if (err) return res.status(500).json({ error: 'Failed to update status' });

        const insertSaleQuery = 'INSERT INTO sales (customer_id, car_id, price) VALUES (?, ?, ?)';
        connection.query(insertSaleQuery, [customerId, carId, carResults[0].price], (err) => {
          if (err) return res.status(500).json({ error: 'Failed to insert sale' });

          const deleteReservationQuery = 'DELETE FROM reservations WHERE customer_id = ? AND car_id = ?';
          connection.query(deleteReservationQuery, [customerId, carId], (err) => {
            if (err) return res.status(500).json({ error: 'Failed to delete reservation' });
            res.json({ message: 'Car purchased successfully. Sale recorded.' });
          });
        });
      });
    });
  });
});

app.post('/cancel-reservation', (req, res) => {
  const { customerId, carId } = req.body;

  const checkReservationQuery = 'SELECT * FROM reservations WHERE customer_id = ? AND car_id = ?';
  connection.query(checkReservationQuery, [customerId, carId], (err, results) => {
    if (err || results.length === 0) return res.status(400).json({ error: 'No reservation found' });

    const updateCarStatusQuery = 'UPDATE cars SET status = "available" WHERE car_id = ?';
    connection.query(updateCarStatusQuery, [carId], (err) => {
      if (err) return res.status(500).json({ error: 'Failed to update car status' });

      const deleteReservationQuery = 'DELETE FROM reservations WHERE customer_id = ? AND car_id = ?';
      connection.query(deleteReservationQuery, [customerId, carId], (err) => {
        if (err) return res.status(500).json({ error: 'Failed to cancel reservation' });
        res.json({ message: 'Reservation cancelled successfully!' });
      });
    });
  });
});


app.listen(PORT, () => {
  console.log(`Server listen to http://localhost:${PORT}`);
});
