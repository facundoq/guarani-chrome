import { Student } from "./Student";

export class StudentFinal extends Student {
    

  fillableFieldsElements= [this.notaElement,this.fechaElement,this.resultadoElement]

    get fillableFields() {
        return [this.nota, this.fecha, this.resultado];
      }
}