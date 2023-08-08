/* eslint-disable @typescript-eslint/no-explicit-any */
const express = require('express');
const { Users } = require('../db/index');
import { isUserAuthenticated } from '../db/middleware/auth';

const router = express.Router();


// route to GET all users
router.get('/', async (req: any, res: any) => {
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

router.get('/user', isUserAuthenticated, (req: any, res: any) => {
  res.json(req.user);
});

// GET request to retrieve one user
router.get('/:id', async (req: any, res: any) => {

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
router.patch('/:id', async (req: any, res: any) => {
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
router.delete('/:id', async (req: any, res: any) => {
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

export default router;