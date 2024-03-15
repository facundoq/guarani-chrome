# plugin-guarani

Plugin para mejorar la usabilidad del SIU GUARANI. [Sitio web](https://github.com/facundoq/guarani-chrome/)

 Funcionalidades:

 * Botones extra para aprobar/desaprobar/limpiar al pasar notas de cursada.
 * Botón extra de guardar al final de la lista de estudiantes.
 * Carga automática de notas desde un CSV.

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
