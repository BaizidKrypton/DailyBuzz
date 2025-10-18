type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD';
type ChallengeType = 'MATH' | 'LOGIC' | 'TRIVIA' | 'MEMORY';

interface Challenge {
  type: ChallengeType;
  question: string;
  answer: string | number;
  options?: string[];
}

export const challengeService = {
  generateChallenge(type: ChallengeType, difficulty: DifficultyLevel): Challenge {
    switch (type) {
      case 'MATH':
        return this.generateMathChallenge(difficulty);
      case 'LOGIC':
        return this.generateLogicPuzzle(difficulty);
      case 'TRIVIA':
        return this.generateTrivia(difficulty);
      case 'MEMORY':
        return this.generateMemoryGame(difficulty);
      default:
        return this.generateMathChallenge(difficulty);
    }
  },

  generateMathChallenge(difficulty: DifficultyLevel): Challenge {
    let num1: number, num2: number, operation: string, answer: number;

    switch (difficulty) {
      case 'EASY':
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        operation = ['+', '-'][Math.floor(Math.random() * 2)];
        answer = operation === '+' ? num1 + num2 : num1 - num2;
        break;
      case 'MEDIUM':
        num1 = Math.floor(Math.random() * 50) + 10;
        num2 = Math.floor(Math.random() * 20) + 5;
        operation = ['+', '-', '*'][Math.floor(Math.random() * 3)];
        answer = operation === '+' ? num1 + num2 : operation === '-' ? num1 - num2 : num1 * num2;
        break;
      case 'HARD':
        num1 = Math.floor(Math.random() * 100) + 20;
        num2 = Math.floor(Math.random() * 50) + 10;
        const num3 = Math.floor(Math.random() * 20) + 5;
        answer = num1 + num2 - num3;
        return {
          type: 'MATH',
          question: `${num1} + ${num2} - ${num3} = ?`,
          answer: answer
        };
      default:
        num1 = 5;
        num2 = 3;
        operation = '+';
        answer = 8;
    }

    return {
      type: 'MATH',
      question: `${num1} ${operation} ${num2} = ?`,
      answer: answer
    };
  },

  generateLogicPuzzle(difficulty: DifficultyLevel): Challenge {
    const puzzles = {
      EASY: [
        { question: 'What comes next: 2, 4, 6, 8, ?', answer: '10' },
        { question: 'If all roses are flowers, and some flowers fade quickly, do all roses fade quickly?', answer: 'no' }
      ],
      MEDIUM: [
        { question: 'What number comes next: 1, 1, 2, 3, 5, 8, ?', answer: '13' },
        { question: 'Complete the sequence: J, F, M, A, M, ?', answer: 'j' }
      ],
      HARD: [
        { question: 'If 5 machines take 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?', answer: '5' },
        { question: 'What is the next number: 2, 6, 12, 20, 30, ?', answer: '42' }
      ]
    };

    const selectedPuzzles = puzzles[difficulty];
    const puzzle = selectedPuzzles[Math.floor(Math.random() * selectedPuzzles.length)];

    return {
      type: 'LOGIC',
      question: puzzle.question,
      answer: puzzle.answer
    };
  },

  generateTrivia(difficulty: DifficultyLevel): Challenge {
    const trivia = {
      EASY: [
        { question: 'What is the capital of France?', answer: 'paris', options: ['London', 'Paris', 'Berlin', 'Madrid'] },
        { question: 'How many days are in a week?', answer: '7', options: ['5', '6', '7', '8'] }
      ],
      MEDIUM: [
        { question: 'What is the largest planet in our solar system?', answer: 'jupiter', options: ['Mars', 'Jupiter', 'Saturn', 'Neptune'] },
        { question: 'Who painted the Mona Lisa?', answer: 'da vinci', options: ['Van Gogh', 'Picasso', 'Da Vinci', 'Michelangelo'] }
      ],
      HARD: [
        { question: 'What year did World War II end?', answer: '1945', options: ['1943', '1944', '1945', '1946'] },
        { question: 'What is the speed of light in meters per second?', answer: '299792458', options: ['299792458', '300000000', '299000000', '298000000'] }
      ]
    };

    const selectedTrivia = trivia[difficulty];
    const question = selectedTrivia[Math.floor(Math.random() * selectedTrivia.length)];

    return {
      type: 'TRIVIA',
      question: question.question,
      answer: question.answer,
      options: question.options
    };
  },

  generateMemoryGame(difficulty: DifficultyLevel): Challenge {
    const length = difficulty === 'EASY' ? 4 : difficulty === 'MEDIUM' ? 6 : 8;
    const sequence = Array.from({ length }, () => Math.floor(Math.random() * 9) + 1).join('');

    return {
      type: 'MEMORY',
      question: `Remember this sequence: ${sequence}`,
      answer: sequence
    };
  },

  validateAnswer(challenge: Challenge, userAnswer: string): boolean {
    const normalizedAnswer = userAnswer.toLowerCase().trim();
    const normalizedCorrectAnswer = String(challenge.answer).toLowerCase().trim();
    
    return normalizedAnswer === normalizedCorrectAnswer;
  }
};
