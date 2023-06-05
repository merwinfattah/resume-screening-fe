import axios from 'axios';

export default axios.create({
  baseURL: 'https://664f-182-253-194-77.ngrok-free.app',
  headers: {
    'Content-type': 'application/json',
  },
});
