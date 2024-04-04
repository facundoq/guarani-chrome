import { Student } from "./Student";

export class StudentFinal extends Student {
    

    static fillableFields = ["fecha","nota","resultado"]

    get fillableFields() {
        return [this.nota, this.fecha, this.resultado];
      }
}