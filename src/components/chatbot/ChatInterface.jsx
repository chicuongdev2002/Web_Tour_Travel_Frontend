import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  Badge,
  Divider
} from '@mui/material';
import {
  Send as SendIcon,
  Message as MessageIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Analytics as AnalyticsIcon,
  FiberManualRecord as StatusIcon
} from '@mui/icons-material';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [connected, setConnected] = useState(false);
  const [userId] = useState(`user-${Math.random().toString(36).substr(2, 9)}`);
  const [analysis, setAnalysis] = useState(null);
  const ws = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const connectWebSocket = () => {
    ws.current = new WebSocket(`ws://localhost:8000/ws/${userId}`);

    ws.current.onopen = () => {
      setConnected(true);
      console.log('Connected to WebSocket');
    };

    ws.current.onmessage = (event) => {
      const newMessage = {
        id: Date.now(),
        text: event.data,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, newMessage]);
    };

    ws.current.onclose = () => {
      setConnected(false);
      console.log('Disconnected from WebSocket');
      setTimeout(connectWebSocket, 3000);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnected(false);
    };
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, newMessage]);
    ws.current.send(inputMessage);
    setInputMessage('');
  };

  const submitFeedback = async (conversationId, feedback) => {
    try {
      const response = await fetch('http://localhost:8000/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation_id: conversationId,
          feedback: feedback
        }),
      });
      const data = await response.json();
      console.log('Feedback submitted:', data);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const fetchAnalysis = async () => {
    try {
      const response = await fetch(`http://localhost:8000/analyze/${userId}`);
      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error('Error fetching analysis:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ mb: 4 }}>
        <CardHeader
          title={
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center" gap={1}>
                <MessageIcon />
                <Typography variant="h6">Chat Interface</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <StatusIcon
                  sx={{
                    color: connected ? 'success.main' : 'error.main',
                    fontSize: 12
                  }}
                />
                <Typography variant="body2">
                  {connected ? 'Connected' : 'Disconnected'}
                </Typography>
              </Box>
            </Box>
          }
        />
        <CardContent>
          <Paper
            elevation={0}
            variant="outlined"
            sx={{
              height: 500,
              overflow: 'auto',
              p: 2,
              mb: 2,
              backgroundColor: 'grey.50'
            }}
          >
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  mb: 2
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    maxWidth: '70%',
                    p: 2,
                    backgroundColor: message.sender === 'user' ? 'primary.main' : 'white',
                    color: message.sender === 'user' ? 'white' : 'text.primary'
                  }}
                >
                  <Typography variant="body1">{message.text}</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7, mt: 0.5, display: 'block' }}>
                    {message.timestamp}
                  </Typography>
                </Paper>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Paper>

          <Box component="form" onSubmit={sendMessage} sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={!connected}
              variant="outlined"
              size="small"
            />
            <IconButton
              color="primary"
              type="submit"
              disabled={!connected}
              sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </CardContent>
      </Paper>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardHeader
              title={
                <Box display="flex" alignItems="center" gap={1}>
                  <ThumbUpIcon />
                  <Typography variant="h6">Feedback</Typography>
                </Box>
              }
            />
            <CardContent>
              <Box display="flex" gap={2}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => submitFeedback(1, 1)}
                  startIcon={<ThumbUpIcon />}
                >
                  Positive
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => submitFeedback(1, -1)}
                  startIcon={<ThumbDownIcon />}
                >
                  Negative
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardHeader
              title={
                <Box display="flex" alignItems="center" gap={1}>
                  <AnalyticsIcon />
                  <Typography variant="h6">Analysis</Typography>
                </Box>
              }
            />
            <CardContent>
              <Button
                variant="contained"
                onClick={fetchAnalysis}
                startIcon={<AnalyticsIcon />}
                sx={{ mb: 2 }}
              >
                Fetch Analysis
              </Button>
              {analysis && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1">
                    Total Messages: {analysis.total_messages}
                  </Typography>
                  <Typography variant="body1">
                    Average Response Time: {analysis.average_response_time}
                  </Typography>
                  <Typography variant="body1">
                    Common Topics: {analysis.common_topics.join(', ')}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ChatInterface;