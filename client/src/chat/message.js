import React from 'react'
import PropTypes from 'prop-types'

class Message extends React.Component {

  render () {
    let message = this.props.messageInfo;
    return (
      <div className="message">
        <div className="user">
          <img className="usericon"
         src={message.userIcon}
         alt="User Icon" />
          <div className="username">{message.user}</div>
        </div>
        <div className="chatbubble">
          <div className="arrow-left"></div>
          <div className="content">
            {message.content.text}
            {message.content.imageLink ? <img className="message-image" src={message.content.imageLink} /> : null}
          </div>
        </div>
      </div>
    )
  }
}

export default Message;
