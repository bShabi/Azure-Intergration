import { io } from 'socket.io-client';
import { API_URL } from '../../config/index';
const strapiEndpoint = API_URL;
// const strapiEndpoint = process.env.REACT_APP_SERVER_URL
export const socket = io(strapiEndpoint);
