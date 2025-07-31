export class Mylogin {
    username: string = '';
    password: string = '';
    mobile: string = '';
    otp = Math.floor((Math.random() * 987654) + 123456);
    verifyotp: number = 0;
}
