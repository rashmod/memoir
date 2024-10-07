import UserRepository from '@/repositories/user';

export default class UserService {
	userRepository: UserRepository;

	constructor(userRepository: UserRepository) {
		this.userRepository = userRepository;
	}

	async create(username: string) {
		const user = await this.userRepository.create(username);
		if (!user) {
			throw new Error('Failed to create user');
		}
		return user;
	}

	async update() {
		throw new Error('Not implemented');
	}

	async delete() {
		throw new Error('Not implemented');
	}

	async get() {
		throw new Error('Not implemented');
	}

	async getAll() {
		throw new Error('Not implemented');
	}
}
