async function askMistral() {
    const key = 'TA_CLE_MISTRAL';
    const input = document.getElementById('user-input');
    const chat = document.getElementById('chat');
    
    chat.innerHTML += `<div><b>Toi:</b> ${input.value}</div>`;
    
    const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
            model: "mistral-tiny",
            messages: [{role: "user", content: input.value}]
        })
    });
    
    const data = await res.json();
    chat.innerHTML += `<div><b style="color:var(--primary)">Brain:</b> ${data.choices[0].message.content}</div>`;
    input.value = "";
    chat.scrollTop = chat.scrollHeight;
}