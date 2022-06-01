export class AnswerAndQuestion {

  questionText: string;
  answerText: string;
  isCorrect: boolean;

  constructor(questionText: string, answerText: string, isCorrect: boolean) {
    this.questionText = questionText;
    this.answerText = answerText;
    this.isCorrect = isCorrect;
  }

}
