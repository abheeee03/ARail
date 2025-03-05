import { View, Text, TextInput, Button, ScrollView, StyleSheet, Image, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MaterialIcons } from '@expo/vector-icons';

const genAI = new GoogleGenerativeAI('AIzaSyDbfRMQdlMP6NYIlh96Q1WaD2hfRIuLwlo');

const systemPrompt = `You are RailMate, an AI assistant specialized in Indian railways. Your role is to:
1. Provide accurate information about train schedules, ticket booking, and railway services
2. Answer user queries related to Indian railways
3. Politely decline to answer questions unrelated to railways
4. Always respond in a helpful and professional manner`;

const formatResponseText = (text) => {
  text = text.replace(/\*\*/g, '').replace(/\*/g, '');

  text = text
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/_(.*?)_/g, '<u>$1</u>');

  return text;
};

const renderFormattedText = (text) => {
  const formattedText = formatResponseText(text);
  return (
    <Text>
      {formattedText.split('<br>').map((line, index) => (
        <Text key={index}>
          {line
            .split(/<strong>|<\/strong>|<em>|<\/em>|<u>|<\/u>/)
            .map((part, i) => {
              if (i % 2 === 1) {
                const tag = line.split(/<|>/)[i * 2 + 1];
                switch (tag) {
                  case 'strong':
                    return <Text key={i} style={{fontWeight: 'bold'}}>{part}</Text>;
                  case 'em':
                    return <Text key={i} style={{fontStyle: 'italic'}}>{part}</Text>;
                  case 'u':
                    return <Text key={i} style={{textDecorationLine: 'underline'}}>{part}</Text>;
                  default:
                    return <Text key={i}>{part}</Text>;
                }
              }
              return <Text key={i}>{part}</Text>;
            })}
        </Text>
      ))}
    </Text>
  );
};

const EmptyChatMessage = () => (
  <View style={styles.emptyChatContainer}>
    <View style={styles.dialogueBox}>
      <MaterialIcons name="train" size={48} color="#007bff" />
      <Text style={styles.sloganText}>RailMate</Text>
      <Text style={[styles.sloganText, {fontSize: 18}]}>Your Railway Companion</Text>
      <Text style={styles.subText}>Ask me anything about Railways!</Text>
    </View>
  </View>
);

const assistant = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = { text: inputText, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const fullPrompt = `${systemPrompt}\n\nUser Query: ${inputText}`;
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const cleanedText = formatResponseText(response.text());
      const botMessage = { text: cleanedText, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { text: 'Error: ' + error.message, sender: 'bot' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="smart-toy" size={24} color="#007bff" />
        <Text style={styles.headerText}>RailMate</Text>
      </View>

      <ScrollView style={styles.chatContainer}>
        {messages.length === 0 ? (
          <EmptyChatMessage />
        ) : (
          messages.map((msg, index) => (
            <View
              key={index}
              style={[
                styles.message,
                msg.sender === 'user' ? styles.userMessage : styles.botMessage,
              ]}
            >
              {msg.sender === 'bot' ? renderFormattedText(msg.text) : (
                <Text style={[styles.messageText, msg.sender === 'user' ? styles.userMessageText : styles.botMessageText]}>
                  {msg.text}
                </Text>
              )}
            </View>
          ))
        )}
        {isLoading && (
          <View style={styles.typingIndicator}>
            <ActivityIndicator size="small" color="#007bff" />
            <Text style={[styles.messageText, styles.botMessageText]}>RailMate is typing...</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask RailMate anything..."
          editable={!isLoading}
        />
        <View style={styles.sendButton}>
          <MaterialIcons name="send" size={24} color="#ffffff" onPress={handleSend} disabled={isLoading || !inputText.trim()} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  chatContainer: {
    flex: 1,
    padding: 16,
    marginBottom: 10,
    paddingBottom: 100,
  },
  message: {
    marginBottom: 10,
    padding: 12,
    marginVertical: 4,
    borderRadius: 12,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007bff',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
  },
  messageText: {
    fontSize: 16,
  },
  userMessageText: {
    color: '#ffffff',
  },
  botMessageText: {
    color: '#333333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    minHeight: 80,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    backgroundColor: '#f5f5f5',
  },
  sendButton: {
    backgroundColor: '#007bff',
    borderRadius: 24,
    padding: 12,
  },
  typingIndicator: {
    alignSelf: 'flex-start',
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    marginVertical: 4,
  },
  emptyChatContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dialogueBox: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 30,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  sloganText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 16,
    textAlign: 'center',
  },
  subText: {
    fontSize: 16,
    color: '#666666',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default assistant;