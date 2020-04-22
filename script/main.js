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
        var risultati = result.results;
        addElement(risultati,0)

      },
      error: function(richiesta,stato,errore){
        alert("Chiamata fallita!!!");
      }
    });
    $.ajax({
      url: "https://api.themoviedb.org/3/search/tv",
      method: "GET",
      data: {
        api_key: "e4c13d4e03ecaf9b2eff417162a7475e",
        query: userInput
      },
      success: function(result,stato) {
        var risultati = result.results;
        addElement(risultati,1)
      },
      error: function(richiesta,stato,errore){
        alert("Chiamata fallita!!!");
      }
});

  });

function starsGenerator(rating) {
  var stelle = "";
  for (var i = 0; i < rating; i++) {
    stelle += '<i class="fas fa-star"></i>';
  }

  for (var i = 0; i < 5 - rating; i++) {
  stelle += '<i class="far fa-star"></i>';
  }
  return stelle;
};

function addElement(list,type) {

  for (var i = 0; i < list.length; i++) {
    var elemento = list[i];
    var title;
    var originalTitle;
    var tipologia;
    if (type == 0) {
      title = elemento.title;
      originalTitle = elemento.original_title;
      tipologia = "MOVIE";
    }else{
      title = elemento.name;
      originalTitle = elemento.original_name;
      tipologia = "TV SHOW";
    }

    var flag;
    if (elemento.original_language === "it") {
      flag = "<img src='img/it.png' alt='ita'/>"
    }else if (elemento.original_language === "en") {
      flag = "<img src='img/gb.png' alt='eng'/>"
    }else{
      flag = elemento.original_language;
    };

    var votoAssegnato = Math.ceil(elemento.vote_average / 2);
    var context = {
      poster: elemento.poster_path,
      alt: title,
      title: title,
      original: originalTitle,
      language: flag,
      rate: starsGenerator(votoAssegnato),
      tipo: tipologia
    };

    var html = template(context);
    console.log("ogni singola scheda è " , elemento);
      $('.lista').append(html)
  };
};


});
