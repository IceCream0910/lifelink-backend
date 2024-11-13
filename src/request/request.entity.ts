export class Request {
    id: number
    hospital_id: number
    patient_id: number
    patient_data: JSON
    hospital_data?: JSON
    status: string
    distance: number
}