import * as React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/namespace');
  }, []);

  return null;
};

export default Home;
