export default (options, imports) => ({
  readComments: async (store, args) => {
    const { treeId, parentCommentId, maxLevel } = args

    console.log(5)

    const searchLevel =
      maxLevel != null
        ? {
            nestedLevel: {
              $or: Array.from({ length: parseInt(maxLevel) }).map(
                (_, idx) => idx
              )
            }
          }
        : {}

    console.log(11)

    const linearizedComments = await store.find(
      'Comments',
      {
        $and: [
          { treeId, ...searchLevel },
          {
            $or:
              parentCommentId != null
                ? [
                    { commentId: parentCommentId, level: 0 },
                    { parentCommentId }
                  ]
                : [{ parentCommentId }]
          }
        ]
      },
      { commentId: 1, position: 1, content: 1, timestamp: 1 },
      { level: 1, timestamp: 1 }
    )

    console.log(25)

    const treeComments = { children: [] }

    for (const comment of linearizedComments) {
      if (comment.commentId === parentCommentId) {
        treeComments.content = comment.content
        treeComments.timestamp = comment.timestamp
        continue
      }

      console.log(36)

      const path = comment.position.split(/\./g)
      let positionalArray = treeComments.children

      console.log(41)

      for (let idx = 0; idx < path.length - 1; idx++) {
        positionalArray = positionalArray[path[idx]].children
      }

      console.log(47)

      positionalArray[path[path.length - 1]] = {
        content: comment.content,
        timestamp: comment.timestamp,
        children: []
      }
    }

    console.log(56)

    return treeComments
  }
})
