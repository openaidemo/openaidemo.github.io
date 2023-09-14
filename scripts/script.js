$(function () {
	 
	 
	var $typeSelected = $('#Type');
	var $gradeSelected = $('#Grade');
	var $topicDiv = $('#TopicDiv');
	var $passageDiv = $('#PassageDiv');
	var $results = $("#results");
	var $progressContainer = $(".progress-container");
	var $wc_min = $('#wc_min');
	var $wc_max = $('#wc_max');
	var $wc_min_number = $('#wc_min_number');
	var $wc_max_number = $('#wc_max_number');
	var $fkra_min = $('#fkra_min');
	var $fkra_max = $('#fkra_max');
	var $fkra_min_number = $('#fkra_min_number');
	var $fkra_max_number = $('#fkra_max_number');
	
	$results.hide();
	
	$progressContainer.hide();
	
	$typeSelected.change(function(){
		
		if($typeSelected.val() == "Topic"){
			$topicDiv.show();
			$passageDiv.hide();
		}
		else{
			$topicDiv.hide();
			$passageDiv.show();
		}
	 });
	
	
	$fkra_min.on("input", function(){
		$fkra_min_number.html($fkra_min.val());
		
	});
	
	
	$fkra_max.on("input", function(){
		$fkra_max_number.html($fkra_max.val());
		
	});
	
	$wc_max.on("input", function(){
		$wc_max_number.html($wc_max.val());
		
	});
	
	$wc_min.on("input", function(){
		$wc_min_number.html($wc_min.val());
		
	});
	
	$gradeSelected.change(function(){
		
		switch($gradeSelected.val()){
			case "2":
				break;
			case "3":
				break;
			case "4":
				break;
			case "6":
				$fkra_min.prop({
					'min': 5.5,
					'max': 6,
					'value': 5.5
				});
				$fkra_max.prop({
					'min': 6.1,
					'max': 6.9,
					'value': 6.9
				});
				
				$fkra_min_number.html(5.5);
				$fkra_max_number.html(6.9);
				break;
			case "7":
				$fkra_min.prop({
					'min': 6.5,
					'max': 7,
					'value': 6.5
				});
				$fkra_max.prop({
					'min': 7.1,
					'max': 7.9,
					'value': 7.9
				});
				
				$fkra_min_number.html(6.5);
				$fkra_max_number.html(7.9);
				break;
			case "8":
				$fkra_min.prop({
					'min': 7.5,
					'max': 8,
					'value': 7.5
				});
				$fkra_max.prop({
					'min': 8.1,
					'max': 8.9,
					'value': 8.9
				});
				$fkra_min_number.html(7.5);
				$fkra_max_number.html(8.9);
				break;
			case "9":
				$fkra_min.prop({
					'min': 8.5,
					'max': 9,
					'value': 8.5
				});
				$fkra_max.prop({
					'min': 9.1,
					'max': 9.9,
					'value': 9.9
				});
				$fkra_min_number.html(8.5);
				$fkra_max_number.html(9.9);
				break;
			case "10":
				$fkra_min.prop({
					'min': 9.5,
					'max': 10,
					'value': 9.5
				});
				$fkra_max.prop({
					'min': 10.1,
					'max': 10.9,
					'value': 10.9
				});
				$fkra_min_number.html(9.5);
				$fkra_max_number.html(10.9);
				break;
			case "11":
				$fkra_min.prop({
					'min': 10.5,
					'max': 11,
					'value': 10.5
				});
				$fkra_max.prop({
					'min': 11.1,
					'max': 11.9,
					'value': 11.9
				});
				$fkra_min_number.html(10.5);
				$fkra_max_number.html(11.9);
				break;
			case "12":
				$fkra_min.prop({
					'min': 11.5,
					'max': 12,
					'value': 11.5
				});
				$fkra_max.prop({
					'min': 12.1,
					'max': 12.9,
					'value': 12.9
				});
				$fkra_min_number.html(11.5);
				$fkra_max_number.html(12.9);
				break;
			default:
			break;
		}
	});
	// $( "#slider-range" ).slider({
      // range: true,
      // min: 0,
      // max: 10,
      // values: [ 1, 8 ],
      // slide: function( event, ui ) {
        // $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
       // min =  ui.values[ 0 ];
       // max = ui.values[ 1 ];
       
       // console.log(min)
      // console.log(max)
      // }
    // });
 });

// global variables
var api_calls = 0;

var fkra_data = {};

var loading = false;

var global_keywords = [];

var fkra_min,fkra_max,wc_min, wc_max;


// update passage/results table
function updatePage(grade, passage){


		// set passage data
		$("#passages_grade").html(grade + "th");
		$("#summary_grade").html(grade + "th");
		$("#passage1").html(passage);
		$("#fka_score").html(fkra_data.score);
		$("#sentences").html(fkra_data.sentences);
		$("#words").html(fkra_data.words);
		$("#syllables").html(fkra_data.syllables);
		$("#api_calls").html(api_calls);
		
}

// clear values
function reset()
{
	global_keywords = [];
	api_calls = 0;
	
	$(".progress-bar").animate({
		width: "0%"
	}, 100);
	
	$("#results").hide();
	$(".progress-container").show();
	
			
	// set grade data
	
	$("#passage1").html("");
	$("#fka_score").html("");
	$("#sentences").html("");
	$("#words").html("");
	$("#syllables").html("");
	$("#api_calls").html("");
	
	
	
	$("#LoadingLabel").html("");
		
	
}

// begin process
async function begin()
{
	// ensure that once they clicked once it doesn't try to rerun the process unless completed.
	if(loading){
		return;
	}
	reset();
	
	loading = true;
	
	fkra_min = $('#fkra_min').val();
	fkra_max = $('#fkra_max').val();
	wc_min = $('#wc_min').val();
	wc_max = $('#wc_max').val();
	var type = $("#Type").val();
	var topic = $("#topic").val();
	var passage = $("#passage").val();
	var grade = $("#Grade").val();
	var passage_set1;
	var passage_set2;
	var keywords;
	
	if(type == "Topic"){

		$("#LoadingLabel").html("Generating " + grade + "th Grade Passages...");

		$(".progress-bar").animate({
			width: "50%"
		}, 500);
		
		// make call to get 1 grade level passages
		
		passage_set1 = await generate_passages(topic, grade);

		updatePage(grade, passage_set1);		
					
		//global_keywords.push(topic);
			
		$(".progress-bar").animate({
			width: "100%"
		}, 500)
		.promise().done(function () {
			$("#LoadingLabel").html(grade + "th Grade Passage Generation Complete!");
			$(".progress-container").toggle();
			$("#results").toggle();			
			loading = false;
		});

		//$("#LoadingLabel").html("Generating 8th Grade Passages...");
		
		// make call to get 8th grade level passages
		
		//passage_set2 = await generate_passages(topic,8, global_keywords.join(","));
		
		//updatePage(8, passage_set2);

		//$("#LoadingLabel").html("8th Grade Passage Generation Complete!");
		
		//$(".progress-bar").animate({
		//	width: "100%"
		//}, 500)
		//.promise().done(function () {
			
		//	$(".progress-container").toggle();			
		//	loading = false;
		//})
		
		
	}
	else{	
	
		// grab key words from provided passage
		
		/*$("#LoadingLabel").html("Extracting keywords from provided passage(s)...");
		
		keywords = extract(passage,{
				language:"english",
				remove_digits: true,
				return_changed_case:true,
				remove_duplicates: false
			});

		$("#LoadingLabel").html("Keyword Extraction Complete!");
		
		$(".progress-bar").animate({
			width: "10%"
		}, 100);

		topic = keywords.join(",")

		$("#LoadingLabel").html("Generating 12th Grade Passages...");

		$(".progress-bar").animate({
			width: "30%"
		}, 100);
		
		// make call to get 12th grade level passages
		
		passage_set1 = await generate_passages(topic, 12);

		updatePage(12, passage_set1);
		
		$("#LoadingLabel").html("12th Grade Passage Generation Complete!");
		$("#results").toggle();
		
			
		global_keywords.push(topic);
		
		$(".progress-bar").animate({
			width: "60%"
		}, 100);

		$("#LoadingLabel").html("Generating 8th Grade Passages...");
		
		// make call to get 8th grade level passages
		
		passage_set2 = await generate_passages(topic, 8);
		
		updatePage(8, passage_set2);

		$("#LoadingLabel").html("8th Grade Passage Generation Complete!");
		
		$(".progress-bar").animate({
			width: "100%"
		}, 100)
		.promise().done(function () {
			
			$(".progress-container").toggle();			
			loading = false;
		})
		
		*/
		
	}
	
	
}

async function generate_passages(topic, grade) {
	var selected = $('#Type').val();
	
	var prompt;
	var response;
	var myJson;
	var text;
	var number_words;
	
	
	
	switch(grade){
		
		case "2":
			break;
		case "3":
			break;
		case "4":
			break;
		case "6":
			response = await fetch('https://demo-adobe-de2576d8602d.herokuapp.com/6grade?topic=' + topic, {
				method: 'GET',				
				headers: {
					'Content-Type': 'application/json',
					'Accept':'*/*',
					'Access-Control-Allow-Origin':'*'
				}
			});
						
			api_calls = api_calls + 1;
			
			myJson = await response.json(); //extract JSON from the http response
			text = myJson.response;
			break;
		case "7":
			response = await fetch('https://demo-adobe-de2576d8602d.herokuapp.com/7grade?topic=' + topic, {
				method: 'GET',				
				headers: {
					'Content-Type': 'application/json',
					'Accept':'*/*',
					'Access-Control-Allow-Origin':'*'
				}
			});
						
			api_calls = api_calls + 1;
			
			myJson = await response.json(); //extract JSON from the http response
			text = myJson.response;
			break;
		case "8":
			response = await fetch('https://demo-adobe-de2576d8602d.herokuapp.com/8grade?topic=' + topic, {
				method: 'GET',				
				headers: {
					'Content-Type': 'application/json',
					'Accept':'*/*',
					'Access-Control-Allow-Origin':'*'
				}
			});
						
			api_calls = api_calls + 1;
			
			myJson = await response.json(); //extract JSON from the http response
			text = myJson.response;
			
			
			break;
		case "9":
			response = await fetch('https://demo-adobe-de2576d8602d.herokuapp.com/9grade?topic=' + topic, {
				method: 'GET',				
				headers: {
					'Content-Type': 'application/json',
					'Accept':'*/*',
					'Access-Control-Allow-Origin':'*'
				}
			});
						
			api_calls = api_calls + 1;
			
			myJson = await response.json(); //extract JSON from the http response
			text = myJson.response;
			break;
		case "10":
			response = await fetch('https://demo-adobe-de2576d8602d.herokuapp.com/10grade?topic=' + topic, {
				method: 'GET',				
				headers: {
					'Content-Type': 'application/json',
					'Accept':'*/*',
					'Access-Control-Allow-Origin':'*'
				}
			});
						
			api_calls = api_calls + 1;
			
			myJson = await response.json(); //extract JSON from the http response
			text = myJson.response;
			break;
		case "11":
			response = await fetch('https://demo-adobe-de2576d8602d.herokuapp.com/11grade?topic=' + topic, {
				method: 'GET',				
				headers: {
					'Content-Type': 'application/json',
					'Accept':'*/*',
					'Access-Control-Allow-Origin':'*'
				}
			});
						
			api_calls = api_calls + 1;
			
			myJson = await response.json(); //extract JSON from the http response
			text = myJson.response;
			break;
		case "12":
			response = await fetch('https://demo-adobe-de2576d8602d.herokuapp.com/?topic='+topic, {
				method: 'GET',				
				headers: {
					'Content-Type': 'application/json',
					'Accept':'*/*',
					'Access-Control-Allow-Origin':'*'
					}
			});
			
			api_calls = api_calls + 1;
		
			myJson = await response.json(); //extract JSON from the http response
			text = myJson.response;
			
			
			break;
		default:
			break;			
		
	}
	
	if(myJson.fkra_score > parseInt(fkra_min) && myJson.fkra_score < parseInt(fkra_max) && myJson.number_words > parseInt(wc_min) && myJson.number_words < parseInt(wc_max)){
		fkra_data = {sentences:myJson.number_sentences, words: myJson.number_words, syllables:myJson.number_syllables, score: myJson.fkra_score};
		return text;
	}
	else{
		return await generate_passages(topic, grade);
	}
	
			
}


/*function word_count(word) {
	word = word.toLowerCase();

	if (word.length <= 2) { return 1; }                             //return 1 if word.length <= 2
	word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');   //word.sub!(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
	word = word.replace(/^y/, '');

	//word.sub!(/^y/, '')
	return word.match(/[aeiouy]{1,2}/g) != null ? word.match(/[aeiouy]{1,2}/g).length : 1;
}


function FKRA_calculator(passage, grade) {

	// number of words
	var words = passage.split(' ').filter(function (el) {
		return el != "";
	});
	
	var number_words = words.length
	
	// number of sentences
	var sentences = passage.match(/[\w|\)][.?!](\s|$)/g);

	if(sentences != null){
		sentences = sentences.filter(function(value, index, arr){ 
			return value.trim().length > 0;
		    });
	}
	var number_sentences = sentences != null ? sentences.length : 0;
	
	// number of syllables
	var number_syllables = 0
	
	for (var i = 0; i < words.length; i++) {
		number_syllables = number_syllables + word_count(words[i])
	}
	
	// ASL= number of words/number of sentences
	var asl = number_words / number_sentences
	
	// ASW= number of syllables/number of words
	var asw = number_syllables / number_words

	// FKRA Formula (FKRA = (0.39 x ASL) + (11.8 x ASW) - 15.59)

	var fkra = (0.39 * asl) + (11.8 * asw) - 15.59
	
	
	// keep data if it is within acceptable bounds
	if(grade == 12)
	{
		if((Math.round(fkra * 10) / 10) < 13 && (Math.round(fkra * 10) / 10) > 11.5  && number_words > 260 && number_words < 340 ){
			fkra_data_12 = {sentences:number_sentences, words: number_words, syllables:number_syllables, score: fkra};
		}
	}
	else{
		if((Math.round(fkra * 10) / 10) < 9 && (Math.round(fkra * 10) / 10) > 7.5  && number_words > 260 && number_words < 340 ){
			fkra_data_8 = {sentences:number_sentences, words: number_words, syllables:number_syllables, score: fkra};
		}
	}
	
	return Math.round(fkra * 10) / 10
}*/


// function to extract keywords  https://github.com/michaeldelorenzo/keyword-extractor TODO: utilize node-modules
function extract(
  str,
  options = {
	remove_digits: true,
	return_changed_case: true,
  }
) {
  if (!str) {
	return [];
  }

  const return_changed_case = options.return_changed_case;
  const return_chained_words = options.return_chained_words;
  const remove_digits = options.remove_digits;
  const _language = options.language || "english";
  const _remove_duplicates = options.remove_duplicates || false;
  const return_max_ngrams = options.return_max_ngrams;

  if (supported_languages.indexOf(_language) < 0) {
	throw new Error(
	  "Language must be one of [" + supported_languages.join(",") + "]"
	);
  }

  //  strip any HTML and trim whitespace
  const text = str.replace(/(<([^>]+)>)/gi, "").trim();
  if (!text) {
	return [];
  } else {
	const words = text.split(/\s/);
	const unchanged_words = [];
	const low_words = [];
	//  change the case of all the words
	for (let x = 0; x < words.length; x++) {
	  let w = words[x].match(/https?:\/\/.*[\r\n]*/g)
		? words[x]
		: words[x].replace(/\.|,|;|!|\?|\(|\)|:|"|^'|'$|“|”|‘|’/g, "");
	  //  remove periods, question marks, exclamation points, commas, and semi-colons
	  //  if this is a short result, make sure it's not a single character or something 'odd'
	  if (w.length === 1) {
		w = w.replace(/_|@|&|#/g, "");
	  }
	  //  if it's a number, remove it
	  const digits_match = w.match(/\d/g);
	  if (remove_digits && digits_match && digits_match.length === w.length) {
		w = "";
	  }
	  if (w.length > 0) {
		low_words.push(w.toLowerCase());
		unchanged_words.push(w);
	  }
	}
	let results = [];
	const _stopwords = stopwords;
	let _last_result_word_index = 0;
	let _start_result_word_index = 0;
	let _unbroken_word_chain = false;
	for (let y = 0; y < low_words.length; y++) {
	  if (_stopwords.indexOf(low_words[y]) < 0) {
		if (_last_result_word_index !== y - 1) {
		  _start_result_word_index = y;
		  _unbroken_word_chain = false;
		} else {
		  _unbroken_word_chain = true;
		}
		const result_word =
		  return_changed_case &&
			!unchanged_words[y].match(/https?:\/\/.*[\r\n]*/g)
			? low_words[y]
			: unchanged_words[y];

		if (
		  return_max_ngrams &&
		  _unbroken_word_chain &&
		  !return_chained_words &&
		  return_max_ngrams > y - _start_result_word_index &&
		  _last_result_word_index === y - 1
		) {
		  const change_pos = results.length - 1 < 0 ? 0 : results.length - 1;
		  results[change_pos] = results[change_pos]
			? results[change_pos] + " " + result_word
			: result_word;
		} else if (return_chained_words && _last_result_word_index === y - 1) {
		  const change_pos = results.length - 1 < 0 ? 0 : results.length - 1;
		  results[change_pos] = results[change_pos]
			? results[change_pos] + " " + result_word
			: result_word;
		} else {
		  results.push(result_word);
		}

		_last_result_word_index = y;
	  } else {
		_unbroken_word_chain = false;
	  }
	}

	if (_remove_duplicates) {
	  results = results.filter((v, i, a) => a.indexOf(v) === i);;
	}

	return results;
  }
}

var stopwords = [
		"a",
		"a's",
		"able",
		"about",
		"above",
		"according",
		"accordingly",
		"across",
		"actually",
		"after",
		"afterwards",
		"again",
		"against",
		"ain't",
		"all",
		"allow",
		"allows",
		"almost",
		"alone",
		"along",
		"already",
		"also",
		"although",
		"always",
		"am",
		"among",
		"amongst",
		"an",
		"and",
		"another",
		"any",
		"anybody",
		"anyhow",
		"anyone",
		"anything",
		"anyway",
		"anyways",
		"anywhere",
		"apart",
		"appear",
		"appreciate",
		"appropriate",
		"are",
		"aren't",
		"around",
		"as",
		"aside",
		"ask",
		"asking",
		"associated",
		"at",
		"available",
		"away",
		"awfully",
		"b",
		"be",
		"became",
		"because",
		"become",
		"becomes",
		"becoming",
		"been",
		"before",
		"beforehand",
		"behind",
		"being",
		"believe",
		"below",
		"beside",
		"besides",
		"best",
		"better",
		"between",
		"beyond",
		"both",
		"brief",
		"but",
		"by",
		"c",
		"c'mon",
		"c's",
		"came",
		"can",
		"can't",
		"cannot",
		"cant",
		"cause",
		"causes",
		"certain",
		"certainly",
		"changes",
		"clearly",
		"co",
		"com",
		"come",
		"comes",
		"concerning",
		"consequently",
		"consider",
		"considering",
		"contain",
		"containing",
		"contains",
		"corresponding",
		"could",
		"couldn't",
		"course",
		"currently",
		"d",
		"definitely",
		"described",
		"despite",
		"did",
		"didn't",
		"different",
		"do",
		"does",
		"doesn't",
		"doing",
		"don't",
		"done",
		"down",
		"downwards",
		"during",
		"e",
		"each",
		"edu",
		"eg",
		"eight",
		"either",
		"else",
		"elsewhere",
		"enough",
		"entirely",
		"especially",
		"et",
		"etc",
		"even",
		"ever",
		"every",
		"everybody",
		"everyone",
		"everything",
		"everywhere",
		"ex",
		"exactly",
		"example",
		"except",
		"f",
		"far",
		"few",
		"fifth",
		"first",
		"five",
		"followed",
		"following",
		"follows",
		"for",
		"former",
		"formerly",
		"forth",
		"four",
		"from",
		"further",
		"furthermore",
		"g",
		"get",
		"gets",
		"getting",
		"given",
		"gives",
		"go",
		"goes",
		"going",
		"gone",
		"got",
		"gotten",
		"greetings",
		"h",
		"had",
		"hadn't",
		"happens",
		"hardly",
		"has",
		"hasn't",
		"have",
		"haven't",
		"having",
		"he",
		"he's",
		"hello",
		"help",
		"hence",
		"her",
		"here",
		"here's",
		"hereafter",
		"hereby",
		"herein",
		"hereupon",
		"hers",
		"herself",
		"hi",
		"him",
		"himself",
		"his",
		"hither",
		"hopefully",
		"how",
		"howbeit",
		"however",
		"i",
		"i'd",
		"i'll",
		"i'm",
		"i've",
		"ie",
		"if",
		"ignored",
		"immediate",
		"in",
		"inasmuch",
		"inc",
		"indeed",
		"indicate",
		"indicated",
		"indicates",
		"inner",
		"insofar",
		"instead",
		"into",
		"inward",
		"is",
		"isn't",
		"it",
		"it'd",
		"it'll",
		"it's",
		"its",
		"itself",
		"j",
		"just",
		"k",
		"keep",
		"keeps",
		"kept",
		"know",
		"knows",
		"known",
		"l",
		"last",
		"lately",
		"later",
		"latter",
		"latterly",
		"least",
		"less",
		"lest",
		"let",
		"let's",
		"like",
		"liked",
		"likely",
		"little",
		"look",
		"looking",
		"looks",
		"ltd",
		"m",
		"mainly",
		"many",
		"may",
		"maybe",
		"me",
		"mean",
		"meanwhile",
		"merely",
		"might",
		"more",
		"moreover",
		"most",
		"mostly",
		"much",
		"must",
		"my",
		"myself",
		"n",
		"name",
		"namely",
		"nd",
		"near",
		"nearly",
		"necessary",
		"need",
		"needs",
		"neither",
		"never",
		"nevertheless",
		"new",
		"next",
		"nine",
		"no",
		"nobody",
		"non",
		"none",
		"noone",
		"nor",
		"normally",
		"not",
		"nothing",
		"novel",
		"now",
		"nowhere",
		"o",
		"obviously",
		"of",
		"off",
		"often",
		"oh",
		"ok",
		"okay",
		"old",
		"on",
		"once",
		"one",
		"ones",
		"only",
		"onto",
		"or",
		"other",
		"others",
		"otherwise",
		"ought",
		"our",
		"ours",
		"ourselves",
		"out",
		"outside",
		"over",
		"overall",
		"own",
		"p",
		"particular",
		"particularly",
		"per",
		"perhaps",
		"placed",
		"please",
		"plus",
		"possible",
		"presumably",
		"probably",
		"provides",
		"q",
		"que",
		"quite",
		"qv",
		"r",
		"rather",
		"rd",
		"re",
		"really",
		"reasonably",
		"regarding",
		"regardless",
		"regards",
		"relatively",
		"respectively",
		"right",
		"s",
		"said",
		"same",
		"saw",
		"say",
		"saying",
		"says",
		"second",
		"secondly",
		"see",
		"seeing",
		"seem",
		"seemed",
		"seeming",
		"seems",
		"seen",
		"self",
		"selves",
		"sensible",
		"sent",
		"serious",
		"seriously",
		"seven",
		"several",
		"shall",
		"she",
		"should",
		"shouldn't",
		"since",
		"six",
		"so",
		"some",
		"somebody",
		"somehow",
		"someone",
		"something",
		"sometime",
		"sometimes",
		"somewhat",
		"somewhere",
		"soon",
		"sorry",
		"specified",
		"specify",
		"specifying",
		"still",
		"sub",
		"such",
		"sup",
		"sure",
		"t",
		"t's",
		"take",
		"taken",
		"tell",
		"tends",
		"th",
		"than",
		"thank",
		"thanks",
		"thanx",
		"that",
		"that's",
		"thats",
		"the",
		"their",
		"theirs",
		"them",
		"themselves",
		"then",
		"thence",
		"there",
		"there's",
		"thereafter",
		"thereby",
		"therefore",
		"therein",
		"theres",
		"thereupon",
		"these",
		"they",
		"they'd",
		"they'll",
		"they're",
		"they've",
		"think",
		"third",
		"this",
		"thorough",
		"thoroughly",
		"those",
		"though",
		"three",
		"through",
		"throughout",
		"thru",
		"thus",
		"to",
		"together",
		"too",
		"took",
		"toward",
		"towards",
		"tried",
		"tries",
		"truly",
		"try",
		"trying",
		"twice",
		"two",
		"u",
		"un",
		"under",
		"unfortunately",
		"unless",
		"unlikely",
		"until",
		"unto",
		"up",
		"upon",
		"us",
		"use",
		"used",
		"useful",
		"uses",
		"using",
		"usually",
		"uucp",
		"v",
		"value",
		"various",
		"very",
		"via",
		"viz",
		"vs",
		"w",
		"want",
		"wants",
		"was",
		"wasn't",
		"way",
		"we",
		"we'd",
		"we'll",
		"we're",
		"we've",
		"welcome",
		"well",
		"went",
		"were",
		"weren't",
		"what",
		"what's",
		"whatever",
		"when",
		"whence",
		"whenever",
		"where",
		"where's",
		"whereafter",
		"whereas",
		"whereby",
		"wherein",
		"whereupon",
		"wherever",
		"whether",
		"which",
		"while",
		"whither",
		"who",
		"who's",
		"whoever",
		"whole",
		"whom",
		"whose",
		"why",
		"will",
		"willing",
		"wish",
		"with",
		"within",
		"without",
		"won't",
		"wonder",
		"would",
		"would",
		"wouldn't",
		"x",
		"y",
		"yes",
		"yet",
		"you",
		"you'd",
		"you'll",
		"you're",
		"you've",
		"your",
		"yours",
		"yourself",
		"yourselves",
		"z",
		"zero"
	]
	
	const supported_languages = [
	  "danish",
	  "dutch",
	  "english",
	  "french",
	  "galician",
	  "german",
	  "italian",
	  "polish",
	  "portuguese",
	  "romanian",
	  "russian",
	  "spanish",
	  "swedish",
	  "persian",
	  "arabic",
	  "czech",
	  "turkish",
	  "vietnam",
	  "korean"
	];
