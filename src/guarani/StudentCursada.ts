import { fromHTML } from "../utils/dom_utils";

const emojiClass = "result-emoji"



export class StudentCursada {
  static elementSelectors = {
    dni: ".identificacion",
    nombre: ".nombre",
    fecha: ".fecha",
    nota: ".nota_cursada",
    resultado: ".resultado",
    condicion: ".condicion",
    observacion: ".observacion",
    resultEmoji: `.${emojiClass}`
  };
  constructor(public row:HTMLElement){
    this.addResultEmojiElement()
  }
  addResultEmojiElement() {
    if (this.emojiElement){
      // don't create element if it already exists
      return
    }
    let alumnoDiv = this.row.querySelector(".datos-alumno");
    const emojiElement = fromHTML(`<span class="${emojiClass}"> <span>`);
    alumnoDiv.appendChild(emojiElement);
  }
  get emojiElement():HTMLSpanElement{
      return this.row.querySelector(StudentCursada.elementSelectors.resultEmoji) as HTMLSpanElement
  }

  static fillableFields = ["fecha","nota","resultado","condicion"]
  
  get dniElement():HTMLSpanElement{
    return this.row.querySelector(StudentCursada.elementSelectors.dni) as HTMLSpanElement
  }

  get dni():string {return this.dniElement.innerText.split(" ")[1]}

  get nombreElement():HTMLSpanElement{
    return this.row.querySelector(StudentCursada.elementSelectors.nombre) as HTMLSpanElement
  }

  get nombre(): string {
    return this.nombreElement.innerText;
  }

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


 addToStudentTitle(message: string) {
  function appendToTitle(element:HTMLElement,s:string){
    element.title=`${element.title}${s}`
  }
    appendToTitle(this.nombreElement,`\n Autofill: ${message}`)
  appendToTitle(this.dniElement,`\n Autofill: ${message}`)
  appendToTitle(this.emojiElement,`\n Autofill: ${message}`)
}

 setStudentClass( klass) {
  this.row.classList.remove(...this.row.classList);
  this.row.classList.add(klass);
}
 markFilledStudent() {
  this.setStudentClass( "autofilledStudent");
  this.addEmojiStudent("✅");
  this.addToStudentTitle("ha sido completado automaticamente");
}

 markOverwrittenStudent() {
  this.setStudentClass("modifiedStudent");
  this.addEmojiStudent("✏️");
  this.addToStudentTitle( "ha sido editado automáticamente");
}
 markUnmatchedStudent( matches) {
  this.setStudentClass( "unmatchedStudent");
  this.addEmojiStudent( "❌");
  this.addToStudentTitle( "no se pudo encontrar en el csv");
}
addEmojiStudent(emoji) {
  this.emojiElement.innerText = `${this.emojiElement.innerText}${emoji}`
}
 markAlreadyFilledStudent() {
  this.setStudentClass( "alreadyFilledStudent");
  this.addEmojiStudent( "⚠️");
  this.addToStudentTitle("No se modificó porque ya tenía valores cargados");
  
}


}
