import * as CryptoJS from 'crypto-js';


export class Encryption{

    
    static encryptData(dataToBeEncrpted){

        const ENCRYPTION_KEY= "JoYPd+qso9s7T+Ebj8pi4Wl8i+AHLv+5UNJxA3JkDgY="
        
        const generated_signature = CryptoJS.AES.encrypt(dataToBeEncrpted, ENCRYPTION_KEY).toString();
        
        return generated_signature;
    }
    
    static decryptData(dataToDecrypt){

        const ENCRYPTION_KEY= "JoYPd+qso9s7T+Ebj8pi4Wl8i+AHLv+5UNJxA3JkDgY="

        const bytes = CryptoJS.AES.decrypt(dataToDecrypt, ENCRYPTION_KEY);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);

        return originalText;
    }
}