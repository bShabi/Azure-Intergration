import Authcontext from '../../context/AuthContext';
import { useContext } from 'react';
import getAllBudgets from '../../src/api/request-manager-api';
export default async (req, res) => {
  if (req.method === 'GET') {
    const { test } = req.body;
    res.status(200).json({ status: test });
  }
};
