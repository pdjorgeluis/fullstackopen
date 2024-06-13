import { useState } from 'react'


const H1Text = ({ text }) => {
  return(
    <h1>{text}</h1>
  )
}

const Button = ({ onClickHandle, text }) => {
  return <button onClick={onClickHandle}>{text}</button>
}

const StaticLine = ({ text, value }) => {
  return (
    <tbody>
      <tr>
        <td>{text}</td>
        <td>{value}</td>
      </tr>
    </tbody>
  )
}

const Statics = ({good, neutral, bad}) => {
    if(!good && !neutral && !bad)
      return <p>No feedback given</p>
    return (
      <table>
        <StaticLine text='good' value={good} />
        <StaticLine text='neutral' value={neutral} />
        <StaticLine text='bad' value={bad} />
        <StaticLine text='all' value={good + neutral + bad} />
        <StaticLine text='average' value={(good - bad)/(good + neutral + bad)} />
        <StaticLine text='positive' value={good * 100 / (good + neutral + bad) + ' %'} />
      </table>
    )
    
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const increaseGood = () => {
    setGood(good + 1)
  }

  const increaseNeutral = () => {
    setNeutral(neutral + 1)
  }

  const increaseBad = () => {
    setBad(bad + 1)
  }

  return (
    <div>
      <H1Text text='give feedback' />
      <Button onClickHandle={increaseGood} text='good' />
      <Button onClickHandle={increaseNeutral} text='neutral' />
      <Button onClickHandle={increaseBad} text='bad' />
      <H1Text text='statics' />
      <Statics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App
