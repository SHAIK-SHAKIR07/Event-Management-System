import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function Register() {
  const navigate = useNavigate();
  useEffect(() => { navigate('/login'); }, []);
  return null;
}