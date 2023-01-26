import { Request, Response } from 'express';
import { getModelForClass } from '@typegoose/typegoose';
import { Post } from '../../../models/Post'; 
import { User } from '../../../models/Users';

const PostModel = getModelForClass(Post)
const UserModel = getModelForClass(User)

export const deletePost = async (req: Request, res: Response) => {
    try {
        
        const {userId, idPost} = req.body

        //BUSCAMOS Y ELIMINAMOS EL POST POR SU ID
        const postDeleted = await PostModel.findById(idPost)
        if(postDeleted){
            postDeleted.deleted = true;
            await postDeleted.save();
        }
        
        //BUSCAMOS EL USUARIO QUE TENIA EL POST
        const userWithPost = await UserModel.findById(userId)

        if (userWithPost==null) {
            res.status(404).json({error: `Ningun usuario posee este post`})
        } else {
            //ELIMINAMOS EL POST 
            userWithPost.posts = userWithPost.posts.filter(e=> e.toString()!== idPost)
            // GUARDAMOS AMBOS CASOS
            await userWithPost.save()
            res.json({ message: `post deleted: ${postDeleted?.title}` })
        }
    } catch (error) {
        res
        .status(400)
        .json({ message: `Error delete post :${req.params.idPost}`, error })
    }
}