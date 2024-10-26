<template>
  <div class="container">
    <h2>Criptografar Mensagem</h2>
    <textarea v-model="message" rows="4" placeholder="Digite sua mensagem aqui..."></textarea>
    <button @click="encryptMessage">Criptografar</button>
    <p>Mensagem Criptografada:</p>
    <textarea v-model="encryptedMessage" rows="4" readonly></textarea>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const message = ref('');
const encryptedMessage = ref('');

async function generateKeyPair() {
    const keyPair = await window.crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"]
    );

    const exportedPublicKey = await window.crypto.subtle.exportKey('spki', keyPair.publicKey);
    const exportedPrivateKey = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
    localStorage.setItem('publicKey', arrayBufferToBase64(exportedPublicKey));
    localStorage.setItem('privateKey', arrayBufferToBase64(exportedPrivateKey));
}

async function encryptMessage() {
    // Gera a chave se não existir
    if (!localStorage.getItem('publicKey')) {
        await generateKeyPair();
    }

    const encodedMessage = new TextEncoder().encode(message.value);
    const publicKey = await window.crypto.subtle.importKey(
        'spki',
        base64ToArrayBuffer(localStorage.getItem('publicKey')),
        {
            name: "RSA-OAEP",
            hash: "SHA-256"
        },
        true,
        ["encrypt"]
    );

    const encryptedBuffer = await window.crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        publicKey,
        encodedMessage
    );

    encryptedMessage.value = arrayBufferToBase64(encryptedBuffer);
}

function base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
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
</style>
