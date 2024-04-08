import { Student } from "./Student";

export class StudentCursada extends Student {


  get condicionElement():HTMLSelectElement{
    return this.row.querySelector(StudentCursada.elementSelectors.condicion) as HTMLSelectElement
  }
  get condicion(): string {
    return this.condicionElement.value;
  }
  set condicion(v:string){
    this.condicionElement.value = v
  }

  get observacionElement():HTMLInputElement{
    return this.row.querySelector(StudentCursada.elementSelectors.observacion) as HTMLInputElement
  }
  get observacion(): string {
    return this.observacionElement.value;
  }
  set observacion(v:string){
    this.observacionElement.value = v
  }

  asDict() {
    return {
      dni: this.dni,
      nombre: this.nombre,
      fecha: this.fecha,
      nota: this.nota,
      resultado: this.resultado,
      condicion: this.condicion,
      observacion: this.observacion
    };
  }
  

  get fillableFields() {
    return [this.nota, this.fecha, this.resultado, this.condicion];
  }

  fillableFieldsElements= [this.notaElement,this.fechaElement,this.resultadoElement,this.condicionElement]
  

}
