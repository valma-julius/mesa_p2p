const DATABASE_NAME = "mesa_user_database";
const DATABASE_VERSION = 1;

pr_key = null
pb_key = null

// Generates a new key pair, sends the public key to the server and saves the private key in IndexedDB
function generateNewE2EKeyPair() {
    return new Promise((resolve, reject) => {
        window.crypto.subtle.generateKey(
            {
                name: "RSA-OAEP",
                modulusLength: 2048,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: "SHA-256",
            },
            true,
            ["encrypt", "decrypt"]
        )
        .then(keyPair => {
            pr_key = keyPair.privateKey
            pb_key = keyPair.publicKey
            return writePrivateKeyToIndexedDB(keyPair.privateKey).then(() => {
                return window.crypto.subtle.exportKey("jwk", keyPair.publicKey);
            });
        })
        .then(jwk => {
           
            return sendPublicKeyToServer(jwk);
        })
        .then(() => {
            resolve("Key pair generated and stored successfully");
        })
        .catch(err => {
            console.error(err);
            reject(err);
        });
    });
}


// Writes the private key to IndexedDB
function writePrivateKeyToIndexedDB(key) {
    return new Promise((resolve, reject) => {
        var request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

        request.onupgradeneeded = function(event) {
            var db = event.target.result;
            if (!db.objectStoreNames.contains("keys")) {
                db.createObjectStore("keys", { keyPath: "id" });
            }
        };

        request.onerror = function(event) {
            console.error("Database error: " + event.target.errorCode);
            reject("Database error: " + event.target.errorCode);
        };

        request.onsuccess = function(event) {
            var db = event.target.result;
            var transaction = db.transaction(["keys"], "readwrite");
            var objectStore = transaction.objectStore("keys");
            var addKeyRequest = objectStore.put({ id: "privateKey", key: key });
            console.log(key)

            addKeyRequest.onsuccess = function() {
                resolve("Private key and date stored successfully.");
            };

            addKeyRequest.onerror = function(err) {
                console.log(err)
                reject("Error storing private key: " + err.target.errorCode);
            };
        };
    });
}


// Fetches the private key from IndexedDB
function getPrivateKeyFromIndexedDB() {
    return new Promise((resolve, reject) => {
        let request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

        request.onerror = function(event) {
            reject("Database error: " + event.target.errorCode);
        };

        request.onsuccess = function(event) {
            let db = event.target.result;
            let transaction = db.transaction(["keys"], "readonly");
            let objectStore = transaction.objectStore("keys");
            let keyRequest = objectStore.get("privateKey");

            keyRequest.onerror = function(event) {
                reject("Error fetching key: " + event.target.errorCode);
            };

            keyRequest.onsuccess = function(event) {
                if (keyRequest.result) {
                    resolve(keyRequest.result.key);
                } else {
                    reject("No key found in database");
                }
            };
        };
    });
}

// Decrypts a message using the private key stored in IndexedDB
function decryptMessage(encryptedMessage) {
    return getPrivateKeyFromIndexedDB().then(privateKey => {
        return window.crypto.subtle.decrypt(
            {   
                name: "RSA-OAEP",
            },
            privateKey,
            encryptedMessage
        );
    })
    .then(decryptedBuffer => {
        let dec = new TextDecoder();
        return dec.decode(decryptedBuffer);
    })
    .catch(error => {
        console.error("Decryption error:", error);
    });
}


// Sends the public key to the server
function sendPublicKeyToServer(publicKey) {
    let token = localStorage.getItem('mesa_token');
    let keyString = JSON.stringify(publicKey);

    fetch(`${BASE_URL}/users/update_pub_key`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
        },
        body: JSON.stringify({pub_key: keyString}),
    })
    .then(response => {
        if (response.status === 200) {
            return publicKey;
        }

        console.log("FAIL")
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// Imports a public key into the crypto.subtle API
function importPublicKey(publicKey) {
    key = JSON.parse(publicKey);
    return window.crypto.subtle.importKey(
        "jwk",
        key,
        {   
            name: "RSA-OAEP",
            hash: "SHA-256",
        },
        true,
        ["encrypt"]
    );
}

// Encrypts a message using the given public key
function encryptMessage(message, publicKey) {
    return importPublicKey(publicKey).then(importedKey => {
        let enc = new TextEncoder();
        let encodedMessage = enc.encode(message);
        console.log(importedKey)
        return window.crypto.subtle.encrypt(
            {
                name: "RSA-OAEP"
            },
            importedKey,
            encodedMessage
        );
    })
    .then(encryptedBuffer => {
        return encryptedBuffer;
    })
    .catch(error => {
        console.error("Encryption error:", error);
    });
}


function ab2str(buf) {
    let binary = '';
    let bytes = new Uint8Array(buf);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}
function str2ab(str) {
    let binaryString = window.atob(str);
    let len = binaryString.length;
    let bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

function testEncryptionDecryption() {
    let testMessage = "Hello, this is a test message!";

    generateNewE2EKeyPair().then(() => {
        // Export the public key to JWK format for encryption
        window.crypto.subtle.exportKey("jwk", pb_key).then(jwkPublicKey => {
            // Import the public key for encryption
            window.crypto.subtle.importKey(
                "jwk",
                jwkPublicKey,
                {
                    name: "RSA-OAEP",
                    hash: "SHA-256",
                },
                true,
                ["encrypt"]
            )
            .then(importedPublicKey => {
                // Encrypt the test message
                let enc = new TextEncoder();
                window.crypto.subtle.encrypt(
                    {
                        name: "RSA-OAEP"
                    },
                    importedPublicKey,
                    enc.encode(testMessage)
                )
                .then(encryptedMessage => {
                    // Decrypt the message using the private key
                    getPrivateKeyFromIndexedDB().then(privateKey => {
                        window.crypto.subtle.decrypt(
                            {
                                name: "RSA-OAEP",
                            },
                            privateKey,
                            encryptedMessage
                        )
                        .then(decryptedBuffer => {
                            let dec = new TextDecoder();
                            let decryptedMessage = dec.decode(decryptedBuffer);
    
                            console.log("Decrypted Message:", decryptedMessage);
    
                            if (decryptedMessage === testMessage) {
                                console.log("Encryption and Decryption successful. Original and decrypted messages match.");
                            } else {
                                console.log("Mismatch between original and decrypted messages.");
                            }
                        })
                        .catch(decryptionError => {
                            console.error("Decryption error:", decryptionError);
                        });
                    })
                })
                .catch(encryptionError => {
                    console.error("Encryption error:", encryptionError);
                });
            });
        });
    })
    .catch(error => {
        console.error("Error generating key pair:", error);
    });
}
