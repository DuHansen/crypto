let publicKey;
let privateKey;

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
    publicKey = keyPair.publicKey;
    privateKey = keyPair.privateKey;
    // Exportar chaves para armazenamento
    const exportedPublicKey = await window.crypto.subtle.exportKey('spki', publicKey);
    const exportedPrivateKey = await window.crypto.subtle.exportKey('pkcs8', privateKey);
    localStorage.setItem('publicKey', arrayBufferToBase64(exportedPublicKey));
    localStorage.setItem('privateKey', arrayBufferToBase64(exportedPrivateKey));
    return keyPair;
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

async function encryptMessage() {
    await generateKeyPair();
    const message = document.getElementById('message').value;
    const encodedMessage = new TextEncoder().encode(message);
    const encryptedMessage = await window.crypto.subtle.encrypt(
        {
            name: "RSA-OAEP"
        },
        publicKey,
        encodedMessage
    );

    document.getElementById('encryptedMessage').value = arrayBufferToBase64(encryptedMessage);
}
