
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
  {
    id: '17',
    name: 'Medley (4 Estilos)',
    muscleGroup: MuscleGroup.FULL_BODY,
    modality: Modality.SWIMMING,
    description: 'Trabalho completo de coordenação e resistência em todos os nados.',
    imageUrl: 'https://illustrations.popsy.co/sky/shaking-hands.svg'
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
  {
    id: '4',
    name: 'Corrida Estacionária na Água',
    muscleGroup: MuscleGroup.LEGS,
    modality: Modality.WATER_AEROBICS,
    description: 'Elevação de joelhos simulando corrida com impacto reduzido.',
    imageUrl: 'https://illustrations.popsy.co/sky/remote-work.svg'
  },
  {
    id: '18',
    name: 'Remada Alta Aquática',
    muscleGroup: MuscleGroup.BACK,
    modality: Modality.WATER_AEROBICS,
    description: 'Fortalecimento dorsal utilizando a densidade da água.',
    imageUrl: 'https://illustrations.popsy.co/sky/creative-work.svg'
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
  {
    id: '19',
    name: 'Remada Curvada',
    muscleGroup: MuscleGroup.BACK,
    modality: Modality.WEIGHTLIFTING,
    description: 'Exercício primordial para densidade das costas.',
    imageUrl: 'https://illustrations.popsy.co/sky/standing-on-the-giant-shoulder.svg'
  },
  {
    id: '20',
    name: 'Levantamento Terra',
    muscleGroup: MuscleGroup.FULL_BODY,
    modality: Modality.WEIGHTLIFTING,
    description: 'Engajamento total de cadeias musculares posteriores e core.',
    imageUrl: 'https://illustrations.popsy.co/sky/successful-man.svg'
  },
  // PILATES
  {
    id: '15',
    name: 'The Hundred',
    muscleGroup: MuscleGroup.CORE,
    modality: Modality.PILATES,
    description: 'Aquecimento e controle do CORE com respiração rítmica.',
    imageUrl: 'https://illustrations.popsy.co/sky/meditating.svg'
  },
  {
    id: '16',
    name: 'Leg Circle',
    muscleGroup: MuscleGroup.LEGS,
    modality: Modality.PILATES,
    description: 'Estabilização pélvica e mobilidade do quadril.',
    imageUrl: 'https://illustrations.popsy.co/sky/yoga.svg'
  },
  {
    id: '21',
    name: 'Swan Dive',
    muscleGroup: MuscleGroup.BACK,
    modality: Modality.PILATES,
    description: 'Extensão de coluna e fortalecimento da musculatura paravertebral.',
    imageUrl: 'https://illustrations.popsy.co/sky/falling.svg'
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
  },
  {
    id: 's3',
    name: 'Ricardo Souza',
    email: 'ricardo@email.com',
    whatsapp: '11888888888',
    gender: 'Masculino',
    age: 45,
    modality: Modality.WEIGHTLIFTING,
    level: 'Iniciante',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ricardo',
    startDate: '12/03/2024',
    status: AccountStatus.ACTIVE,
    trainingLocation: 'SmartFit',
    address: { cep: '01000-000', logradouro: 'Rua Direita', bairro: 'Centro', cidade: 'SP', uf: 'SP', numero: '1' },
    weeklySheet: { monday: [], tuesday: [{ exerciseId: '13', series: 3, reps: '12', rest: '1m' }], wednesday: [], thursday: [], friday: [], saturday: [], sunday: [] }
  },
  {
    id: 's4',
    name: 'Mariana Costa',
    email: 'mari.costa@email.com',
    whatsapp: '11777777777',
    gender: 'Feminino',
    age: 32,
    modality: Modality.PILATES,
    level: 'Avançado',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mariana',
    startDate: '05/05/2024',
    status: AccountStatus.ACTIVE,
    trainingLocation: 'Studio Vibe',
    address: { cep: '01311-000', logradouro: 'Al Santos', bairro: 'Cerqueira César', cidade: 'SP', uf: 'SP', numero: '500' },
    weeklySheet: { monday: [{ exerciseId: '15', series: 1, reps: '100', rest: '0' }], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [], sunday: [] }
  }
];
