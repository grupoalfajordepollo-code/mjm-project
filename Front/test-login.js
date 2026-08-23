import axios from 'axios';
axios.post('http://localhost:3000/api/auth/login', { email: 'juan@mail.com', password: '1234' })
  .then(res => console.log('OK', res.data))
  .catch(err => console.error('ERR', err.response?.status, err.response?.data));
