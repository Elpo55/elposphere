const API_KEY = 'ag_019c2997c12971d58b4b8186c2902e2b';
let conversationHistory = [];

function createMessage(content, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    
    const avatar = document.createElement('div');
    avatar.className = `avatar ${isUser ? 'user' : 'bot'}`;
    avatar.innerText = isUser ? '👤' : '🧠';
    
    const bubble = document.createElement('div');
    bubble.className = `bubble ${isUser ? 'user' : 'bot'}`;
    bubble.innerText = content;
    
    if (isUser) {
        messageDiv.appendChild(bubble);
        messageDiv.appendChild(avatar);
    } else {
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(bubble);
    }
    
    return messageDiv;
}

function showTyping() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot';
    messageDiv.id = 'typing-indicator';
    
    const avatar = document.createElement('div');
    avatar.className = 'avatar bot';
    avatar.innerText = '🧠';
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(typingDiv);
    return messageDiv;
}

async function askMistral() {
    const input = document.getElementById('user-input');
    const chat = document.getElementById('chat');
    const sendBtn = document.getElementById('sendBtn');
    
    if (!input.value.trim()) return;
    
    const userMessage = input.value;
    
    // Ajouter le message de l'utilisateur
    chat.appendChild(createMessage(userMessage, true));
    conversationHistory.push({role: "user", content: userMessage});
    
    // Afficher l'indicateur de typage
    const typingMsg = showTyping();
    chat.appendChild(typingMsg);
    
    input.value = "";
    sendBtn.disabled = true;
    chat.scrollTop = chat.scrollHeight;
    
    try {
        const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "mistral-tiny",
                messages: conversationHistory
            })
        });
        
        if (!res.ok) {
            throw new Error(`Erreur API: ${res.status}`);
        }
        
        const data = await res.json();
        const botReply = data.choices[0].message.content;
        
        // Supprimer l'indicateur de typage
        typingMsg.remove();
        
        // Ajouter la réponse
        chat.appendChild(createMessage(botReply, false));
        conversationHistory.push({role: "assistant", content: botReply});
        
        chat.scrollTop = chat.scrollHeight;
        
    } catch (error) {
        console.error('Erreur:', error);
        typingMsg.remove();
        chat.appendChild(createMessage('❌ Erreur de connexion. Vérifie ta clé API.', false));
    } finally {
        sendBtn.disabled = false;
        input.focus();
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        askMistral();
    }
}

function sendSuggestion(text) {
    document.getElementById('user-input').value = text;
    askMistral();
}

function clearChat() {
    if (confirm('Voulez-vous vraiment effacer la conversation ?')) {
        document.getElementById('chat').innerHTML = '';
        conversationHistory = [];
        document.getElementById('user-input').focus();
    }
}

function exportChat() {
    let text = 'Conversation ElpoSphere Brain\n' + '='.repeat(30) + '\n\n';
    
    conversationHistory.forEach(msg => {
        text += `${msg.role.toUpperCase()}:\n${msg.content}\n\n`;
    });
    
    const blob = new Blob([text], {type: 'text/plain'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${new Date().getTime()}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Focus sur input au chargement
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('user-input').focus();
});