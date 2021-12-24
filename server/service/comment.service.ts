import { User } from '../typeorm/entity/User';
import { Comment } from '../typeorm/entity/Comment';
import { Post } from '../typeorm/entity/Post';
import { validate } from 'class-validator';
import { IMemberComment, INonMemberComment, returnComment } from '../types/service/InterfaceComment';
import { getRepository } from 'typeorm';


const createMemberComment = async (commentData: IMemberComment): Promise<returnComment> => {
    const {
        content,
        ipAddress,
        postUuid,
        userUuid,
        parentUuid,
    } = commentData;
    try {
        const postFromUuid = await Post.findOneOrFail({ uuid: postUuid })
        const userFromUuid = await User.findOneOrFail({ uuid: userUuid })
        let comment;
        if (parentUuid !== undefined) {
            const commentFromUuid = await Comment.findOneOrFail({ uuid: parentUuid })
            console.log(commentFromUuid)
            comment = Comment.create({
                content,
                ipAddress,
                post: postFromUuid,
                user: userFromUuid,
                user_nickname: userFromUuid,
                isMember: true,
                parentComment: commentFromUuid
            });
        }
        else {
            comment = Comment.create({
                content,
                ipAddress,
                isMember: true,
                post: postFromUuid,
                user: userFromUuid,
                user_nickname: userFromUuid,
            });
        }

        // 추가해야 검사해줌
        const errors = await validate(comment)
        if (errors.length > 0) throw errors
        await comment.save()
        return {
            success: true,
        }
    } catch (err) {
        return {
            success: false,
            error: "Something went wrong"
        }
    }
}

const createNonMemberComment = async (commentData: INonMemberComment): Promise<returnComment> => {
    const {
        content,
        ipAddress,
        postUuid,
        anonymouseId,
        password,
        parentUuid,
    } = commentData;
    console.log(commentData)
    try {
        const postFromUuid = await Post.findOneOrFail({ uuid: postUuid })
        let comment;
        if (parentUuid !== undefined) {
            const commentFromUuid = await Comment.findOneOrFail({ uuid: parentUuid })
            console.log(commentFromUuid)
            comment = Comment.create({
                content,
                ipAddress,
                post: postFromUuid,
                anonymouseId,
                password,
                parentComment: commentFromUuid
            });
        }
        else {
            comment = Comment.create({
                content,
                ipAddress,
                anonymouseId,
                password,
                post: postFromUuid,
            });
        }
        // 추가해야 검사해줌
        const errors = await validate(comment)
        if (errors.length > 0) throw errors
        await comment.save()
        return {
            success: true,
        }
    } catch (err) {
        return {
            success: false,
            error: "Something went wrong"
        }
    }
}


const deleteComment = async () => {

}

const getCommentsFromPostUuid = async ({ postUuid }: any): Promise<returnComment> => {
    try {
        const comment = await getRepository(Comment)
            .createQueryBuilder("comment")
            .where('comment.parentComment IS NULL')
            .andWhere("post.uuid = :uuid", { uuid: postUuid })
            .leftJoin('comment.post', 'post')
            .leftJoinAndSelect('comment.childComments', ' parentComment')
            .orderBy("comment.createdAt", "ASC")
            .getRawMany();

        const temp: any = {}
        comment.map((o) => {
            // deleted가 1이라면 content 삭제
            if (o.comment_deleted) {
                o.comment_content = "삭제된 글 입니다."
            }

            if (o.parentComment_deleted) {
                o.parentComment_content = "삭제된 글 입니다."
            }

            o.parentComment_ipAddress = o.parentComment_ipAddress &&
                "X.X." + o.parentComment_ipAddress.split('.').slice(2, 4).join('.')

            o.comment_ipAddress = o.comment_ipAddress &&
                "X.X." + o.comment_ipAddress.split('.').slice(2, 4).join('.')

            // temp에 index가 있다면
            if (temp.hasOwnProperty(o.comment_index)) {
                if (o.parentComment_index) {
                    temp[o.comment_index]["childComments"].push({
                        uuid: o.parentComment_uuid,
                        updatedAt: o.parentComment_updatedAt,
                        content: o.parentComment_content,
                        ipAddress: o.parentComment_ipAddress,
                        annonymouseId: o.parentComment_anonymouseId,
                        isMember: o.parentComment_isMember,
                        nickname: o.parentComment_user_nickname,

                    })
                }
            }
            // temp에 index가 없다면
            else {
                const childComments = []
                if (o.parentComment_index) {
                    childComments.push({
                        uuid: o.parentComment_uuid,
                        updatedAt: o.parentComment_updatedAt,
                        content: o.parentComment_content,
                        ipAddress: o.parentComment_ipAddress,
                        annonymouseId: o.parentComment_anonymouseId,
                        isMember: o.parentComment_isMember,
                        nickname: o.parentComment_user_nickname,
                    })
                }
                temp[o.comment_index] = {
                    uuid: o.comment_uuid,
                    updatedAt: o.comment_updatedAt,
                    content: o.comment_content,
                    ipAddress: o.comment_ipAddress,
                    annonymouseId: o.comment_anonymouseId,
                    isMember: o.comment_isMember,
                    nickname: o.comment_user_nickname,
                    childComments
                }

            }
        })

        return {
            success: true,
            comment: temp
        }
    } catch (err) {
        return {
            success: false,
            error: "Something went wrong"
        }
    }
}

export { createMemberComment, createNonMemberComment, deleteComment, getCommentsFromPostUuid }