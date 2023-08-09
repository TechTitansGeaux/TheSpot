/* eslint-disable @typescript-eslint/no-explicit-any */
const express = require('express');
const { Users } = require('../db/index');
import { isUserAuthenticated } from '../db/middleware/auth';
// use multer to handle file uploads
const multer = require('multer');

const users = express.Router();

// set up multer storage
const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    cb(null, 'server/public/uploads'); // set the destination folder for uploaded files
  },
  filename: (req: any, file: any, cb: any) => {
    cb(null, Date.now() + '-' + file.originalname); // Set the file name with a timestamp to avoid conflicts
  }
});

const upload = multer({ storage }); // initialize multer with the storage configuration

// route to GET all users
users.get('/', async (req: any, res: any) => {
  try {
    // Retrieve all users from the database
    const users = await Users.findAll();

    // Respond with the retrieved users
    res.json(users);
  } catch (error) {
    // Handle any errors that occur
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

users.get('/user', isUserAuthenticated, (req: any, res: any) => {
  res.json(req.user);
});

// GET request to retrieve one user
users.get('/:id', async (req: any, res: any) => {

  const { id } = req.params;

  try {
    // Find the user by ID in the database
    const user = await Users.findByPk(id);

    if (!user) {
      // If the user doesn't exist, send a 404 Not Found response
      return res.status(404).json({ error: 'User not found' });
    }

    // Respond with the retrieved user
    res.json(user);
  } catch (error) {
    // Handle any errors that occur
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PATCH request to update a user
users.patch('/:id', async (req: any, res: any) => {
  const { id } = req.params;
  const updatedUserData = req.body;

  try {
    // Find the user by ID in the database
    const user = await Users.findByPk(id);

    if (!user) {
      // If the user doesn't exist, send a 404 Not Found response
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the user's data
    await user.update(updatedUserData);

    // Respond with the updated user
    res.json(user);
  } catch (error) {
    // Handle any errors that occur
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE request to delete a user
users.delete('/:id', async (req: any, res: any) => {
  const { id } = req.params;

  try {
    // Find the user by ID in the database
    const user = await Users.findByPk(id);

    if (!user) {
      // If the user doesn't exist, send a 404 Not Found response
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete the user from the database
    await user.destroy();

    // Respond with a success message
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    // Handle any errors that occur
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST request to upload a user image
users.post('/uploadImage/:id', isUserAuthenticated, upload.single('image'), async (req: any, res: any) => {
  const { id } = req.params;

  try {
    // Find the user by ID in the database
    const user = await Users.findByPk(id);

    if (!user) {
      // If the user doesn't exist, send a 404 Not Found response
      return res.status(404).json({ error: 'User not found' });
    }

    // Construct the URL of the uploaded image
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    // Update the user's picture field with the URL of the uploaded image
    user.picture = imageUrl;

    // Save the updated user to the database
    await user.save();

    // Respond with the updated user
    res.json(user);
  } catch (error) {
    // Handle any errors that occur
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET request to retrieve a user's geolocation
users.get('/:id/geolocation', async (req: any, res: any) => {
  const { id } = req.params;

  try {
    // Find the user by ID in the database
    const user = await Users.findByPk(id);

    if (!user) {
      // If the user doesn't exist, send a 404 Not Found response
      return res.status(404).json({ error: 'User not found' });
    }

    // Get the geolocation property from the user object
    const geolocation = user.geolocation;

    // Respond with the user's geolocation
    res.json({ geolocation });
  } catch (error) {
    // Handle any errors that occur
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default users;