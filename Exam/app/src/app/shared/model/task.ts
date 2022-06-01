export class Task {

  id: number;
  text: string;
  status: string;
  version: number;


  constructor(id: number, text: string, status: string, version: number) {
    this.id = id;
    this.text = text;
    this.status = status;
    this.version = version;
  }

}
