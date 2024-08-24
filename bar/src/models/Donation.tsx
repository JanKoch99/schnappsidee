export interface Donation {
    _id: string;
    victim: string;
    task: string;
    drink: string;
    perpetrator: string;
    contactInfo: string;
    taskState: string;
    victimName: string;
    difficulty: number;
    createdAt: Date;
    updatedAt: Date;
    price: number
}
