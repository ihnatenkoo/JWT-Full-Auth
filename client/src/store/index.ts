import axios from 'axios';
import { makeAutoObservable } from 'mobx';
import { API_URL } from '../http';
import { AuthService } from '../services/AuthService';
import { AuthResponse } from '../types/authResponse';
import { IUser } from '../types/IUser';

export default class Store {
	user = {} as IUser;
	isAuth = false;
	isLoading = false;

	constructor() {
		makeAutoObservable(this);
	}

	setAuth(bool: boolean) {
		this.isAuth = bool;
	}

	setUser(user: IUser) {
		this.user = user;
	}

	setLoading(bool: boolean) {
		this.isLoading = bool;
	}

	async login(email: string, password: string) {
		try {
			const response = await AuthService.login(email, password);
			localStorage.setItem('token', response.data.accessToken);
			this.setAuth(true);
			this.setUser(response.data.user);
		} catch (error: any) {
			console.log(error.response?.data?.message);
		}
	}

	async registration(email: string, password: string) {
		try {
			const response = await AuthService.registration(email, password);
			localStorage.setItem('token', response.data.accessToken);
			this.setAuth(true);
			this.setUser(response.data.user);
		} catch (error: any) {
			console.log(error.response?.data?.message);
		}
	}

	async logout() {
		try {
			const response = await AuthService.logout();
			localStorage.removeItem('token');
			this.setAuth(false);
			this.setUser({} as IUser);
		} catch (error: any) {
			console.log(error);
			console.log(error.response?.data?.message);
		}
	}

	async checkAuth() {
		this.setLoading(true);
		try {
			const response = await axios.get<AuthResponse>(
				`${API_URL}/auth/refresh`,
				{
					withCredentials: true,
				}
			);

			localStorage.setItem('token', response.data.accessToken);
			this.setAuth(true);
			this.setUser(response.data.user);
		} catch (error: any) {
			console.log(error.response?.data?.message);
		} finally {
			this.setLoading(false);
		}
	}
}
