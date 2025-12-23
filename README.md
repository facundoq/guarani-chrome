# plugin-guarani

Plugin para mejorar la usabilidad del SIU GUARANI. [Sitio web](https://github.com/facundoq/guarani-chrome/)

 Funcionalidades:

 * Botones extra para aprobar/desaprobar/limpiar al pasar notas de cursada y final.
   * No soporta pasar notas de cursada con promoción (se aceptan pull requests!).
 * Carga automática de notas desde un CSV separado por ";".


## Cómo usar

1. Instalar desde la [tienda de chrome](https://chromewebstore.google.com/detail/guarani-chrome/hnacdilhnoighpejfhikhhhoochfollk?authuser=0)
2. Crear un archivo CSV separado por `;` (punto y coma) que tenga una fila por cada estudiante. Se usa punto y coma porque el campo `nombre` de guarani tiene también el apellido separado por coma. 
  * El archivo debe tener un encabezado en la primer línea con al menos los siguientes campos:
    * DNI;Alumno;Nota;Fecha;Resultado;Condicion
  * No usar acentos en el encabezado. Las mayúsculas no ignoran (case insensitive)
  * Se pueden tener otros campos; estos se ignoran
  * Los valores a poner en cada campo deben matchear el formato de los de guaraní, por ejemplo
    * Nota: `A`, `D`, `U`, `-`
    * Fecha: `12/12/2025`
    * Resultado: `Aprobado`, `Reprobado`, `Ausente`, `-`
    * Condicion: `Regular`, `Insuficiente`, `Abandonó`, etc...
  * El campo DNI se usa como identificador. Si falta no se podrá autocompletar. Si difiera del de guarani (por ejemplo porque en guarani está el CUIT en lugar del DNI, o viceversa), no completará automáticamente.
3. Ir al sitio de carga de notas. Por ejemplo, para una cursada es `https://autogestion.guarani.unlp.edu.ar/cursada/edicion/<ID>`
4. Esperar que cargue la interfaz del autocompletar++ (tarda un poco porque se injecta en la página) 
   * ![alt text](doc/ui.png?raw=true)
5. Hacer click en `Configurar` y pegar el *contenido completo* del archivo csv en el formulario
   * ![alt text](doc/load.png?raw=true)
6. Hacer click en `Autocompletar++`. Se actualizarán las estadísticas con la cantidad de estudiantes con datos/con datos completos
 * ![alt text](doc/result.png?raw=true)
7. Revisar los resultados. Cada estudiante encontrado tendra un color que indica si sus datos fueron cargados (verde), modificados (verde claro), no modificados (amarillo) y no encontrados (rojo)
8. Si todo está bien, presionar guardar para que se persistan los datos.
9. Pasar a la siguiente página y repetir los pasos 6-8 hasta terminar.

### Ejemplo de un archivo CSV:

````
DNI;Alumno;Guarani;Nota;Fecha;Resultado;Condicion
46943996;Aranda, Ignacio Adrian;D;D;12/12/2025;Reprobado;Insuficiente
45812146;Belona, Candela;A;A;12/12/2025;Aprobado;Regular
47091480;Calato, Manuel;D;D;12/12/2025;Reprobado;Insuficiente
;Dedino, Valentino;D;D;12/12/2025;Reprobado;Insuficiente
47397386;Eleto, Milagros Nahir;D;D;12/12/2025;Reprobado;Insuficiente
20445312556;Forosa, Javier;D;D;12/12/2025;Reprobado;Insuficiente
````

Aquí `Dedino` no tiene dni, por lo cual no se completará, y `Forosa` tiene el CUIT, lo cual está bien porque guaraní tiene el CUIT de la persona en el campo DNI.


## How to contribute

`guarani-chrome` requires `node >= v21.7.1` & `npm >= 10.5.0`. 

Initial setup:

````bash
git clone git@github.com:facundoq/guarani-chrome.git
cd guarani-chrome
npm install 

````

Continuous compilation:

````bash
npm run watch
````

Developing extensions with the Chrome install procedure requires reloading the extension after each change. Since this is unpractical, we have static copies of important pages that load the extension via `<script>` tags instead of the standard injection method Chrome uses for extensions. Therefore, to test the extension while developing, just open up a webserver on the root folder and load one of the sample pages in the `sample_pages` folder. 


Example using Python's `http.server`:

````bash
python -m http.server
````

Afterward, you can browse sample pages, such as `http://localhost:8000/sample_pages/cursada.htm`

## Releasing new versions

To generate a new release, compile the project as usual inside the `dist` folder, then just run `build.sh` and collect the resulting zip with the timestamp from the `releases` folder. 
