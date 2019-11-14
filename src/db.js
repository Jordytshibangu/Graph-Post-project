const  users = [
    {
        id : '1',
        name : 'Jordy',
        age : 22,
        email : 'jordy@nonacreative.com',
        
    },
    {
        id : '2',
        name : 'david',
        age : 25,
        email : 'david@test.com'
    },
    {
        id : '3',
        name : 'herve',
        age : 26,
        email : 'herve@nonacreative.com'
    },{
        id : '4',
        name : 'jacques',
        age : 52,
        email : 'jacques@nonacreative.com'
    }
]

const posts = [
    {
        id : '1000',
        title : 'The Man',
        body : 'This is a book that was not sold',
        published : true,
        author : '1'
    },
    {
        id : '1001',
        title : 'The sun',
        body : 'This is a new book',
        published : true,
        author : '1'
    },{
        id : '1002',
        title : 'The Moon',
        body : 'This is a book that was not sold',
        published : true,
        author : '2'
    }
]

const comments  = [ 
    {
        id : '1',
        textfield : 'This is the first comment ',
        author : '1',
        post : '1000'
    },
    {
        id : '2',
        textfield : 'This is the second comment ',
        author : '1',
        post : '1000'
    },
    {
        id : '3',
        textfield : 'This is the third comment ',
        author : '2',
        post : '1002'
    },
    {
        id : '4',
        textfield : 'This is the fourth comment ',
        author : '3',
        post : '1000'
    }
]

const db = { comments, users, posts}

export {db as default}  