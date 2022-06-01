export class Answer {

  questionId: number;
  text: string;

  constructor(questionId: number, text: string) {
    this.questionId = questionId;
    this.text = text;
  }

}
