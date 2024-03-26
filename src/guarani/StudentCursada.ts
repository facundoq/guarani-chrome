import { fromHTML } from "../utils/dom_utils";
import { Student } from "./Student";




export class StudentCursada extends Student {

  static fillableFields = ["fecha","nota","resultado","condicion"]

  get fechaElement():HTMLInputElement{
    return this.row.querySelector(StudentCursada.elementSelectors.fecha) as HTMLInputElement
  }
  get fecha(): string {
    return this.fechaElement.value;
  }
  set fecha(v:string){
    this.fechaElement.value = v
  }

  get notaElement():HTMLSelectElement{
    return this.row.querySelector(StudentCursada.elementSelectors.nota) as HTMLSelectElement
  }
  get nota(): string {
    const v = this.notaElement.value
    // nota uses - as no value
    return (v==="-")?"":v
  }
  set nota(v:string){
    // nota uses - as no value
    v = (v==="")?"-":v
    this.notaElement.value = v
  }

  get resultadoElement():HTMLSelectElement{
    return this.row.querySelector(StudentCursada.elementSelectors.resultado) as HTMLSelectElement
  }
  get resultado(): string {
    return this.resultadoElement.value;
  }
  set resultado(v:string){
    this.resultadoElement.value = v
  }

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
  get emptyFields(){
    return this.fillableFields.filter(f => f === "")
  }
  get isFull() {
    return this.emptyFields.length === 0;
  }
  get isEmpty() {
    return this.emptyFields.length == this.fillableFields.length;
  }

}
