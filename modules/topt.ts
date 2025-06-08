import { authenticator } from 'otplib';

function getSecretKey(): string {
    if ( !('AUTHENTICATOR_KEY' in process.env) ) {
        console.error("AUTHENTICATOR_KEY has not been set")
        process.exit(1)
    }
    return process.env.AUTHENTICATOR_KEY!
}

export function otp(): string {
    const secretKey = getSecretKey();
    // // Generate a time-based one-time password
    return authenticator.generate(secretKey) 
} 

// console.log(otp())