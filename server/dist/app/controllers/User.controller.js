export class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    ;
    async signup(req, res, next) {
        try {
            const dto = req.body;
            const token = await this.userService.signup(dto);
            res.status(201).json({ token });
        }
        catch (error) {
            next(error);
        }
    }
    ;
    async signin(req, res, next) {
        try {
            const { email, password } = req.body;
            const token = await this.userService.signin(email, password);
            res.status(200).json({ token });
        }
        catch (error) {
            next(error);
        }
    }
    ;
    async getMe(req, res, next) {
        try {
            const userId = req.user.user_id;
            const user = await this.userService.getMe(userId);
            res.status(200).json(user);
        }
        catch (error) {
            next(error);
        }
    }
    ;
    async updateMe(req, res, next) {
        try {
            const dto = req.body;
            const userId = req.user.user_id;
            const requesterRole = req.user.role;
            const success = await this.userService.updateMe(userId, dto, requesterRole);
            res.status(200).json({ success });
        }
        catch (error) {
            next(error);
        }
    }
    ;
    async deleteUser(req, res, next) {
        try {
            const userId = Number(req.query.id);
            const requesterId = req.user.user_id;
            const requesterRole = req.user.role;
            const success = await this.userService.deleteUser(userId, requesterId, requesterRole);
            res.status(200).json({ success });
        }
        catch (error) {
            next(error);
        }
    }
    ;
}
//# sourceMappingURL=User.controller.js.map