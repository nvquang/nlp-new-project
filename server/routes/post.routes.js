import { Router } from 'express';
import * as PostController from '../controllers/post.controller';
const router = new Router();


// Add a new Post
router.route('/aspectsBased').post(PostController.aspectsBased);


export default router;
