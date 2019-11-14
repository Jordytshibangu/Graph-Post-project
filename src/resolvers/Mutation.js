import  bcrypt  from 'bcryptjs'
import getUserId from '../utils/getUserId'
import generateToken from '../utils/generateToken'
import hashPassword from '../utils/hashedPassword'


const Mutation = {
        async createUser(parent, { data }, { prisma }, info){
            try{
                
                const emailTaken = await prisma.exists.User({email : data.email})
                if(emailTaken){
                    throw new Error('Please enter a new Email')
                }
                const password = await hashPassword(data.password)
                const user = await prisma.mutation.createUser({ data : {
                    username : data.username,
                    email: data.email,
                    password 
                }})
                    
                    return {
                        user, token : generateToken(user.id)
                    }
            }catch(error){
                throw new Error(error)
            }    
        },
        async loginUser(parent, { data }, {prisma}, info){
            const user = await prisma.query.user( { where : { email : data.email}})

            if(!user){
                throw new Error('Unable to Authenticate')
            }
            const passwordVerified = await bcrypt.compare(data.password, user.password)

            if(passwordVerified === false){
                throw new Error('Unable to Authenticate')
            }

            return {user, token : generateToken(user.id)
        }
        },
        async createPost(parent, { data }, { prisma, request }, info){
           try { 
               const userId = getUserId(request)

               return  prisma.mutation.createPost({
                   data  : {
                    title : data.title,
                    body : data.body,
                    published : data.published,
                    author : {
                        connect : {
                            id : userId
                        }
                    }
                 }}, info)}
            catch(error){
                throw new Error(Error)
            }
        },
        async createComment(parent, { data }, { prisma, request }, info){
            try {
                const userId = getUserId(request)
                const postExist = await prisma.exists.Post({
                    id : data.post,
                    published : true
                })
                if(!postExist){
                    throw new Error('Unable to find post')
                }

                return prisma.mutation.createComment({ data : {
                    text : data.text,
                    author : {
                        connect : {
                            id : userId
                        }
                    },
                    post : {
                        connect : {
                            id : data.post
                        }
                    }
                }}, info)

            }catch(error){
                 throw new Error(error)
            }
          
        },

        async updateUser(parent, {  data }, { prisma, request }, info ){
           try{ 
               const userId = getUserId(request)
               const user =  await prisma.query.user({where : { id : userId}}, info)

               if(typeof data.password === 'string'){
                    data.password = await hashPassword(data.password)
               }
               
                 return prisma.mutation.updateUser({where : { id : user.id}, data }, info)}
            catch(error){
                throw new Error(error)
            }
        },
        async updatePost(parent, { id, data }, { prisma, request }, info){
            try {
                const userId = getUserId(request)
                const postExist = await prisma.exists.Post({ 
                    id : id, 
                    author : {
                        id : userId}
                    })
                    const postPublished = await prisma.exists.Post({id, published : true})

                if(!postExist){
                    throw new Error('Unable to update post !')
                }
                
                if(postPublished && data.post.published === false){
                    await prisma.mutation.deleteManyComments({ where : {post : { id } } })
                }

                return prisma.mutation.updatePost({ where : { id }, data } , info)
            }
            catch(error){throw new Error(error.message)}
        },
        async updateComment(parent, { id, data }, { prisma, request }, info){
            try {
                const userId = getUserId(request)
                const commentExist = await prisma.exists.Comment({
                    id : id,
                    author : {
                        id : userId
                    }
                })
                if(!commentExist){
                    throw new Error('Unable to update comment! ')
                }
                return prisma.mutation.updateComment({where : { id }, data}, info)
            }catch(error){
                throw new Error(error)
            }
        },

        async deleteUser(parent, { id }, { prisma, request }, info){
            try{
                const userId = getUserId(request)
                return await prisma.mutation.deleteUser({ where : { id : userId }}, info)
            }
            catch(error){
               throw new Error(error.message)
            }

        },
        async deletePost(parent, { id }, { prisma, request }, info){
            const userId = getUserId(request)
            const postExist = await prisma.exists.Post({
                id : id, 
                author : {
                     id : userId }
                })
            if(!postExist){
                throw new Error('Unable to delete post')
            }
            return prisma.mutation.deletePost({where : {id}}, info)
        },
        async deleteComment(parent, { id }, {prisma, request}, info){
           try { 
               const userId = getUserId(request)
               const commentExist = await prisma.exists.Comment({
                   id : id,
                   author : {
                       id : userId
                   }
               })
               if(!commentExist){
                   throw new Error('Unable to delete comment! ')
               }
               return prisma.mutation.deleteComment({where : { id }}, info)
           }catch(error){
               throw new Error(error)
           }
        }
    }

export { Mutation as default }