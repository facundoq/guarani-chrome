kernel.renderer.registrar_pagelet("cabecera",function(b){var c="#"+b.id;function a(g,d){var f=false;var e=$("<table style='margin-top: 16px'><thead><th>"+b.msg_valor+"</th><th>"+b.msg_descripcion+"</th><th>"+b.msg_resultado+"</th></thead><tbody></tbody></table>");e.addClass("table").addClass("table-condensed");$(g).on("click",function(){if(!f){kernel.ui.show_loading();$.ajax({url:d,success:function(h){$(JSON.parse(h)).each(function(){var i=$(this)[0];var j=$("<tr>");j.append($("<td>"+i.nota+"</td>"));j.append($("<td>"+i.descripcion+"</td>"));j.append($("<td>"+i.resultado+"</td>"));e.find("tbody").append(j)});f=true;kernel.ui.hide_loading();$.facebox(e)}})}else{$.facebox(e)}})}return{onload:function(){a("#ver_escala_regularidad",b.url_escala_regularidad);a("#ver_escala_promocion",b.url_escala_promocion);$(c).find("button#js-colapsar-info-mesa").on("click",function(){var d=$(".js-barra-autocompletar");if(d.is(":visible")){d.slideUp()}var e=$(".js-detalle-materia");if(e.is(":visible")){e.slideUp()}else{e.slideDown()}});$(c).find("button#js-colapsar-autocompletar").on("click",function(){var e=$(".js-detalle-materia");if(e.is(":visible")){e.slideUp()}if($(".js-barra-calcular-notas").is(":visible")){$(".js-barra-calcular-notas").slideUp()}var d=$(".js-barra-autocompletar");if(d.is(":visible")){d.slideUp()}else{d.slideDown()}});$(c).find("button#js-colapsar-barra-calcular-notas").on("click",function(){var e=$(".js-detalle-materia");if(e.is(":visible")){e.slideUp()}if($(".js-barra-autocompletar").is(":visible")){$(".js-barra-autocompletar").slideUp()}var d=$(".js-barra-calcular-notas");if(d.is(":visible")){d.slideUp()}else{d.slideDown()}})}}});