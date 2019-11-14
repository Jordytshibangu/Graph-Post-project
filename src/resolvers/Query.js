import getUserId from '../utils/getUserId'
import { threadId } from 'worker_threads'

const Query = {
        users(parent, args , {prisma}, info){
            const opArgs = {}
            if(args.query){
                opArgs.where = {
                    OR : [{username_contains: args.query},{email_contains: args.query}]
                }
            }
            return prisma.query.users(null, info)
        },
        posts(parent,args , { prisma}, info){
            const opArgs = { 
                where : {
                    published : true
                }
            }
            if(args.query){
                opArgs.where.OR =  [
                    {
                        title_contains : args.query
                    },
                    {
                        body_contains : args.query
                    }]
            }

            return prisma.query.posts(null, info)
        },
        async myPosts(parent, args, { prisma, request }, info){
            const userId = getUserId(request)
            const opArgs = {
                where : {
                    author : {
                        id : userId
                    }
                }
            }
            if(args.query){
                opArgs.where.OR = [{
                    title_contains : args.query
                },{
                    body_contains : args.query
                }]
            }
            return prisma.query.posts(opArgs, info)
        },
        comments(parent, args, {prisma}, info){
            return prisma.query.comments(null, info)
        },
        async me(parent, args, { prisma, request }, info){
            const userId = getUserId(request, true)
            const meExist = await prisma.exists.User({id : userId})
            
            if(!meExist){
                throw new Error('Is Are not find')
            }

            return  prisma.query.user({ where : {
                id : userId
            }})

        },
        async post(parent, args, { prisma, request }, info){

            const userId = getUserId(request, false)

            const posts = await prisma.query.posts({
                where : {
                    id : args.id,
                    OR : [{
                        published : true
                    }, {
                        author : {
                            id : userId
                        }
                    }]
                }
            }, info)
            console.log(posts[0])
            if(posts.length === 0){
                throw new Error('Post not found !')
            }
            return posts
            
        }
    }


export { Query as default}