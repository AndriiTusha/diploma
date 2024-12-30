import ApiError from "../error/ApiError.js";

class UsersController {
    async registration (req, res) {
    }
    async login (req, res) {
    }
    async check (req, res, next) {
        const {id} = req.query;
        if(!id) {
            return next(ApiError.badRequest('No ID'))
        }
        res.json(id)
    }
}

const usersController = new UsersController();
export default usersController;