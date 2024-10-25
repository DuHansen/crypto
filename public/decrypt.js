new Vue({
    el: '#app',
    data: {
        encryptedMessage: '',
        originalMessage: ''
    },
    methods: {
        base64ToArrayBuffer(base64) {
            const binaryString = window.atob(base64);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            return bytes.buffer;
        },
        
        async importKey(type, keyData) {
            const format = type === 'public' ? 'spki' : 'pkcs8';
            return await window.crypto.subtle.importKey(
                format,
                this.base64ToArrayBuffer(keyData),
                {
                    name: "RSA-OAEP",
                    hash: "SHA-256"
                },
                true,
                type === 'public' ? ['encrypt'] : ['decrypt']
            );
        },
        
        async decryptMessage() {
            const decodedMessage = this.base64ToArrayBuffer(this.encryptedMessage);
            const privateKey = await this.importKey('private', localStorage.getItem('privateKey'));

            try {
                const decryptedMessage = await window.crypto.subtle.decrypt(
                    {
                        name: "RSA-OAEP"
                    },
                    privateKey,
                    decodedMessage
                );
                this.originalMessage = new TextDecoder().decode(decryptedMessage);
            } catch (error) {
                console.error('Erro ao descriptografar mensagem:', error);
            }
        },
        
        goToEncrypt() {
            window.location.href = 'encrypt.html';
        }
    }
});
