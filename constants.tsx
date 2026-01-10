
import { Student, Exercise, MuscleGroup, Modality, AccountStatus } from './types';

export const EXERCISES_LIBRARY: Exercise[] = [
  // NATAÇÃO
  {
    id: '1',
    name: 'Braçada Crawl (Tração)',
    muscleGroup: MuscleGroup.ARMS,
    modality: Modality.SWIMMING,
    description: 'Foco na técnica de puxada sob a água. Mantenha o cotovelo alto.',
    imageUrl: 'https://illustrations.popsy.co/sky/surfer.svg'
  },
  {
    id: '3',
    name: 'Pernada de Peito',
    muscleGroup: MuscleGroup.LEGS,
    modality: Modality.SWIMMING,
    description: 'Movimento de chicotada partindo do joelho para propulsão.',
    imageUrl: 'https://illustrations.popsy.co/sky/mountain-climber.svg'
  },
  // HIDROGINÁSTICA
  {
    id: '2',
    name: 'Bíceps com Halteres EVA',
    muscleGroup: MuscleGroup.ARMS,
    modality: Modality.WATER_AEROBICS,
    description: 'Flexão de cotovelo com resistência da água.',
    imageUrl: 'https://illustrations.popsy.co/sky/workout.svg'
  },
  // MUSCULAÇÃO
  {
    id: '13',
    name: 'Supino Reto',
    muscleGroup: MuscleGroup.CHEST,
    modality: Modality.WEIGHTLIFTING,
    description: 'Desenvolvimento peitoral clássico com barra.',
    imageUrl: 'https://illustrations.popsy.co/sky/fitness.svg'
  },
  {
    id: '14',
    name: 'Agachamento Livre',
    muscleGroup: MuscleGroup.LEGS,
    modality: Modality.WEIGHTLIFTING,
    description: 'Foco na amplitude e alinhamento da coluna.',
    imageUrl: 'https://illustrations.popsy.co/sky/lifting-weights.svg'
  },
  // BICICLETA
  {
    id: 'c1',
    name: 'Ciclismo de Estrada',
    muscleGroup: MuscleGroup.LEGS,
    modality: Modality.CYCLING,
    description: 'Treino de endurance em percurso plano ou variado.',
    imageUrl: 'https://illustrations.popsy.co/sky/bicycle.svg'
  },
  {
    id: 'c2',
    name: 'Spinning (Intervalado)',
    muscleGroup: MuscleGroup.LEGS,
    modality: Modality.CYCLING,
    description: 'Alternância de alta cadência com subidas pesadas simuladas.',
    imageUrl: 'https://illustrations.popsy.co/sky/shaking-hands.svg'
  },
  // PILATES
  {
    id: '15',
    name: 'The Hundred',
    muscleGroup: MuscleGroup.CORE,
    modality: Modality.PILATES,
    description: 'Aquecimento e controle do CORE com respiração rítmica.',
    imageUrl: 'https://illustrations.popsy.co/sky/meditating.svg'
  }
];

export const MOCK_STUDENTS: Student[] = [
  {
    id: 's1',
    name: 'Ana Silva',
    email: 'ana.silva@email.com',
    whatsapp: '11999999999',
    gender: 'Feminino',
    age: 28,
    height: 165,
    weight: 62,
    goal: 'Técnica de Crawl.',
    medicalNotes: 'Leve escoliose.',
    startDate: '10/01/2024',
    level: 'Intermediário',
    modality: Modality.SWIMMING,
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
    trainingLocation: 'Academia BodyTech',
    status: AccountStatus.ACTIVE,
    address: { cep: '01310-000', logradouro: 'Av Paulista', bairro: 'Bela Vista', cidade: 'SP', uf: 'SP', numero: '1000' },
    weeklySheet: { monday: [{ exerciseId: '1', series: 4, reps: '100m', rest: '20s' }], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [], sunday: [] }
  },
  {
    id: 's2',
    name: 'Carlos Peixoto',
    email: 'carlos.peixoto@email.com',
    whatsapp: '11988887777',
    gender: 'Masculino',
    age: 52,
    height: 175,
    weight: 85,
    goal: 'Melhorar mobilidade e reduzir dores articulares.',
    medicalNotes: 'Artrite leve nos joelhos.',
    startDate: '15/02/2024',
    level: 'Iniciante',
    modality: Modality.WATER_AEROBICS,
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
    trainingLocation: 'Clube Aquático',
    status: AccountStatus.ACTIVE,
    address: { cep: '01000-000', logradouro: 'Rua das Flores', bairro: 'Jardins', cidade: 'SP', uf: 'SP', numero: '123' },
    weeklySheet: { monday: [], tuesday: [{ exerciseId: '2', series: 3, reps: '20 reps', rest: '30s' }], wednesday: [], thursday: [{ exerciseId: '4', series: 4, reps: '2 min', rest: '45s' }], friday: [], saturday: [], sunday: [] }
  }
];
