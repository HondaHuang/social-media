import React from 'react';
import './chat.css';
import socketIOClient from "socket.io-client";
import ChatInput from './input.js';
import ChatJoinInput from './joinInput.js';
import userIcon from '../images/user.png';

let host;
if (process.env.NODE_ENV === "production") {
  host = window.location.href
} else {
  host = "http://localhost:3000/"
}
const socket = socketIOClient(host);

class Chat extends React.Component {
  state = {
    joined: false,
    name: "Anonymous",
  }
  componentDidMount() {
    socket.on('users list', (usersList) => {
      if (document.querySelector('.users')) {
        let usersListElement = '';
        for (let i = 0; i < usersList.length; i++) {
          usersListElement += `<li>${usersList[i]}</li>`
        }
        document.querySelector('.users').innerHTML = usersListElement;
      }
    })
    socket.on('send message', (user, text) => {
      if (document.querySelector('.messages')) {
        let message = document.createElement('li');
        message.className="message";
        message.innerHTML = `
          <div class="user">
            <img class="usericon"
           src=${userIcon}
           alt="User Icon">
            <div class="username">${user}</div>
          </div>
          <div class="chatbubble">
            <div class="arrow-left"></div>
            <div class="content">${text}</div>
          </div>`;
        document.querySelector('.messages').appendChild(message);
        document.querySelector('.end').scrollIntoView({block: 'end', behavior: 'smooth'})
      }
    })
    socket.on('join chat', (name) => {
      if (document.querySelector('.messages')) {
        let message = document.createElement('li');
        message.className="announcement";
        message.textContent = name + ' has entered the room';
        document.querySelector('.messages').appendChild(message);
        document.querySelector('.end').scrollIntoView({block: 'end', behavior: 'smooth'})
      }
    })
  }
  sendMessage = (message) => {
    socket.emit('send message', this.state.name.trim(), message)
  }
  joinChat = (name) => {
    socket.emit('join chat', name)
    this.setState({
      joined: true,
      name: name,
    })
  }
  renderMessages = () => (
    <React.Fragment>
      <div className="messages-container" ref={(el) => { this.messagesContainer = el; }}>
        <div className="messages"></div>
        <div className="end"></div>
      </div>
      <div className="input-container">
        {this.state.joined ? <ChatInput sendMessage={this.sendMessage}/> :
          null}
      </div>
    </React.Fragment>
  )

  render () {
    return (
      <main className="chat-container">
        <section className="messages-section">
          <h1>Chatroom</h1>
          {this.state.joined ? this.renderMessages() : <ChatJoinInput joinChat={this.joinChat}/>}
        </section>
        <section className="users-container">
          <h1>Users In Chat</h1>
          <div className="users"></div>
        </section>
      </main>
    )
  }
}

export default Chat;
