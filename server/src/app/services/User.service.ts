import type { IUserRepository, User } from "../interfaces/IUserRepository.js";

export class UserService{

    constructor(private userRepository: IUserRepository){};

    async signup(data: {
        username: string,
        email: string,
        password: string
    }): Promise<string> {
        return ""; // for now dummy function
    }
}
