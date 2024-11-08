export class Patient {
    id: number;
    name?: string;
    age: number;
    gender: "남성" | "여성" | "미상";
    citizenship: "내국인" | "외국인" | "미상";
    ktasCode?: string;
    category?: string;
    subcategory?: string;
    symptom: string;
    severity?: number;
}