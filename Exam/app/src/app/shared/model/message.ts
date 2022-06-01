export class Message {

  id: number;
  text: string;
  sender: string;

  constructor(id: number, text: string, sender: string) {
    this.id = id;
    this.text = text;
    this.sender = sender;
  }

}
