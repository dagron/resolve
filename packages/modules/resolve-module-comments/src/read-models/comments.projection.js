import {
  COMMENT_CREATED,
  COMMENT_UPDATED,
  COMMENT_REMOVED
} from '../event_types'

export default (options, imports) => ({
  Init: async store => {
    await store.defineTable('Comments', {
      indexes: {
        mainId: 'string',
        treeId: 'string',
        commentId: 'string',
        childCommentId: 'string',
        parentCommentId: 'string',
        timestamp: 'number',
        nestedLevel: 'number'
      },
      fields: [
        'position', // string
        'content' // json
      ]
    })
  },

  [COMMENT_CREATED]: async (store, event) => {
    const {
      aggregateId: treeId,
      payload: { commentId, parentCommentId, content },
      timestamp
    } = event

    await store.insert({
      mainId: `${commentId}`,
      treeId,
      commentId,
      position: null,
      childCommentId: null,
      parentCommentId,
      nestedLevel: 0,
      timestamp,
      content
    })

    if (parentCommentId == null) return

    const parentComments = await store.find(
      {
        $or: [
          { commentId: parentCommentId },
          { childCommentId: parentCommentId }
        ]
      },
      { mainId: 0, timestamp: 0, content: 0 },
      { nestedLevel: 1, timestamp: -1 }
    )

    let newParentPosition = -1
    for (const parentComment of parentComments) {
      if (parentComment.nestedLevel > 1) break
      if (parentComment.commentId !== parentCommentId) continue
      if (parentComment.nestedLevel == null) continue
      const parentPosition = Number(parentComment.position)
      if (parentPosition > newParentPosition) {
        newParentPosition = parentPosition
      }
    }

    newParentPosition++

    for (const parentComment of parentComments) {
      const position = `${parentComment.position}.${newParentPosition}`
      await store.insert({
        mainId: `${parentComment.mainId}.${newParentPosition}`,
        treeId,
        commentId: parentComment.commentId,
        position,
        childCommentId: commentId,
        parentCommentId: parentComment.parentCommentId,
        nestedLevel: parentComment.nestedLevel + 1,
        timestamp,
        content
      })
    }
  },

  [COMMENT_UPDATED]: async (store, event) => {
    const {
      payload: { commentId, content }
    } = event

    await store.update(
      { $or: [{ commentId }, { childCommentId: commentId }] },
      { $set: { content } }
    )
  },

  [COMMENT_REMOVED]: async (store, event) => {
    const {
      payload: { commentId }
    } = event

    const childCommentsIds = (await store.find(
      { commentId },
      { childCommentId: 1 }
    ))
      .map(({ commentId: innerCommentId }) => innerCommentId)
      .concat(commentId)

    await store.delete({
      $or: [
        ...childCommentsIds.map(innerCommentId => ({
          childCommentId: innerCommentId
        })),
        ...childCommentsIds.map(innerCommentId => ({
          commentId: innerCommentId
        }))
      ]
    })
  }
})
