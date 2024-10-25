# Criptografia e Descriptografia

## Descrição
Este projeto consiste em duas páginas simples que permitem a criptografia e descriptografia de mensagens usando criptografia assimétrica (RSA). O objetivo é fornecer uma maneira segura de transmitir mensagens entre dois pontos.

## Funcionalidades
- **Criptografia de Mensagens**: Na primeira página, o usuário pode inserir uma mensagem e criptografá-la usando uma chave pública RSA. [Criptografar Mensagem](encrypt.html)
- **Descriptografia de Mensagens**: Na segunda página, o usuário pode inserir a mensagem criptografada e descriptografá-la usando uma chave privada RSA. [Descriptografar Mensagem](decrypt.html)

## Estrutura do Projeto
O projeto é composto por dois arquivos HTML (`encrypt.html` e `decrypt.html`), cada um com seu respectivo arquivo JavaScript (`encrypt.js` e `decrypt.js`). Há também um arquivo CSS embutido para estilizar as páginas.

## Tecnologias Utilizadas
- **HTML**: Para a estrutura das páginas.
- **CSS**: Para a estilização das páginas.
- **JavaScript**: Para implementar a lógica de criptografia e descriptografia usando a API Web Crypto.

## Explicação Técnica
### Criptografia (`encrypt.js`)
A função `encryptMessage` gera um par de chaves RSA e usa a chave pública para criptografar a mensagem inserida pelo usuário. A mensagem criptografada é então exibida na tela.

### Descriptografia (`decrypt.js`)
A função `decryptMessage` usa a chave privada para descriptografar a mensagem criptografada inserida pelo usuário, mostrando a mensagem original.

### Desenvolvedores
Este projeto foi desenvolvido por Eduardo Hansen.
