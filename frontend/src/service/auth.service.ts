import axios from './root.service';
import axiosModule from 'axios';  
import cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { convertirMinusculas } from '../helper/formatData.js';
import Cookies from 'js-cookie';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  nombreCompleto: string;
  email: string;
  rut: string;
  password: string;
}

interface AuthResponseData {
  data: {
    token: string;
  };
  user: DecodedToken;
  message?: string;
  status?: number;
}

interface DecodedToken {
  nombreCompleto: string;
  email: string;
  rut: string;
  rol: string;
}

/**
 * Inicia sesión de un usuario enviando credenciales al backend.
 * @param {LoginPayload} dataUser Objeto con el email y la contraseña del usuario.
 * @returns {Promise<AuthResponseData>} Una promesa que resuelve con los datos de la respuesta del backend.
 * @throws {Error} Si la solicitud falla o la respuesta no es exitosa.
 */

export async function login(dataUser: LoginPayload): Promise<AuthResponseData> {
  try {
    const response = await axios.post<AuthResponseData>('/auth/login', {
      email: dataUser.email,
      password: dataUser.password
    });

    const { status, data } = response;

    if (status === 200 && data.data && data.data.token) {
      const token = data.data.token;

      const decodedUser = jwtDecode<DecodedToken>(token);

      const userData: DecodedToken = {
        nombreCompleto: decodedUser.nombreCompleto,
        email: decodedUser.email,
        rut: decodedUser.rut,
        rol: decodedUser.rol
      };

      /* sessionStorage.setItem('administrador', JSON.stringify(userData)); */
      localStorage.setItem('administrador', JSON.stringify(userData)); // ✅ Nuevo

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      Cookies.set('jwt-auth', token, { path: '/' });

      return { ...response.data, user: userData };
    } else {
      throw new Error(data.message || 'Error desconocido al iniciar sesión.');
    }
  } catch (error: unknown) {
    if (axiosModule.isAxiosError(error) && error.response) {
      console.error('[auth.service] Error en login:', error.response.data);
      throw error.response.data;
    }
    console.error('[auth.service] Error inesperado en login:', error);
    throw error;
  }
}

/**
 * Registra un nuevo usuario enviando sus datos al backend.
 * @param {RegisterPayload} data Objeto con los datos del nuevo usuario.
 * @returns {Promise<any>} Una promesa que resuelve con los datos de la respuesta del backend.
 * @throws {Error} Si la solicitud falla o la respuesta no es exitosa.
 */
export async function register(data: RegisterPayload): Promise<any> {
  try {
    const dataRegister = convertirMinusculas(data);
    const { nombreCompleto, email, rut, password } = dataRegister;

    const response = await axiosModule.post('/auth/register', {
      nombreCompleto,
      email,
      rut,
      password,
    });
    return response.data;
  } catch (error: unknown) {
    if (axiosModule.isAxiosError(error) && error.response) {
      console.error('[auth.service] Error en register:', error.response.data);
      throw error.response.data;
    }
    console.error('[auth.service] Error inesperado en register:', error);
    throw error;
  }
}

/**
 * Cierra la sesión del usuario, eliminando el token y los datos de sesión.
 * @returns {Promise<void>} Una promesa que resuelve cuando la sesión ha sido cerrada.
 * @throws {Error} Si la solicitud de logout al backend falla.
 */
export async function logout(): Promise<void> {
  try {

    localStorage.removeItem('administrador');
    Cookies.remove('jwt');
    Cookies.remove('jwt-auth');

    delete axiosModule.defaults.headers.common['Authorization'];

  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    throw error;
  }
}