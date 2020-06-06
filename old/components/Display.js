import React from 'react'

export default function Display(props) {
  if (!Boolean(props.when)) {
    return null
  }

  const children = props.children
  return (
    <React.Fragment>
      {React.Children.map(children, child => child)}
    </React.Fragment>
  )
}
