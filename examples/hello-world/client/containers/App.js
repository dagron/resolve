import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { connectReadModel } from 'resolve-redux'
import uuid from 'uuid/v4'

import commentActions from '../actions/comment_actions'
import Header from './Header.js'

const App = ({ comments, [commandTypes]:  }) => (
  <div>
    <Header
      title="reSolve Hello World"
      name="Hello World Example"
      favicon="/favicon.ico"
      css={['/bootstrap.min.css']}
    />
    <h1 align="center">Hello, reSolve world!</h1>
    <div>
      {JSON.stringify(data)}
    </div>
  </div>
)

const mapStateToProps = ({ data }) => ({
  comments: data
})

const mapDispatchToProps = (dispatch) => bindActionCreators(commentActions, dispatch)

export default connectReadModel({
  readModelName: '',
  resolverName: '',
  resolverArgs: {
    treeId: uuid()
  }
})(
  connect(mapStateToProps, mapDispatchToProps)(App)
)
