const contactMessages = []

export const handleContactMessage = (req, res) => {
  const { name, email, message } = req.body || {}

  if (!message || typeof message !== 'string' || message.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'Message content is required.',
    })
  }

  const newMessage = {
    id: Date.now(),
    name: name && typeof name === 'string' ? name.trim() : 'Anonymous Visitor',
    email: email && typeof email === 'string' ? email.trim() : 'Not provided',
    message: message.trim(),
    receivedAt: new Date().toISOString(),
  }

  contactMessages.push(newMessage)

  console.log(`[Backend Contact] Received message from ${newMessage.name}:`, newMessage.message)

  return res.status(201).json({
    success: true,
    message: 'Message received successfully!',
    data: newMessage,
  })
}

export const getContactMessages = (req, res) => {
  res.json({
    success: true,
    count: contactMessages.length,
    data: contactMessages,
  })
}
