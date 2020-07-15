import React, { Component } from 'react';
import { Button, Form, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { USER_ICON, EDIT_ICON } from './common/constants';
import Heading from './common/Heading';
import Text from './common/Text';

//TODO these should be determined by the currently selected todo item via redux
const testHeading = 'Comments';
const testSubHeading = 'These are some comments';
const testComments = [
  [
    {
      user: 'Alexandra',
      body: 'Great stuff. Really top notch work here.'
    },
    {
      user: 'Kelly',
      body: 'The Goals For Today team is without a doubt the best team.'
    },
    {
      user: 'Emre',
      body: 'Did you know the Hoos are STILL defending NCAA men\'s basketball champs???? No I will never get over it :) :) :) :)'
    }
  ],
  [
    {
      user: 'Alexandra',
      body: 'This a comment on the second item in the to do list'
    },
    {
      user: 'Kelly',
      body: 'Cool, that must mean that redux works!'
    },
    {
      user: 'Emre',
      body: 'Download the Redux devtools chrome extension! it\'s pretty handy when developing using redux'
    }
  ],
  [
    {
      user: 'Alexandra',
      body: 'One more set of comments for the third item'
    },
    {
      user: 'Kelly',
      body: 'COne more set of comments for the third item'
    },
    {
      user: 'Emre',
      body: 'One more set of comments for the third item'
    }
  ]
]

class Comments extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='Comments'>
        <Heading baseClass='Comments' hLevel={2}>
          {testHeading}
        </Heading>
        <Heading baseClass='Comments' hLevel={4}>
          {testSubHeading}
        </Heading>
        <div className='Comments-list'>
          {this.props.selectedToDoId != null && this.props.selectedToDoId < testComments.length
            ? testComments[this.props.selectedToDoId].map( (comment, index) => (
              <Comment 
                key={index} 
                user={comment.user} 
                body={comment.body} 
              />
            ))
            : null}
        </div>
        <CommentForm />
      </div>
    )
  }
}

const Comment = (props) => {
  return (
    <div className='Comment'>
      <Icon className='Comment-userIcon' name={USER_ICON} size='large'/>
      <div className='Comment-contentWrapper'>
        <div className='Comment-top'>
          <Heading baseClass='Comment' hLevel={5}>
            {props.user}
          </Heading>
          <span className="Comment-timestamp">
            {/* TODO: put timestamp here */}
          </span>
        </div>
        <Text baseClass='Comments'>
          {props.body}
        </Text>
      </div>
    </div>
  )
}

const CommentForm = (props) => {
  return (
    <Form className="Comment-form" reply>
      <Form.TextArea />
      <Button content='Add Reply' labelPosition='left' icon={EDIT_ICON} primary />
    </Form>
  )
}

const mapStateToProps = state => ({
  selectedToDoId: state.toDos.selectedToDoId
});

export default connect(mapStateToProps)(Comments);
