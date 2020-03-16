export class User {
    constructor(
        public userid: number,
        public email: string,
        public firstname: string,
        public lastname: string,
        public phone: number,
        public pwd: string,
        public isadmin: boolean) {}
    
}