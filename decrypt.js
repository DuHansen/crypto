function base64ToArrayBuffer(base64) {
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
        base64ToArrayBuffer(keyData),
        {
            name: "RSA-OAEP",
            hash: "SHA-256"
        },
        true,
        type === 'public' ? ['encrypt'] : ['decrypt']
    );
}

async function decryptMessage() {
    const encryptedMessage = document.getElementById('encryptedMessage').value;
    const privateKey = await importKey('private', localStorage.getItem('privateKey'));
    const decodedMessage = base64ToArrayBuffer(encryptedMessage);

    try {
        const decryptedMessage = await window.crypto.subtle.decrypt(
            {
                name: "RSA-OAEP"
            },
            privateKey,
            decodedMessage
        );
        document.getElementById('originalMessage').value = new TextDecoder().decode(decryptedMessage);
    } catch (error) {
        console.error('Erro ao descriptografar mensagem:', error);
    }
}
