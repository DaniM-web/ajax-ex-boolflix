$( document ).ready(function() {

  // Creare un layout base con una searchbar (una input e un button) in cui possiamo scrivere completamente o parzialmente il nome di un film. Possiamo, cliccando il  bottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente.
  // Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni film trovato:
  // Titolo
  // Titolo Originale
  // Lingua
  // Voto

  var source = $("#entry-template").html();
  var template = Handlebars.compile(source);

$('button').click(
  function() {
    $('.lista').empty()
    var userInput = $('.search-div input').val();
    $.ajax({
      url: "https://api.themoviedb.org/3/search/movie",
      method: "GET",
      data: {
        api_key: "e4c13d4e03ecaf9b2eff417162a7475e",
        query: userInput
      },
      success: function(result,stato) {
        var risultati = result.results
        console.log("Risultati: ", risultati);
        for (var i = 0; i < risultati.length; i++) {
          var scheda = risultati[i];
          var context = {
            title: scheda.title,
            original: scheda.original_title,
            language: scheda.original_language,
            rate: scheda.vote_average
          };
          var html = template(context);
          console.log("ogni singola scheda è " , scheda);
            $('.lista').append(html)
        }
      },
      error: function(richiesta,stato,errore){
        alert("Chiamata fallita!!!");
      }
    });


  }
);








});
