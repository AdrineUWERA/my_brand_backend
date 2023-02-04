import Like from "../models/Like.js"
import Blog  from "../models/Blog.js"

class LikeService {
    static async Like(userId, id) {
        const like = await Like.findOne({ userId: userId, blogId: id.toString() })
        const likedBlog = await Blog.findById(id)
        if (!like) {
            const likeCreate = await Like.create({
                userId: userId,
                blogId: id.toString(),
                like: true
            })
            likedBlog.likes.push(likeCreate)
            likedBlog.likes++
            console.log(likedBlog)
        }
        else if (like.like === true) {
            like.like = null 
            for (let Like in likedBlog.likes) {
                if (likedBlog.likes[Like].userId === userId) {
                    likedBlog.likes[Like].like = null
                }
            }

            if (likedBlog.likes !== 0) {
                likedBlog.likes--
            }
            await like.save()
        }
        else if (like.like === null) {
            like.like = true
            for (let Like in likedBlog.likes) {
                if (likedBlog.likes[Like].userId === userId) {
                    likedBlog.likes[Like].like = true
                }
            }
            likedBlog.likes++
            await like.save()
        }
        else if (like.like === false) {
            like.like = true
            for (let Like in likedBlog.likes) {
                if (likedBlog.likes[Like].userId === userId) {
                    likedBlog.likes[Like].like = true
                }
            }
            if (likedBlog.likes === 0) {
                likedBlog.likes += 1
            }
            else if (likedBlog.likes !== 0) {
                likedBlog.likes += 2
            }
            await like.save()
        }
        await likedBlog.save()
        return likedBlog
    }

    static async Unlike(userId, id) {
        const unlike = await Like.findOne({ userId: userId, blogId: id.toString() })
        const likedBlog = await Blog.findById(id)
        if (!unlike) {
            const likeCreate = await Like.create({
                userId: userId,
                blogId: id.toString(),
                like: false
            })
            likedBlog.likes.push(likeCreate)
            likedBlog.likes--
            await likeCreate.save()
        }
        else if (unlike.like === false) {
            unlike.like = null
            for (let Like in likedBlog.likes) {
                if (likedBlog.likes[Like].userId === userId) {
                    likedBlog.likes[Like].like = null
                }
            }

            if (likedBlog.likes !== 0) {
                likedBlog.likes--
            }
            await unlike.save()
        }
        else if (unlike.like === null) {
            unlike.like = false
            for (let Like in likedBlog.likes) {
                if (likedBlog.likes[Like].userId === userId) {
                    likedBlog.likes[Like].like = false
                }
            }
            likedBlog.likes--
            if (likedBlog.likes < 0) likedBlog.likes = 0
            await unlike.save()
        }
        else if (unlike.like === true) {
            unlike.like = false
            for (let Like in likedBlog.likes) {
                if (likedBlog.likes[Like].userId === userId) {
                    likedBlog.likes[Like].like = false
                }
            }
            if (likedBlog.likes > 1) {
                likedBlog.likes -= 2

            }
            else if (likedBlog.likes <= 1) {
                likedBlog.likes -= 1
                if (likedBlog.likes < 0) likedBlog.likes = 0

            }
            await unlike.save()
        }
        await likedBlog.save()
        return likedBlog
    }

}

module.exports = LikeService