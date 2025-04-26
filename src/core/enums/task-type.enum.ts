export enum TaskType {
    REQUEST_PROMISSORY_NOTE_RECEPTION = 'promissory_note.reception_requested', // Recepcionar externamente un pagaré
    REQUEST_JUDICIAL_CASE_CREATION = 'judicial_case.creation_requested', // Crear externamente un nuevo juicio
    REQUEST_JUDICIAL_MANAGEMENT_CREATION = 'judicial_case.management.creation_requested' // Registrar externamente una gestión para un juicio existente
}