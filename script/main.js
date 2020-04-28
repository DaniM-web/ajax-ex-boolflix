$( document ).ready(function() {

  // Creare un layout base con una searchbar (una input e un button) in cui possiamo scrivere completamente o parzialmente il nome di un film. Possiamo, cliccando il  bottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente.
  // Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni film trovato:
  // Titolo
  // Titolo Originale
  // Lingua
  // Voto

  var source = $("#entry-template").html();
  var template = Handlebars.compile(source);
  var apikey = "e4c13d4e03ecaf9b2eff417162a7475e";

//Ricerca con click
$('button').click(
  function() {
    $('.lista').empty()
    //Valore dell'input
    var userInput = $('.search-div input').val();
    // AJAX per richiesta FILM
    ajaxCall(0,apikey,userInput,"https://api.themoviedb.org/3/search/movie");
    // AJAX per richiesta serie TV
    ajaxCall(1,apikey,userInput,"https://api.themoviedb.org/3/search/tv");
  });

// Ricerca con tasto invio
$('.search-div input').keyup(
  function (e) {
    if(e.which == 13) {
      $('.lista').empty()
      //Valore dell'input
      var userInput = $('.search-div input').val();
      // AJAX per richiesta FILM
      ajaxCall(0,apikey,userInput,"https://api.themoviedb.org/3/search/movie");
      // AJAX per richiesta serie TV
      ajaxCall(1,apikey,userInput,"https://api.themoviedb.org/3/search/tv");
    }
  }
);

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
    var thisA = $(".attore");

    var context = {
      movieid : elemento.id,
      poster:posterGenerator(elemento.poster_path),
      title: title,
      original: originalTitle,
      language: flagGenerator(elemento.original_language),
      rate: starsGenerator(elemento.vote_average),
      tipo: tipologia
    };

    var html = template(context);
    console.log("ogni singola scheda è " , elemento);
      $('.lista').append(html)
  };
};


function starsGenerator(rating) {
  var votoAssegnato = Math.ceil(rating / 2);
  var stelle = "";
  for (var i = 0; i < 5; i++) {
    if (i < votoAssegnato) {
      stelle += '<i class="fas fa-star"></i>';
    }else {
      stelle += '<i class="far fa-star"></i>';
    }
  }
  return stelle;
};

function flagGenerator(langReturn) {
  var flags = ["it","en","de","es","pt"];
  var flagToShow;

  if (flags.includes(langReturn)) {
    flagToShow = "<img src='img/" + langReturn + ".png' alt='immagine'>";
    // '<img src="img/' + codiceLang + '.svg" alt="immagine" class="flags" >'
    return flagToShow
    }
    return langReturn;
}

function posterGenerator(posterCode) {
  var posterFinal = "<img src='https://image.tmdb.org/t/p/w185";
  if (posterCode != null) {
    posterFinal +=  posterCode + "'>"
  }else {
    posterFinal = "<img src='img/notimg.jpg' class='notimg'>"
  }
  return posterFinal;
}


function ajaxCall(type,apikey,queryString,url) {

  $.ajax({
    url: url,
    method: "GET",
    data: {
      api_key: apikey,
      query: queryString
    },
    success: function(result,stato) {
      var risultati = result.results;
      addElement(risultati,type)

    },
    error: function(richiesta,stato,errore){
      alert("Chiamata fallita!!!");
    }
  });
}

$(".lista").on("mouseenter", ".movie", function() {
  var movieid = $(this).data("movieid");
  var elemento = $(this);

  var datahover = $(this).data("hovered");

  if ( $(this).data("hovered") != "true") {

    $.ajax({
      url: "https://api.themoviedb.org/3/movie/" + movieid + "/credits",
      method: "GET",
      data: {
        api_key: apikey,
      },
      success: function(data,stato) {

        console.log("dati caricati", data);

        var schedaAttori;
        var attore;
        var datas = data.cast;
        for (var i = 0; i < 5; i++) {
          schedaAttori = datas[i];
          attore = schedaAttori.name;
          console.log("Gli attori del film: ",movieid,attore);
          $(elemento).find(".attore").append(attore + " ,");
        }

      },
      error: function(richiesta,stato,errore){
        console.log("non ce un cast");
      }
    });
    $(this).data("hovered","true");
  }
});


});
