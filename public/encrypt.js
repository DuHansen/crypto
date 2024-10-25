new Vue({
    el: '#app',
    data: {
        message: '',
        encryptedMessage: ''
    },
    methods: {
        async generateKeyPair() {
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
            localStorage.setItem('publicKey', this.arrayBufferToBase64(exportedPublicKey));
            localStorage.setItem('privateKey', this.arrayBufferToBase64(exportedPrivateKey));
        },

        arrayBufferToBase64(buffer) {
            let binary = '';
            const bytes = new Uint8Array(buffer);
            const len = bytes.byteLength;
            for (let i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return window.btoa(binary);
        },

        async encryptMessage() {
            await this.generateKeyPair();
            const encodedMessage = new TextEncoder().encode(this.message);
            const publicKey = await window.crypto.subtle.importKey(
                'spki',
                this.base64ToArrayBuffer(localStorage.getItem('publicKey')),
                {
                    name: "RSA-OAEP",
                    hash: "SHA-256"
                },
                true,
                ["encrypt"]
            );

            const encryptedMessage = await window.crypto.subtle.encrypt(
                {
                    name: "RSA-OAEP"
                },
                publicKey,
                encodedMessage
            );

            this.encryptedMessage = this.arrayBufferToBase64(encryptedMessage);
        },

        base64ToArrayBuffer(base64) {
            const binaryString = window.atob(base64);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            return bytes.buffer;
        }
    }
});
