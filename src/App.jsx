import React, { useState } from 'react'

function ChatBubble({ sender, text }) {
  return (
    <div className={sender === 'bot' ? 'row bot' : 'row user'}>
      <div className={sender === 'bot' ? 'bubble bot' : 'bubble user'}>
        {text}
      </div>
    </div>
  )
}

export default function App() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "Hey there 👋 I’m Express Protect IQ—here to find you the right car warranty in under 2 minutes. Ready to get started?" }
  ])
  const [input, setInput] = useState('')
  const [step, setStep] = useState(0)
  const [userData, setUserData] = useState({})

  const handleSend = () => {
    if (!input.trim()) return
    const newMessages = [...messages, { sender: 'user', text: input }]

    let nextMessage = ''
    let nextStep = step + 1
    const updatedData = { ...userData }
    const lower = input.trim().toLowerCase()

    switch (step) {
      case 0:
        nextMessage = 'Awesome! What kind of car do you drive? (Year, Make, Model)'
        break
      case 1:
        updatedData.car = input.trim()
        nextMessage = 'How many miles are currently on it?'
        break
      case 2:
        updatedData.mileage = input.trim()
        nextMessage = 'Is your vehicle used for business (like rideshare)? (yes/no)'
        break
      case 3:
        updatedData.businessUse = lower.includes('y') ? 'yes' : 'no'
        nextMessage = 'Have you had any major repairs in the last 6 months? (yes/no)'
        break
      case 4:
        updatedData.repairs = lower.includes('y') ? 'yes' : 'no'
        nextMessage = 'What’s your ZIP code so I can find the best rate in your area?'
        break
      case 5:
        updatedData.zip = input.trim()
        nextMessage = 'Last thing—what’s the best way to send your quote? (Email, Text, or Call)'
        break
      case 6:
        updatedData.contact = input.trim()
        const mileageNum = Number((updatedData.mileage || '').toString().replace(/[^0-9]/g, '')) || 0
        const tier = mileageNum < 80000 && updatedData.businessUse === 'no' ? 'Gold' : 'Silver'
        nextMessage = `Thanks! Based on what you shared, you’re likely eligible for our ${tier} Tier Protection Plan. We’ll reach out via ${updatedData.contact}. 🚗🔧`
        // Send lead to backend
        try {
          const lead = {
            timestamp: new Date().toISOString(),
            car: updatedData.car,
            mileage: updatedData.mileage,
            businessUse: updatedData.businessUse,
            repairs: updatedData.repairs,
            zip: updatedData.zip,
            contact: updatedData.contact,
            userAgent: navigator.userAgent
          }
          fetch('/api/lead', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(lead)
          }).catch(()=>{})
        } catch (e) { /* noop */ }
        break
      default:
        nextMessage = 'Thanks again! Reply “restart” to try another vehicle.'
        if (lower === 'restart') {
          nextStep = 0
          nextMessage = 'Okay, let’s start over. What kind of car do you drive? (Year, Make, Model)'
        }
        break
    }

    setUserData(updatedData)
    setMessages([...newMessages, { sender: 'bot', text: nextMessage }])
    setStep(nextStep)
    setInput('')
  }

  return (
    <div className="container">
      <header>
        <h1>Express Protect IQ</h1>
        <p className="tag">Demo chatbot for warranty qualification</p>
      </header>

      <div className="chat">
        {messages.map((m, i) => <ChatBubble key={i} sender={m.sender} text={m.text} />)}
      </div>

      <div className="inputRow">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message…"
          onKeyDown={(e) => e.key === 'Enter' ? handleSend() : null}
        />
        <button onClick={handleSend}>Send</button>
      </div>

      <footer>
        <small>© {new Date().getFullYear()} Express Protect IQ. For demo purposes only.</small>
      </footer>
    </div>
  )
}
