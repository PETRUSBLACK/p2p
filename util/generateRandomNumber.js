function generateRandomChar() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return characters.charAt(Math.floor(Math.random() * characters.length));
}

export const generateSerialNumber = () => {
    let serialNumber = '';
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 2; j++) {
            serialNumber += generateRandomChar();
        }
        if (i < 7) {
            serialNumber += '-';
        }
    }
    return serialNumber;
}