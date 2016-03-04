import React, { Component } from 'react';

import { Button, Input } from 'react-bootstrap';

import Network from "./network"
import Marked from "marked"
Marked.setOptions({
  renderer: new Marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
})

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      token: null,
      messages: []
    }
  }
  render() {
    return (
      <div className="container">
        <Input type="text" placeholder="Email" ref="email" />
        <Input type="password" placeholder="Password" ref="password" />
        <Button onClick={() => this.login()} disabled={this.isLoggedIn()}>Login</Button>
        <Button onClick={() => this.logout()} disabled={!this.isLoggedIn()}>Logout</Button>
        <span>token: { this.state.token }</span>
        <Input type="text" placeholder="Channel ID" ref="channel" disabled={!this.isLoggedIn()} />
        <Input type="text" placeholder="Before (Optional)" ref="before" disabled={!this.isLoggedIn()} />
        <Input type="text" placeholder="After (Optional)" ref="after" disabled={!this.isLoggedIn()} />
        <Input type="text" placeholder="Limit (Default=50)" ref="limit" disabled={!this.isLoggedIn()} />
        <Button onClick={() => this.getMessage()} disabled={!this.isLoggedIn()}>Get</Button>
        <table className="table">
          <tbody>
            {
              this.state.messages.map((e, i) => {
                return <tr>
                  <td><Input type="checkbox" ref="export" label={e.author.username} /></td>
                  <td key={i} dangerouslySetInnerHTML={{__html: Marked(e.content)}}></td>
                </tr>
              })
            }
          </tbody>
        </table>
      </div>
    );
  }
  login() {
    Network.request("POST", "https://discordapp.com/api/auth/login", {email: this.refs.email.getValue(), password: this.refs.password.getValue()})
    .then((result) => {
      const token = result.token
      this.setState({token: token})
    })
  }
  logout() {
    Network.request("POST", "https://discordapp.com/api/auth/logout", {token: this.state.token})
    .then(() => {
      this.setState({token: null})
    })
  }
  isLoggedIn() {
    return !!this.state.token
  }
  getMessage() {
    const limit = this.refs.limit.getValue() ? Number(this.refs.limit.getValue()) : 50
    const before = this.refs.before.getValue() || null
    const after = this.refs.after.getValue() || null
    Network.request("GET", `https://discordapp.com/api/channels/${this.refs.channel.getValue()}/messages`,
    {
      limit: limit,
      before: before,
      after: after
    },
    this.state.token)
    .then((result) => {
      this.setState({messages: result})
    })
  }
}
