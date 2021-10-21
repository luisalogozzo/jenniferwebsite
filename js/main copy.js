  /* wow  */
	wow = new WOW({
		mobile: false
	});
	wow.init();

$(window).on('load', function() {
 // init simplecart
 simpleCart.currency({
	 code: "EUR",
	 symbol: "&euro;",
	 delimiter: "",
	 decimal: ",",
	 accuracy: 2,
	 after: true
 });

 simpleCart({
	 cartColumns: [
	 {
		 view: function(item, column) {
			 return "<div class='pr-3'>" +
			 "<a href='#' class='simpleCart_remove'><svg class=\"em-width-140\" viewBox=\"0 0 16 16\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M5.5 5.5A.5.5 0 016 6v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm2.5 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm3 .5a.5.5 0 00-1 0v6a.5.5 0 001 0V6z\"/><path fill-rule=\"evenodd\" d=\"M14.5 3a1 1 0 01-1 1H13v9a2 2 0 01-2 2H5a2 2 0 01-2-2V4h-.5a1 1 0 01-1-1V2a1 1 0 011-1H6a1 1 0 011-1h2a1 1 0 011 1h3.5a1 1 0 011 1v1zM4.118 4L4 4.059V13a1 1 0 001 1h6a1 1 0 001-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z\" clip-rule=\"evenodd\"/></svg></a>" +
			 "</div>";
		 },
		 attr: 'rem'
	 },
	 {
		 view: function(item, column) {
			 if (typeof item.get('var') !== "undefined") {
				 return item.get('name') + "<p class='my-1'><span class='font-weight-light'>" + item.get('var') + "</span>";
			 }
			 else {
				 return item.get('name');
			 }
		 },
		 attr: 'name'
	 },
	 {
		 view: 'currency',
		 attr: 'price'
	 },
	 {
		 view: function(item, column) {
			 return "<a href='#' class='simpleCart_decrement'><span class='bi bi-dash '></span></a>";
		 },
		 attr: 'qty'
	 },
	 {
		 view: function(item, column) {
		 return item.get('quantity');
		 },
		 attr: 'quantita'
	 },
	 {
		 view: function(item, column) {
			 return "<a href='#' class='simpleCart_increment'><span class='bi bi-plus'></span></a>";
		 },
		 attr: 'qty'
	 },

	 {
		 view: 'currency',
		 attr: "total"
	 }],
	 cartStyle: 'div'
 });

 simpleCart({
	 checkout: {
		 type: "SendForm",
		 url: "/" + PKlocale + "/shop/checkout/"
	 }
 });

 simpleCart.bind('beforeAdd', function(item) {
	 var shopCMS = item.get('shop');
	 var shopCarrello = 0;
	 var contenuto = 0;
	 simpleCart.each(function(attivi) {
		 if (contenuto == 0) {
			 shopCarrello = attivi.get('shop');
			 contenuto++;
		 }
	 });
	 if (contenuto > 0) {
		 if (shopCMS != shopCarrello) {
			 simpleCart.empty();
		 }
	 }
 });

 simpleCart.bind('ready', function(item) {
	 checkCart();
 });

 simpleCart.bind('afterAdd', function(item) {
	 $('#toast-msg').html("Articolo aggiunto al carrello");
	 $('.toast').toast('show');
 });

 simpleCart.bind('beforeRemove', function(item) {
	 $('#toast-msg').html("Articolo rimosso dal carrello");
	 $('.toast').toast('show');
 });

 simpleCart.bind('update', function(item) {
	 checkCart();
 });

 function checkCart(){
	 var totale = simpleCart.total();
	 // console.log(totale);
	 if (totale > 0) {
		 $('#carrello').show();
		 $('#carrello-vuoto').hide();
	 } else {
		 $('#carrello-vuoto').show();
		 $('#carrello').hide();
	 }
 }

});

$(document).ready(function($) {



 $('.btnPreordine').click(function(item) {
	 var variazione = $('#shop-variazione').find("option:selected").val();
	 console.log(variazione);
	 if (variazione === undefined) {
		 variazione = "";
	 }
	 var opt = $('#msg-preordine').attr("data-opt");
	 if (opt.length > 0) {
		 var nuovaVariazione = "";
		 if (variazione.length > 0) {
			 nuovaVariazione = variazione + " - " + opt;
		 }
		 else {
			 nuovaVariazione = opt;
		 }
		 $('.item_var').html(nuovaVariazione)
	 }
 });

 $(".spinnerCarrello input[type='number']").inputSpinner({
	 buttonsClass: "btn-link",
	 decrementButton: "<span class='bi bi-dash em-size-150'></span>",
	 incrementButton: "<span class='bi bi-plus em-size-150'></span>"
 });

 $(".spinnerCarrello input[type='number']").on("change", function (event) {
	 let numero = Number($(this).val());
	 if (numero < 1) {
		 numero = 1;
	 }
	 let prezzo = $("#shop-prezzo").attr('data-prezzo');
	 let parziale = Number(numero * prezzo);
	 $('#parzialeProdotto').html(formatMoney(parziale));
 })

 // wishlist: aggiungi / rimuovi prodotti alla lista dei desideri
 $(document).on( "click", ".btn-add-wishlist", function() {
	 var pid = $(this).attr('data-id');
	 var rif = $(this).attr("data-rif");
	 // $('.btn-add-wishlist').toggleClass('text-danger');
	 $.ajax({
		 type: "POST",
		 url: "/app-shop/wishlist/",
		 data: "p=" + pid + "&r=" + rif,
		 dataType: "json",
		 error: function() {
			 alert("error!");
		 },
		 success: function(data) {
			 if (data.stato == 0) {
				 $('#WL-' + pid).fadeOut(400);
			 }
			 $('.gestione-wishlist .btn-add-wishlist').toggleClass('text-danger font-weight-bold');
		 }
	 });
 });

 // notifiche prodotti: avvisa quando disponibilie
 $(document).on( "click", ".btn-add-notify", function() {
	 var pid = $(this).attr('data-id');
	 var rif = $(this).attr("data-rif");
	 $.ajax({
		 type: "POST",
		 url: "/app-shop/notify/",
		 data: "p=" + pid + "&r=" + rif,
		 dataType: "json",
		 error: function() {
			 alert("error!");
		 },
		 success: function(data) {
			 $('.gestione-notify .btn-add-notify').toggleClass('text-success font-weight-bold');
		 }
	 });
 });

 // variazione: ricalcola importi
 $(document).on('change', '#shop-variazione', function() {
	 var pid = jQuery('#shop-variazione').find("option:selected").attr("data-uuid");
	 $('#btnConfermaOrdine').prop("disabled", true);
	 $(".spinnerCarrello input[type='number']").val(1)
	 $.ajax({
		 type: "POST",
		 url: "/app-shop/variants/",
		 data: "p=" + pid,
		 dataType: "json",
		 error: function() {
			 alert("error!");
		 },
		 success: function(data) {
			 $('#shop-prezzo').html(formatMoney(Number(data.prezzoVenditaGruppo)));
			 $('#shop-prezzo').attr({"data-prezzo":data.prezzoVenditaGruppo}),
			 $('.prezzoGruppo').html(formatMoney(Number(data.prezzoVenditaGruppo)));
			 $('#parzialeProdotto').html(formatMoney(Number(data.prezzoVenditaGruppo)));
			 if (Number(data.prodottoIvato) == 1) {
				 $('.prezzoVendita').html(formatMoney(Number(data.prezzoVenditaIvato)));
			 }
			 else {
				 $('.prezzoVendita').html(formatMoney(Number(data.prezzoVenditaCalcolato)));
			 }
			 if (Number(data.prodottoScontato) == 1) {
				 $('#prezzoBarrato').removeClass('d-none');
				 $('.prezzoIniziale').html(formatMoney(Number(data.prezzoListinoIvato)));
			 }
			 else {
				 $('#prezzoBarrato').addClass('d-none');
			 }
			 $('.item_uuid').html(data.uuid);
			 $('.item_sku').html(data.sku);
			 $('.item_var').html(data.variazione);
			 $('#btnConfermaOrdine').prop("disabled", false);
		 }
	 });
 });

 // pagamento: ricalcola importi
 $("input[name=shop-pagamento]").change(function() {
	 var pid = $(this).attr("data-id");
	 var rif = $(this).attr("data-rif");
	 $.ajax({
		 type: "POST",
		 url: "/app-shop/payment/",
		 data: "l=" + PKlocale + "&p=" + pid + "&r=" + rif,
		 dataType: "json",
		 error: function() {
			 alert("error!");
		 },
		 success: function(data) {
			 $('#pk_sales_tax').html(formatMoney(Number(data.tasse)));
			 $('#pk_totale').html(formatMoney(Number(data.totale)));
			 $('#pk_totale_fisso').html(formatMoney(Number(data.totale)));
		 }
	 });
 });

 // spedizione: ricalcola importi
 $("#shop-spedizione").change(function() {
	 var pid = jQuery('#shop-spedizione').find("option:selected").attr("data-id");
	 var ctr = jQuery('#shop-spedizione').find("option:selected").attr("data-ctr");
	 var rif = jQuery('#shop-spedizione').find("option:selected").attr("data-rif");
	 var loc = jQuery('#shop-spedizione').find("option:selected").attr("data-loc");
	 var nome = jQuery('#shop-spedizione').find("option:selected").text();
	 $('#btnConfermaOrdine').prop("disabled", true);
	 $('#shop-pagamento-1').prop("disabled", true);
	 $('#shop-pagamento-2').prop("disabled", true);
	 $('#shop-pagamento-3').prop("disabled", true);
	 $('#shop-pagamento-4').prop("disabled", true);
	 $('#shop-pagamento-9').prop("disabled", true);
	 $('#shop-telefono').prop("disabled", false);
	 $('#shop-indirizzo').prop("disabled", false);
	 $('#shop-cap').prop("disabled", false);
	 $('#shop-citta').prop("disabled", false);
	 $('#shop-nazione').prop("disabled", false);
	 var naz = $('#shop-nazione').find("option:selected").attr("data-id");
	 if (naz == "IT") {
		 $("#shop-provincia").prop( "disabled", false );
	 }
	 else {
		 $("#shop-provincia").prop( "disabled", true );
	 }
	 $.ajax({
		 type: "POST",
		 url: "/app-shop/shipping/",
		 data: "p=" + pid + "&c=" + ctr + "&r=" + rif,
		 dataType: "json",
		 error: function() {
			 alert("error!");
		 },
		 success: function(data) {
			 var chk3 = $('#shop-pagamento-3').is(':checked');
			 var chk9 = $('#shop-pagamento-9').is(':checked');
			 $("#shop-pagamento-1").prop("checked", true);
			 var carrello = Number(data.carrello);
			 var shipping = Number(data.shipping);
			 console.log("shipping: " + shipping);
			 var gratis = Number(data.gratuita);
			 var diff = gratis - carrello;
			 $('#toast-msg').html("Hai selezionato " + nome + "");
			 if (shipping == 0) {
				 $('#toast-msg').append("<br><b>Nessun costo aggiuntivo.</b>");
			 }        
			 else if (shipping > 0 && gratis == 0 ) {
				 $('#toast-msg').append("<br><b>Costo del servizio: " + formatMoney(shipping) + "</b>");
			 }
			 else if (shipping > 0 && gratis > 0) {
				 $('#toast-msg').append("<br><b>Costo del servizio: " + formatMoney(shipping) + ". Spendi altri " + formatMoney(Number(diff)) + " per ottenere la consegna gratuita.</b>");
			 }
			 else {
				 $('#toast-msg').append("<br><b>spedizione ricalcolata.</b>");
			 }
			 $('.toast').toast('show');

			 // console.log("zona: " + data.zona);
			 // console.log("locale: " + data.locale);

			 // SERVIZIO IN SEDE
			 if (data.zona == "AZ") {

			 }
			 // SERVIZIO IN SEDE
			 // abilita pagamento in cassa al negozio.
			 else if (data.zona == "ZZ") {
				 $('#shop-pagamento-9').prop("disabled", false);
				 $("#shop-pagamento-9").prop("checked", true);
				 // disabilita elementi form
				 $('#shop-telefono').prop("disabled", true);
				 $('#shop-indirizzo').prop("disabled", true);
				 $('#shop-cap').prop("disabled", true);
				 $('#shop-citta').prop("disabled", true);
				 $('#shop-nazione').prop("disabled", true);
				 $('#shop-provincia').prop("disabled", true);
			 }
			 // RITIRO IN NEGOZIO
			 // abilita pagamento carte e in cassa al negozio. default cassa negozio
			 else if (data.zona == "AA") {
				 $('#shop-pagamento-1').prop("disabled", false);
				 $('#shop-pagamento-9').prop("disabled", false);
				 $("#shop-pagamento-9").prop("checked", true);
			 }
			 // ITALIA NON LOCALE
			 // abilita pagamento carte, bonifico e contrassegno. default carte
			 else if (data.zona == "IT" && data.locale == "0") {
				 $('#shop-pagamento-1').prop("disabled", false);
				 $('#shop-pagamento-2').prop("disabled", false);
				 $('#shop-pagamento-3').prop("disabled", false);
				 $("#shop-pagamento-1").prop("checked", true);
			 }
			 // ITALIA LOCALE
			 // abilita pagamento alla consegna e carte. default alla consegna
			 else if (data.zona == "IT" && data.locale == "1") {
				 $('#shop-pagamento-1').prop("disabled", false);
				 $('#shop-pagamento-4').prop("disabled", false);
				 $("#shop-pagamento-4").prop("checked", true);
			 }
			 // ESTERO
			 // abilita pagamento carte e bonifico. default carte
			 else if (data.zona == "XX") {
				 $('#shop-pagamento-1').prop("disabled", false);
				 $('#shop-pagamento-2').prop("disabled", false);
				 $("#shop-pagamento-1").prop("checked", true);
			 }

			 else {
				 $('#shop-pagamento-1').prop("disabled", true);
				 $('#shop-pagamento-2').prop("disabled", true);
				 $('#shop-pagamento-3').prop("disabled", true);
				 $('#shop-pagamento-4').prop("disabled", true);
				 $('#shop-pagamento-9').prop("disabled", true);
				 $('#shop-consegne').prop("disabled", true);
			 }
			 // ABILITA / DISABILITA FASCE ORARIE
			 if (data.consegne == "1") {
				 $('#shop-consegne').prop("disabled", false);
			 }
			 else {
				 $('#shop-consegne').prop("disabled", true);
			 }
			 $.ajax({
				 type: "POST",
				 url: "/app-shop/payment/",
				 data: "l=" + PKlocale + "&p=1&r=" + rif,
				 dataType: "json",
				 error: function() {
					 alert("error!");
				 },
				 success: function(data) {
					 $('#pk_sales_tax').html(formatMoney(Number(data.tasse)));
					 $('#pk_totale').html(formatMoney(Number(data.totale)));
					 $('#pk_totale_fisso').html(formatMoney(Number(data.totale)));
				 }
			 });
			 $('#pk_shipping').html(formatMoney(Number(data.shipping)));
			 $('#pk_totale').html(formatMoney(Number(data.totale)));
			 $('#pk_totale_fisso').html(formatMoney(Number(data.totale)));
			 $('#openCoupon').prop("disabled", false);
			 $('#btnConfermaOrdine').prop("disabled", false);
			 // $('#dati-coupon').removeClass('d-none');
			 // $('#dati-acquirente').removeClass('d-none');
			 $('#avvisoBtnConfermaOrdine').hide();
		 }
	 });
 });

 // selezione nazione e provincia se IT
 $("#shop-nazione").change(function() {
	 var pid = $(this).find("option:selected").attr("data-id");
	 if (pid == "IT") {
		 $("#shop-provincia").prop( "disabled", false );
	 }
	 else {
		 $("#shop-provincia").prop( "disabled", true );
	 }
 });

 function formatMoney(number) {
	 var conv = number.toLocaleString(
		 'it-IT', { 
			 style: 'currency', 
			 currency: 'EUR' 
		 }
	 );
	 conv = conv.replace(/([.])(\d\d\d\D|\d\d\d$)/g,'$2');
	 return conv
 }

 // valida form
 $("#shop-confirm").validate({
	 focusInvalid: true,
	 errorElement: "div",
	 rules: {
		 'shop-pagamento': {
			 required: true,
			 minlength: 2
		 },
		 "shop-email": {
			 required: true,
			 email: true
		 },
		 "shop-acq-email": {
			 required: true,
			 email: true
		 },
		 "shop-provincia": {
			 required: true,
		 },
		 "shop-dichiarazione": {
			 required: true,
		 }
	 },
	 messages: {
		 "shop-email": {
			 required: "Campo obbligatorio",
			 email: "Indirizzo email non valido"
		 },
		 "shop-acq-email": {
			 required: "Campo obbligatorio",
			 email: "Indirizzo email non valido"
		 }
	 }
 });

 // buoni sconto
 $('#buoniSconto').submit(function() {
	 var shid = $("#codiceSconto").attr('data-ush');
	 var bsid = $("#codiceSconto").attr('data-rif');
	 var bscd = $("#codiceSconto").val();
	 if (!bscd) {
		 return false;
	 }
	 $.ajax({
		 type: "POST",
		 url: "/app-shop/coupon/",
		 data: "s=" + shid + "&r=" + bsid + "&c=" + bscd,
		 dataType: "json",
		 error: function(data) {
			 $('#toast-msg').html("Errore");
			 $('.toast').toast('show');
		 },
		 success: function(data) {
			 if (data.valido == 1) {
				 $('.checkmark').toggle();
				 $('#pk_sconti').html(formatMoney(Number(data.sconto)));
				 $('#pk_totale').html(formatMoney(Number(data.totale)));
				 $('#pk_totale_fisso').html(formatMoney(Number(data.totale)));
				 $("#btnBuonoSconto").prop("disabled", true);
				 $("#codiceSconto").prop("disabled", true);
				 $('.circle-loader').toggleClass('load-complete');
				 $('#toast-msg').html("Buono sconto accettato, applicato uno sconto di " + formatMoney(Number(data.sconto)) + " sui prodotti interessati alla promozione.");
				 $('.toast').toast('show');
				 $(".buono-sconto").removeClass("attivo");
			 }
			 else {
				 $('#toast-msg').html("Il codice inserito non &egrave; valido, verifica di averlo inserito correttamente");
				 $('.toast').toast('show');
			 }
		 }
	 });
	 return false;
 });

 var pushbarShop = new Pushbar({
 });

 // inserisci il codice del buono sconto nell'input al click
 $('.buono-sconto').click(function() {
	 if ($(".buono-sconto").hasClass("attivo")) {
		 pushbarShop.close();
		 $('#toast-msg').html("Buono sconto inserito, ora fai click sul<br><b>PULSANTE UTILIZZA.</b>");
		 $('.toast').toast('show');
		 var bsid = $(this).attr('data-codice');
		 $(".label-material").addClass("active");
		 $("#codiceSconto").val(bsid);
	 }
 });

 // click miniatura prodotto ordini
 $(".simpleCart_shelfItem").on("click", ".miniatura-scheda", function(e) {
	 var pos = Number($(this).attr("data-pos"));
	 // $('.owl-singolo-noautonav').trigger('to.owl.carousel', [pos, 250]);
 });

 // sposta al tab
 $('.novita-trigger').on('click', function(event) {
	 $('.nav-tabs a[href="#nav-novita"]').tab('show');
 });
 $('.brand-trigger').on('click', function(event) {
	 $('.nav-tabs a[href="#nav-brand"]').tab('show');
 });
 $('.reparti-trigger').on('click', function(event) {
	 $('.nav-tabs a[href="#nav-reparti"]').tab('show');
 });

 // stampa ordini
 $('.btn-stampa').click(function() {
	 var pid = $(this).attr('data-id');
	 var htmlPagina = $("#documento-" + pid).html();
	 $("#areaStampa").html(htmlPagina);
 });

 $('#btnAvviaStampa').click(function() {
	 $("#areaStampa").printThis({
		 importCSS: true,
		 loadCSS: ""
	 });
 });

});


// main main main main main main main main main main main main main main main

// animazione CS
$(window).on('load', function() {
 if ('screen' in window && window.screen.width < 576) {
	 $(".mostraProdotto").addClass("mobile");
 }
 setTimeout(function() {
 $('section.apertura').addClass("is-ready is-revealed");
 }, 100);
});

// colore barra menu
// $(window).scroll(function(){
//   $('#mainNav').toggleClass('scrolled', $(this).scrollTop() > $('#nav').height());
// });

$(window).resize(function() {
 if ('screen' in window && window.screen.width < 576) {
	 $(".mostraProdotto").addClass("mobile");
 }
 else {
	 $(".mostraProdotto").removeClass("mobile");
 }
});

$(window).on('scroll', function(event) {
	 var scrollValue = $(window).scrollTop();
	 if ( scrollValue > 180) {
			$('.alert-servizio-top').removeClass('d-none');
	 }else{
		 $('.alert-servizio-top').addClass('d-none');
	 }
});


$(document).ready(function() {

 // pushbar
 var pushbar = new Pushbar({
	 // blur:true,
	 // overlay:true,
 });

 // hamburger menu
 var forEach=function(t,o,r){if("[object Object]"===Object.prototype.toString.call(t))for(var c in t)Object.prototype.hasOwnProperty.call(t,c)&&o.call(r,t[c],c,t);else for(var e=0,l=t.length;l>e;e++)o.call(r,t[e],e,t)};

 var hamburgers = document.querySelectorAll(".hamburger");
 if (hamburgers.length > 0) {
	 forEach(hamburgers, function(hamburger) {
		 hamburger.addEventListener("click", function() {
			 this.classList.toggle("is-active");
		 }, false);
	 });
 }

 // apri/chiudi pushbar pannello-menu al click su menu hamburger
 $('.hamb-trigger').on('click', function(event) {
	 if ($("#pannello-menu").hasClass("opened")) {
		 pushbar.close();
		 // $('.hamburger').removeClass('is-active');
	 }
	 else {
		 pushbar.open("pannello-menu");
	 }
 });

 // chiudi pannello pushbar pannello-menu
 $('#pannello-menu').on('pushbar_closing', function(event) {
	 $('.hamburger').removeClass('is-active');
 });

 // chiudi pannello pushbar pannello-menu
 $('#pannello-ajax-mobile .close').on('click', function(event) {
	 pushbar.close();
 });

 // $("#pannello-menu").swipe({
 //   swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
 //     if (direction == 'left') {
 //       pushbar.close();
 //       $('.hamburger').removeClass('is-active');
 //     }
 //   }
 // });

 // focus ricerca all'apertura pannello
 $('#pannello-ricerche').on('pushbar_opening', function(event) {
	 $("#ricerca-data-global").focus();
	 $('.app-ricerca').addClass('attivo');
	 // $('.hamburger').removeClass('is-active');
 });

 $('#pannello-ricerche').on('pushbar_closing', function(event) {
	 $('.app-ricerca').removeClass('attivo');
 });

 $(document).on( "click", ".mobile a", function(e) {
	 e.preventDefault();
	 var url = $(this).attr("href");
	 if ($("#pannello-ajax-mobile").hasClass("opened")) {
		 // pushbar.close();
	 }
	 if (!$("#pannello-ajax-mobile").hasClass("opened")) {
		 pushbar.open('pannello-ajax-mobile');
	 }
	 url = url.replace("pagine", "mobile");
	 $('#contenuto-pannello-ajax-mobile').hide();
	 $("#contenuto-pannello-ajax-mobile").load(url, function () {
		 $('#contenuto-pannello-ajax-mobile').fadeIn(400, function () {
			 $(".pushbar").scrollTop($("#prod-mobile"));
			 $(".spinnerCarrello input[type='number']").inputSpinner({
				 buttonsClass: "btn-dark",
				 decrementButton: "<span class='fas fa-minus'></span>",
				 incrementButton: "<span class='fas fa-plus'></span>"
			 });
			 // if (!$("#pannello-ajax-mobile").hasClass("opened")) {
			 //   pushbar.open('pannello-ajax-mobile');
			 // }
		 });
	 });
 });

 // notifiche toast
 $('#toast-container').on('shown.bs.toast', function () {
	 $('main').removeClass('navigazione');
	 $('#toast-container').show();
 })
 $('#toast-container').on('hidden.bs.toast', function () {
	 $('main').removeClass('navigazione');
	 $('#toast-container').hide();
 })

 // calendario eventi
 $(".calendario-eventi").ccode_calendar({
	 language: "it",
	 show_days: true,
	 show_previous: 1,
	 show_next: 6,
	 cell_border: false,
	 today: true,
	 ajax: {
		 url: "/data/calendario/data-cal.json",
		 modal: true
	 },
	 nav_icon: {
			prev: '<i class="bi bi-arrow-left"></i>',
			next: '<i class="bi bi-arrow-right"></i>'
		}
 });

 // cookielaw
 $('.btn-cookie').click(function() {
	 $.cookie('privacy', '1', {expires: 3650, path: '/'});
 });

 // scorrimento animato
 $('a.scorrimento').bind('click', function(event) {
		 var $anchor = $(this);
		 $('html, body').stop().animate({
				 scrollTop: ($($anchor.attr('href')).offset().top - 50)
		 }, 400, 'linear');
		 event.preventDefault();
 });


 var e = $("input.input-material, textarea.input-material");
 e.filter(function() {
		 return "" !== $(this).val()
 }).siblings(".label-material").addClass("active"), e.on("focus", function() {
		 $(this).siblings(".label-material").addClass("active")
 }), e.on("blur", function() {
		 $(this).siblings(".label-material").removeClass("active"), "" !== $(this).val() ? $(this).siblings(".label-material").addClass("active") : $(this).siblings(".label-material").removeClass("active")
 });


 // video responsive 
 fluidvids.init({
	 selector: ['iframe', 'object'],
	 players: ['www.youtube.com', 'player.vimeo.com']
 });

 $('.row .btn.espandi').on('click', function(e) {
	 e.preventDefault();
	 var $this = $(this);
	 var $collapse = $this.closest('.collapse-group').find('.collapse');
	 $collapse.collapse('toggle');
 })



 // tiny slider
 if ($("#vetrinaSlider").hasClass("vetrinaSlider")) {
	 var vetrinaSlider = tns({
		 container: '.vetrinaSlider',
		 items: 2,
		 gutter: 50,
		 center: false,
		 mouseDrag: false,
		 controls: false,
		 // controlsContainer: "#vetrina-controls",
		 // controlsPosition: "bottom",
		 nav: true,
		 navPosition: "bottom",
		 responsive: {
			 640: {
				 items: 2
			 },
			 992: {
				 items: 3
			 },
			 1280: {
				 items: 4
			 },
			 1680: {
				 items: 4
			 },
			 1920: {
				 items: 5
			 }
		 }
	 });
 }

 if ($("#pressSlider").hasClass("pressSlider")) {
	 var pressSlider = tns({
		 container: '.pressSlider',
		 items: 2,
		 mouseDrag: false,
		 controlsContainer: "#press-controls",
		 nav: true,
		 navPosition: "bottom",
		 responsive: {
			 640: {
				 gutter: 0,
				 items: 3
			 },
			 992: {
				 items: 4
			 },
			 1280: {
				 items: 6
			 },
			 1921: {
				 items: 7
			 }
		 }
	 });
 }

 // if ($('div.categorieSlider').length) {
 //   var categorieSlider = tns({
 //     container: '.categorieSlider',
 //     items: 1,
 //     nav: false,
 //     controlsContainer: ".categorieSlider-controls",
 //   });
 // }

 if ($("#prodSlider").hasClass("prodSlider")) {
	 var prodSlider = tns({
		 container: '.prodSlider',
		 items: 1,
		 controls: false,
		 nav: true,
		 navPosition: "bottom",
		 responsive: {
			 992: {
				 nav: false,
			 }
		 }
	 });
	 var prodMinSlider = tns({
		 container: '.prodMinSlider',
		 items: 5,
		 axis: "vertical",
		 swipeAngle: false,
		 nav: false,
		 controlsPosition: "top",
		 controlsContainer: "#prodMinSlider-controls"
	 });
	 $('.miniImgSlider').on('click', function(event) {
		 var pos = $(this).attr('data-pos');
		 prodSlider.goTo(pos)
	 });
 }

 // swipebox
 // $('.swipebox').swipebox({
 //   hideBarsDelay : 5000,
 //   loopAtEnd: false
 // });
 $(document).swipebox({ 
	 selector: '.swipebox',
	 hideBarsDelay : 5000,
	 loopAtEnd: false
 });

 $('.swipebox-video').swipebox({
	 autoplayVideos: 1,
	 hideBarsDelay : 0,
	 loopAtEnd: false
 });

 // tooltip
 $('.tip').tooltip();

 //datetimepicker
 $('.dataGenerica').datetimepicker({
	 locale: 'it',
	 viewMode: 'years',
	 format: 'DD/MM/YYYY'
 });


 // valida i form
 $.extend(jQuery.validator.messages, {
		 required: "Campo obbligatorio"
 });

 $("#app-register").validate({
	 focusInvalid: true,
	 errorElement: "div",
	 rules: {
		 "auth-nome": {
			 required: true,
		 },
		 "auth-cognome": {
			 required: true,
		 },
		 "auth-usr": {
			 required: true,
			 email: true,
			 remote: {
				 url: "/app-verifica-email/",
				 type: "post"
			 }
		 },
		 'auth-pwd': {
			 required: true,
			 minlength: 8,
			 maxlength: 15
		 },
		 'auth-pwd-conf': {
			 required: true,
			 minlength: 8,
			 maxlength: 15,
			 equalTo: "#auth-pwd"
		 }
	 },
	 messages: {
		 "auth-nome": {
			 required: "Campo obbligatorio"
		 },
		 "auth-cognome": {
			 required: "Campo obbligatorio"
		 },
		 "auth-usr": {
			 required: "Campo obbligatorio",
			 email: "Indirizzo email non valido",
			 remote: "Indirizzo email già esistente"
		 },
		 "auth-pwd": {
			 required: "Campo obbligatorio",
			 minlength: "La password deve contenere almeno 8 caratteri",
			 maxlength: "La password può contenere un massimo di 15 caratteri"
		 },
		 "auth-pwd-conf": {
			 required: "Campo obbligatorio",
			 minlength: "La password deve contenere almeno 8 caratteri",
			 maxlength: "La password può contenere un massimo di 15 caratteri",
			 equalTo: "Conferma password diversa dalla password inserita"
		 },
	 }
 });

 $("#app-login").validate({
	 focusInvalid: true,
	 errorElement: "div",
	 rules: {
		 "login-usr": {
			 required: true,
			 email: true
		 },
		 'login-pwd': {
			 required: true,
			 minlength: 8,
			 maxlength: 15
		 }
	 },
	 messages: {
		 "login-usr": {
			 required: "Campo obbligatorio",
			 email: "Indirizzo email non valido"
		 },
		 "login-pwd": {
			 required: "Campo obbligatorio",
			 minlength: "La password deve contenere almeno 8 caratteri",
			 maxlength: "La password può contenere un massimo di 15 caratteri"
		 }
	 }
 });

 $("#app-forgot").validate({
	 focusInvalid: true,
	 errorElement: "div",
	 rules: {
		 "login-email": {
			 required: true,
			 email: true
		 }
	 },
	 messages: {
		 "login-email": {
			 required: "Campo obbligatorio",
			 email: "Indirizzo email non valido"
		 }
	 }
 });

 $("#app-reset").validate({
	 focusInvalid: true,
	 errorElement: "div",
	 rules: {
		 "app-token": {
			 required: true,
				 minlength: 48,
				 maxlength: 48,
				 remote: {
					 url: "/app-verifica-token/",
					 type: "post"
				 }
		 },
		 'app-pwd': {
			 required: true,
			 minlength: 8,
			 maxlength: 15
		 },
		 'app-pwd-conf': {
			 required: true,
			 minlength: 8,
			 maxlength: 15,
			 equalTo: "#app-pwd"
		 }
	 },
	 messages: {
		 "app-token": {
			 required: "Campo obbligatorio",
			 minlength: "Il token deve contenere 48 caratteri",
			 maxlength: "Il token deve contenere 48 caratteri",
			 remote: "Token non valido o disabilitato"
		 },
		 "app-pwd": {
			 required: "Campo obbligatorio",
			 minlength: "La password deve contenere almeno 8 caratteri",
			 maxlength: "La password può contenere un massimo di 15 caratteri"
		 },
		 "app-pwd-conf": {
			 required: "Campo obbligatorio",
			 minlength: "La password deve contenere almeno 8 caratteri",
			 maxlength: "La password può contenere un massimo di 15 caratteri",
			 equalTo: "Conferma password diversa dalla password inserita"      
		 },
	 }
 });


 $("#app-contatti").validate({
	 focusInvalid: true,
	 errorElement: "div",
	 // errorLabelContainer: '#errori',
	 // invalidHandler: function(event, validator) {
	 //   var errors = validator.numberOfInvalids();
	 //   if (errors) {
	 //     $('#myModalMessaggioErrore').modal('show');
	 //   }
	 // },
	 rules: {
		 "nome": {
			 required: true,
			 minlength: 2
		 },
		 "form-email": {
			 required: true,
			 email: true,
			 minlength: 5
		 },
		 "telefono": {
			 required: true,
			 minlength: 5
		 },
		 "oggetto": {
			 required: true
		 },
		 "messaggio": {
			 required: true
		 },
		 "privacy": {
			 required: true
		 },
	 },
	 messages: {
		 "form-email": {
			 required: "Inserire il proprio indirizzo email",
			 email: "Inserire un indirizzo email valido",
			 minlength: "L&rsquo;indirizzo email deve contenere almeno 5 caratteri"
		 },

	 }
 });

 $('#app-contatti').submit(function() {
	 if ($('input#form-codicecontrollo').val().length != 0) {
		 return false;
	 } 
 });


 // processa il form tramite eldarion
 $(document).on("eldarion-ajax:begin", function(evt, $el) {
 });

 $(document).on("eldarion-ajax:success", function(evt, $el, data) {
	 $('#toast-msg').html("Operazione completata con successo");
	 $('.toast').toast('show');
	 $('input[type=text]').each(function() {
		 $(this).val('');
	 });
	 $('#form-messaggio').val('');
 });

 // bordi animati
	function blSet() {
			var n = $(window).width(),
					i = $(window).height(),
					e = n - 110,
					t = i - 220,
					o = $(".bordo-superiore"),
					s = $(".bordo-inferiore"),
					r = $(".bordo-sinistra"),
					h = $(".bordo-destra");
			o.css({
					width: e
			}), s.css({
					width: e
			}), r.css({
					height: t
			}), h.css({
					height: t
			})
	}

	function blSetPage() {
			var n = $(window).width(),
					i = $(window).height(),
					e = n - 110,
					t = i - 220,
					o = $(".bordo-superiore"),
					s = $(".bordo-inferiore"),
					r = $(".bordo-sinistra"),
					h = $(".bordo-destra");
			o.css({
					width: e
			}).css({
					WebkitTransition: "none",
					transition: "none"
			}), s.css({
					width: e
			}).css({
					WebkitTransition: "none",
					transition: "none"
			}), r.css({
					height: t
			}).css({
					WebkitTransition: "none",
					transition: "none"
			}), h.css({
					height: t
			}).css({
					WebkitTransition: "none",
					transition: "none"
			})
	}
	$(function() {
			var n = $(".bordo-superiore"),
					i = $(".bordo-inferiore"),
					e = $(".bordo-sinistra"),
					t = $(".bordo-destra");
			$(window).bind("load", function() {
					var o = $(window).width(),
							s = $(window).height(),
							r = o - 110,
							h = s - 220;
					$(".wrap-window").css({
							height: s
					}), n.css({
							width: r
					}), i.css({
							width: r
					}), e.css({
							height: h
					}), t.css({
							height: h
					})
			}), $(window).bind("resize", function() {
					var o = ($(window).width(), $(window).height());
					$(".wrap-window").css({
							height: o
					}), n.css({
							WebkitTransition: "none",
							transition: "none"
					}), i.css({
							WebkitTransition: "none",
							transition: "none"
					}), e.css({
							WebkitTransition: "none",
							transition: "none"
					}), t.css({
							WebkitTransition: "none",
							transition: "none"
					}), blSet()
			})
	});

 Holder.addTheme("light", {
	 background: "#F1F1F1",
	 foreground: "#32332",
	 font: "Sans-Serif",
	 fontweight: "normal"
 });

 Holder.addTheme("dark", {
	 background: "#323232",
	 foreground: "#aaa",
	 font: "Sans-Serif",
	 fontweight: "normal"
 });

 $.typeahead({
	 input: '.consegnaapp-typeahead',
	 minLength: 1,
	 maxItem: 15,
	 maxItemPerGroup: 5,
	 offset: false,
	 order: "asc",
	 hint: true,
	 highlight: false,
	 cache: "true", // false
	 ttl: 3600000,
	 searchOnFocus: false,
	 group: {
		 key: "k",
	 },
	 callback: {
		 onClickAfter: function(node, a, item, event) {
			 window.location.replace(item.u);
		 }
	 },
	 display: ["t"],
	 template: function(query, item) {
		 // console.log(item.i);
		 var risultato = '<div class="text-truncate em-size-90">';
		 if (item.i !== null) {
			 risultato += '<span class="mr-2"><img src="/data/uploads/s/{{i}}.jpg" class="thumb-32"></span>';
		 }
		 risultato += '<span>{{t}}</span>';
		 risultato += '</div>';
		 return risultato;
	 },
	 emptyTemplate: "nessun risultato per {{query}}",
	 correlativeTemplate: true,
	 source: {
		 teams: {
			 url: "/data/typeahead/" + PKsrcstr.toUpperCase() + "-data-th.json?v9"
		 }
	 }
 });
 $('#ricerca-data-global').keyup(function() {
	 var lng = $('#ricerca-data-global').val().length;
	 if (lng > 0) {
		 $('.logo-ricerche img').addClass('attivo');
	 }
	 else {
		 $('.logo-ricerche img').removeClass('attivo');
	 }
 });
 $(document).on('touchstart', function (e) {
	 if (!$(e.target).is('.consegnaapp-typeahead') && $('.consegnaapp-typeahead').is(':focus')) {
		 // console.log("tastiera off");
		 document.activeElement.blur();
	 }
 });

});




// fullscreen slider con bootstrap carousel!
jQuery(document).ready(function($) {
 'use strict';
 initHold();

 $('.carousel.full').carousel({
	 interval: 5000,
	 pause: "false"
 })

 $(".carousel").swipe({
	 swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
		 if (direction == 'left') $(this).carousel('next');
		 if (direction == 'right') $(this).carousel('prev');
	 },
	 allowPageScroll:"vertical"
 });

 function initHold() {
	 $('[data-holdbg]').each(function(index, el) {
		 var bg = $(el).data('holdbg');
		 $(el).css('background-image', 'url(' + bg + ')');
	 });
 }

});

// ISOTOPE
jQuery(document).ready(function($) {
 var $galleriaContainer = $('.isotope-container').imagesLoaded(function() {
	 $galleriaContainer.isotope({
		 itemSelector: '.isotope-item',
		 percentPosition: true,
		 masonry: {
			 columnWidth: '.isotope-item'
		 },
		 layoutMode: 'masonry',
		 transitionDuration: '0.8s'
	 });
 });

 var $teamContainer = $('.team-container');
 $teamContainer.isotope({
	 itemSelector: '.team-item',
	 layoutMode: 'masonry',
	 transitionDuration: '0.8s'
 });

 $(window).resize(function() {
	 $teamContainer.isotope({
		 itemSelector: '.team-item',
		 layoutMode: 'masonry',
		 transitionDuration: '0.8s'
	 });
 });

});



