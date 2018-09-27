import {
  COMMENT_CREATED,
  COMMENT_UPDATED,
  COMMENT_REMOVED
} from '../event_types'
import { createComment, updateComment, removeComment } from '../command_types'

export default (options, imports) => [
  {
    [createComment]: async (state, command, jwtToken) => {
      if (!command.payload.commentId) {
        throw new Error('TODO')
      }

      if (!command.payload.parentCommentId) {
        throw new Error('TODO')
      }

      if (!command.payload.content) {
        throw new Error('TODO')
      }

      await imports.verify(state, command, jwtToken, createComment)

      return {
        type: COMMENT_CREATED,
        payload: {
          commentId: command.payload.commentId,
          parentCommentId: command.payload.parentCommentId,
          content: command.payload.content
        }
      }
    },

    [updateComment]: async (state, command, jwtToken) => {
      await imports.verify(state, command, jwtToken, updateComment)

      return {
        type: COMMENT_UPDATED,
        payload: {
          commentId: command.payload.commentId,
          content: command.payload.content
        }
      }
    },

    [removeComment]: async (state, command, jwtToken) => {
      await imports.verify(state, command, jwtToken, removeComment)

      return {
        type: COMMENT_REMOVED,
        payload: {
          commentId: command.payload.commentId
        }
      }
    }
  }
]
