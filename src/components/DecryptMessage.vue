<template>
  <div class="container">
    <h2>Descriptografar Mensagem</h2>
    <textarea v-model="encryptedMessage" rows="4" placeholder="Cole sua mensagem criptografada aqui..."></textarea>
    <button @click="decryptMessage">Descriptografar</button>
    <p>Mensagem Original:</p>
    <textarea v-model="originalMessage" rows="4" readonly></textarea>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const encryptedMessage = ref('');
const originalMessage = ref('');

async function base64ToArrayBuffer(base64) {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

async function importKey(type, keyData) {
  const format = type === 'public' ? 'spki' : 'pkcs8';
  return await window.crypto.subtle.importKey(
    format,
    await base64ToArrayBuffer(keyData),
    {
      name: "RSA-OAEP",
      hash: "SHA-256"
    },
    true,
    type === 'public' ? ['encrypt'] : ['decrypt']
  );
}

async function decryptMessage() {
  const privateKey = await importKey('private', localStorage.getItem('privateKey'));
  const decodedMessage = await base64ToArrayBuffer(encryptedMessage.value);

  try {
    const decryptedMessage = await window.crypto.subtle.decrypt(
      { name: "RSA-OAEP" },
      privateKey,
      decodedMessage
    );
    originalMessage.value = new TextDecoder().decode(decryptedMessage);
  } catch (error) {
    console.error('Erro ao descriptografar mensagem:', error);
  }
}

function goToEncrypt() {
  window.location.href = 'encrypt.html';
}
</script>

<style scoped>
.container {
  max-width: 400px; 
  width: 100%;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}
textarea, button {
  width: 100%; 
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box; 
}
button {
  background-color: #007BFF;
  color: white;
  cursor: pointer;
  border: none;
}
button:hover {
  background-color: #0056b3;
}
.navigation {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap; 
}
@media (max-width: 600px) {
  .container {
    padding: 15px; 
  }
  textarea {
    font-size: 14px; 
  }
  button {
    font-size: 14px; 
  }
}
</style>
