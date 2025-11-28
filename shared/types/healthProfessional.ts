export interface HealthProfessional {
    id: number;
    name: string;
    license_number: string;
    speciality:string;
    pivot: PivotData;
}

export interface PivotData {
    duration_minutes:number,
    price:number,
    notes:string
    status:string
}
