
export class StudentCursada2 {
  static elementSelectors = {
    dni: ".identificacion",
    nombre: ".nombre",
    fecha: ".fecha",
    nota: ".nota_cursada",
    resultado: ".resultado",
    condicion: ".condicion",
    observacion: ".observacion",
  };
  constructor(public row:HTMLElement){

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
  

  fillableFieldsValues() {
    return [this.nota, this.fecha, this.resultado, this.condicion];
  }
  complete() {
    return this.fillableFieldsValues().filter(f => f === "").length === 0;
  }
  nonEmpty() {
    return this.fillableFieldsValues().filter(f => f === "").length < 4;
  }

}

export class StudentCursada {

  static elementSelectors = {
    dni: ".identificacion",
    nombre: ".nombre",
    fecha: ".fecha",
    nota: ".nota_cursada",
    resultado: ".resultado",
    condicion: ".condicion",
    observacion: ".observacion",
  };

  static fromRow(row) {
    const dni_element_value = row.querySelector(
      StudentCursada.elementSelectors["dni"]
    ).innerText;
    const dni = dni_element_value.split(" ")[1];
    const nombre = row.querySelector(
      StudentCursada.elementSelectors["nombre"]
    ).innerText;
    const fecha = row.querySelector(StudentCursada.elementSelectors["fecha"]).value;
    var nota = row.querySelector(StudentCursada.elementSelectors["nota"]).value;
    const resultado = row.querySelector(
      StudentCursada.elementSelectors["resultado"]
    ).value;
    const condicion = row.querySelector(
      StudentCursada.elementSelectors["condicion"]
    ).value;
    const observacion = row.querySelector(
      StudentCursada.elementSelectors["observacion"]
    ).value;
    if (nota === "-") {
      nota = "";
    }
    return new StudentCursada(
      dni,
      nombre,
      fecha,
      nota,
      resultado,
      condicion,
      observacion
    );


  }

  constructor(
    public dni: string,
    public nombre: string,
    public fecha: string,
    public nota: string,
    public resultado: string,
    public condicion: string,
    public observacion: string
  ) { }
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
  fillableFields() {
    return [this.nota, this.fecha, this.resultado, this.condicion];
  }
  complete() {
    return this.fillableFields().filter(f => f === "").length === 0;
  }
  nonEmpty() {

    return this.fillableFields().filter(f => f === "").length < 4;
  }
}
