(function(b){var d=b("#js-ui-autocomplete-min-length").val();var c={url:"",select:false,valor_default:false,min_length:d,change:false};var a={callback_select:function(f){var e=b(this).before().data("settings");e.select=f;b(this).before().data("settings",e)},init:function(h){if(h){var e={};b.extend(true,e,c,h);this.data("settings",e)}if(e.url==""){return}var f=b(this);var i=f.attr("id");var g=f.attr("name");f.removeAttr("name");f.after('<input id="'+i+'-autocomplete" name="'+g+'" type="hidden">').autocomplete({source:e.url,minLength:e.min_length,change:function(k,l){var j=b(this).before().data("settings");if(l.item==null){if(j.valor_default){b("#"+i+"-autocomplete").val(j.valor_default.id);f.val(j.valor_default.value);if(j.select){j.select(j.valor_default.id,j.valor_default.value,j.valor_default)}}else{b("#"+i+"-autocomplete").val("")}}if(j.change){j.change(l.item)}},select:function(k,l){var j=b(this).before().data("settings");b("#"+i+"-autocomplete").val(l.item.id);if(j.select){j.select(l.item.id,l.item.value,l.item)}b(this).css("background-color","#eeeeee");return true}});b("#"+i).on("focus",function(){b(this).css("background-color","#FFFFFF");b(this).val("");b("#"+i+"-autocomplete").val("")});if(e.valor_default){b("#"+i+"-autocomplete").val(e.valor_default.id);f.val(e.valor_default.value);b(this).css("background-color","#eeeeee")}},change_settings:function(e){var f=this.data("settings");b.extend(f,e);this.data("settings",f)},auto_init:function(f){var e={url:this.data("url"),valor_default:{id:this.val(),value:this.data("texto")},min_length:d};if(f){b.extend(true,e,f)}this.plugin_autocompletar(e)}};b.fn.plugin_autocompletar=function(e){if(a[e]){return a[e].apply(this,Array.prototype.slice.call(arguments,1))}else{if(typeof e==="object"||!e){return a.init.apply(this,arguments)}else{b.on("error","Method "+e+" doesnt exist on jQuery.upload")}}}})(jQuery);