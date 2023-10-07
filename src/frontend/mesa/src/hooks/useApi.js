import { useState } from 'react';

export default (apiFunc) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const request = async (...args) => {
    setLoading(true);
    try {
      const result = await apiFunc(...args);
      setData(result.data);
      setLoading(false);
      return result.data;
    } catch (err) {
      if (err.response.status == 401) {
        setError('Wrong username or password!');
      } else {
        setError(err.response.data.message || 'Unexpected Error!');
      }
    } finally {
      setLoading(false);
    }
    return null;
  };

  return {
    data,
    error,
    loading,
    request,
  };
};
