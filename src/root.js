import React from 'react';
import { Render, Router, Route, IndexRoute, HistoryMode } from 'jumpsuit'
import App from './App';
import {
  SlideShowState,
  SlideShow,
  Slide,
  Note,
  Code
} from './Slides';
import './index.css';

class Foo extends React.Component {
  constructor() {
    super()
    this.state = {
      visible: true,
    }
  }

  toggle() {
    this.setState({
      visible: !this.state.visible
    })
  }

  render() {
    return (
      <div>
        <button onClick={() => this.toggle()}>Toggle</button>
        {this.state.visible ? "You see me" : "You don't"}
      </div>
    )
  }
}

const MallorcaJS = (props) => (
  <SlideShow>
    <Slide className="active">
      <h1>Hello world</h1>
      <Note>
        <p>Pssst, this is secret</p>
      </Note>
    </Slide>
    <Slide>
      <h1>Stateful vs Stateless</h1>
    </Slide>
    <Slide>
      <h1>asdf</h1>
      <Code>{`
class Foo extends React.Component {
  constructor() {
    super()
    this.state = {
      visible: false,
    }
  }

  toggle() {
    this.setState({
      visible: !this.state.visible
    })
  }

  render() {
    return (
      <div>
        <button onClick={this.toggle}>Toggle</button>
        {this.state.visible ? "You see me" : "You don't"}
      </div>
    )
  }
}
    `}</Code>
    </Slide>
    <Slide>
      <Foo/>
    </Slide>
    <Slide>
      <h1>More content</h1>
    </Slide>
    <Slide>
      <h1>Thank You</h1>
      <Note>
        <ul>
          <li>Any questions?</li>
          <li>We are hiring</li>
        </ul>
      </Note>
    </Slide>
  </SlideShow>
)

const routes = (
  <Router>
    <Route path="/">
      <IndexRoute component={MallorcaJS}/>
    </Route>
    <Route path="/demo">
      <IndexRoute component={App}/>
    </Route>
  </Router>
)

HistoryMode('hash')

Render(
  {slideshow: SlideShowState},
  routes
);
