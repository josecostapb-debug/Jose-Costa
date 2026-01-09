
export enum MuscleGroup {
  ARMS = 'Braços',
  LEGS = 'Pernas',
  CORE = 'Core',
  BACK = 'Costas',
  CHEST = 'Peito',
  FULL_BODY = 'Corpo Todo'
}

export enum Modality {
  SWIMMING = 'Natação',
  WATER_AEROBICS = 'Hidroginástica',
  WEIGHTLIFTING = 'Musculação',
  PILATES = 'Pilates'
}

export enum AccountStatus {
  ACTIVE = 'Ativo',
  OVERDUE = 'Atrasado',
  BLOCKED = 'Bloqueado'
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  modality: Modality;
  description: string;
  imageUrl: string;
}

export interface WorkoutSet {
  exerciseId: string;
  series: number;
  reps: string;
  rest: string;
}

export interface WeeklySheet {
  monday: WorkoutSet[];
  tuesday: WorkoutSet[];
  wednesday: WorkoutSet[];
  thursday: WorkoutSet[];
  friday: WorkoutSet[];
  saturday: WorkoutSet[];
  sunday: WorkoutSet[];
}

export interface Address {
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
  numero: string;
}

export interface Student {
  id: string;
  name: string;
  email?: string;
  whatsapp: string;
  gender: 'Masculino' | 'Feminino' | 'Outro';
  age: number;
  height?: number;
  weight?: number;
  goal?: string;
  medicalNotes?: string;
  startDate: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  modality: Modality;
  photo: string;
  address: Address;
  trainingLocation: string;
  status: AccountStatus;
  weeklySheet: WeeklySheet;
}
