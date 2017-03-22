import React from 'react'
import { State, Component } from 'jumpsuit'
import Measure from 'react-measure'
import Popout from 'react-popout'
import './Slides.css'


export const SlideShowState = State({
  initial: {
    currentSlide: 0,
    hideNotes: true,
    slideCount: 0,
    slideWidth: 0,
  },

  next: (state, payload) => ({
    ...state,
    currentSlide: Math.min(state.slideCount-1, state.currentSlide + 1),
  }),

  prev: (state, payload) => ({
    ...state,
    currentSlide: Math.max(0, state.currentSlide - 1),
  }),

  setSlideCount: (state, payload) => ({
    ...state,
    slideCount: payload,
  }),

  setSlideWidth: (state, payload) => ({
    ...state,
    slideWidth: Math.round(payload.width),
  }),

  toggleNotes: (state, payload) => ({
    ...state,
    hideNotes: !state.hideNotes,
  }),

  closeNotes: (state, payload) => ({
    ...state,
    hideNotes: true,
  })
})

export const Slide = (props) => (
  <div className={`slide ${props.className}`}>
    {props.children}
  </div>
)

export const Code = (props) => (
  <pre><code>{ props.children }</code></pre>
)

export const Note = (props) => (
  <div className="Note">{props.children}</div>
)

const PrivateNotes = (props) => {
  const {index, content, slide} = props
  return (
    <div>
      <h1>Slide {index}</h1>
      <div>{content}</div>
      <div style={{border: '1px solid black', margin: '20px', padding: '40px'}}>
        {slide}
      </div>
    </div>
  )
}

const getChildren = (component) => {
  let children = component.props.children
  if (!Array.isArray(children)) {
    children = [children]
  }

  return children
}

const isNote = (component) => {
  return component.type.name === "Note"
}

export const SlideShow = Component({
  getMarginLeft() {
    const { index, slideWidth } = this.props
    const width = Math.round(slideWidth)
    const half = Math.round(slideWidth/2)
    const total = half + (width * index)
    return `-${total}px`
  },

  handleKeyPress(ev) {
    switch (ev.key) {
      case "ArrowRight":
      case " ":
        SlideShowState.next()
        break
      case "ArrowLeft":
        SlideShowState.prev()
        break
      case "a":
        SlideShowState.toggleNotes()
        break
      default:
        return
    }
  },

  componentWillMount() {
    window.onkeydown = this.handleKeyPress
    SlideShowState.setSlideCount(this.props.children.length)
  },

  extractNotes() {
    const slide = this.props.children[this.props.index]
    const children = getChildren(slide)

    const notes = children.filter(isNote)

    if (notes.length === 0) {
      return <span/>
    }

    return notes[0]
  },

  render() {
    const slides = this.props.children.map((slide, idx) => (
      <Slide key={idx}>
        { getChildren(slide).filter((x) => !isNote(x)) }
      </Slide>
    ))

    return (
      <div className="slideshow">
        <div className="center" style={{marginLeft: this.getMarginLeft()}}>
          { slides.map((slide, idx) => (
            <Measure
              key={idx}
              onMeasure={(w) => idx === 0 && SlideShowState.setSlideWidth(w)}
            >{slide}</Measure>
          )) }
        </div>

        { !this.props.hideNotes &&
          <Popout title="Private Notes" onClosing={SlideShowState.closeNotes}>
            <PrivateNotes
              index={this.props.index}
              content={this.extractNotes()}
              slide={slides[this.props.index]}
            />
          </Popout>
        }
      </div>
    )
  }
}, (store) => ({
  index: store.slideshow.currentSlide,
  slideWidth: store.slideshow.slideWidth,
  hideNotes: store.slideshow.hideNotes,
}))
