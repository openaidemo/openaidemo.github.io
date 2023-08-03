 $(function () {
	 
	 
	var $typeSelected = $('#Type');
	var $topicDiv = $('#TopicDiv');
	var $passageDiv = $('#PassageDiv');
	var $results = $("#results");
	var $progressContainer = $(".progress-container");
	
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
	
 });

// global variables
var api_calls_8 = 0;
var api_calls_12 = 0;

var fkra_data_8 = {};
var fkra_data_12 = {};
var loading = false;

var key1 = "sk-u3BBPzUvuKbWLVh5KofVT3Blbk";
var key2 = "FJbuJfKqkTCB9QGa2Qhoun";


// update passage/results table
function updatePage(grade, passage){

	if(grade == 8){
		// set 8th grade data
		$("#passage1_8").html(passage);
		$("#fka_score_8").html(fkra_data_8.score);
		$("#sentences_8").html(fkra_data_8.sentences);
		$("#words_8").html(fkra_data_8.words);
		$("#syllables_8").html(fkra_data_8.syllables);
		$("#api_calls_8").html(api_calls_8);
	}
	else{
		// set 12th grade data
		$("#passage1_12").html(passage);
		$("#fka_score_12").html(fkra_data_12.score);
		$("#sentences_12").html(fkra_data_12.sentences);
		$("#words_12").html(fkra_data_12.words);
		$("#syllables_12").html(fkra_data_12.syllables);
		$("#api_calls_12").html(api_calls_12);
	}	
}

// clear values
function reset()
{
	api_calls_8 = 0;
	api_calls_12 = 0;
	
	$(".progress-bar").animate({
		width: "0%"
	}, 100);
	
	$("#results").hide();
	$(".progress-container").show();
	
			
	// set 8th grade data
	$("#passage1_8").html("");
	$("#fka_score_8").html("");
	$("#sentences_8").html("");
	$("#words_8").html("");
	$("#syllables_8").html("");
	$("#api_calls_8").html("");
	
	// set 12th grade data
	$("#passage1_12").html("");
	$("#fka_score_12").html("");
	$("#sentences_12").html("");
	$("#words_12").html("");
	$("#syllables_12").html("");
	$("#api_calls_12").html("");
	
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
	
	var type = $("#Type").val();
	var topic = $("#topic").val();
	var passage = $("#passage").val();
	
	var passage_set1;
	var passage_set2;
	var keywords;
	
	if(type == "Topic"){

		$("#LoadingLabel").html("Loading 12th Grade Passages...");
		
		// make call to get 12th grade level passages
		passage_set1 = await generate_passages(topic, 12);

		updatePage(12, passage_set1);
		
		$("#LoadingLabel").html("12th Grade Passage Generation Complete!");
		$("#results").toggle();
		
		$(".progress-bar").animate({
			width: "30%"
		}, 100);

		$("#LoadingLabel").html("Extracting Keywords...");
		
		// extract keywords from text
		keywords = extract(passage_set1,{
				language:"english",
				remove_digits: true,
				return_changed_case:true,
				remove_duplicates: false
			});

		keywords.push(topic);

		$("#LoadingLabel").html("Keyword Generation Complete!");
		
		$(".progress-bar").animate({
			width: "60%"
		}, 100);

		$("#LoadingLabel").html("Generating 8th Grade Passages...");
		
		// make call to get 8th grade level passages
		passage_set2 = await generate_passages(topic,8, keywords.join(","));
		
		updatePage(8, passage_set2);

		$("#LoadingLabel").html("8th Grade Passage Generation Complete!");
		
		$(".progress-bar").animate({
			width: "100%"
		}, 500)
		.promise().done(function () {
			
			$(".progress-container").toggle();			
			loading = false;
		})
		
		
	}
	else{	
	
	// grab key words from provided passage
		$("#LoadingLabel").html("Extracting keywords from provided passage(s)...");
		
		keywords = extract(passage,{
				language:"english",
				remove_digits: true,
				return_changed_case:true,
				remove_duplicates: false
			});

		$("#LoadingLabel").html("Keyword Extraction Complete!");
		
		$(".progress-bar").animate({
			width: "10%"
		}, 500);

		topic = keywords.join(",")

		$("#LoadingLabel").html("Loading 12th Grade Passages...");
		
		// make call to get 12th grade level passages
		passage_set1 = await generate_passages(topic, 12);

		updatePage(12, passage_set1);
		
		$("#LoadingLabel").html("12th Grade Passage Generation Complete!");
		$("#results").toggle();
		
		$(".progress-bar").animate({
			width: "30%"
		}, 100);

		$("#LoadingLabel").html("Extracting keywords from 12th grade passages...");
		
		// extract keywords from text
		keywords = extract(passage_set1,{
				language:"english",
				remove_digits: true,
				return_changed_case:true,
				remove_duplicates: false
			});

		$("#LoadingLabel").html("Keyword Extraction Complete!");
		
		$(".progress-bar").animate({
			width: "60%"
		}, 100);


		$("#LoadingLabel").html("Loading 8th Grade Passages...");
		
		// make call to get 8th grade level passages
		passage_set2 = await generate_passages(topic, 8, keywords.join(","));
		
		updatePage(8, passage_set2);
		
		$(".progress-bar").animate({
			width: "100%"
		}, 100)
		.promise().done(function () {
			
			$(".progress-container").toggle();			
			loading = false;
		})
		
	}
	
	
}

async function generate_passages(topic, grade, keywords="") {
	var selected = $('#Type').val();
	var prompt;
	var response;
	var keywords;
	var myJson;
	var text;
	var number_words;
	var fkra;
	
	
	if(grade == 12){
		prompt = "Generate a cohesive passage with four parts and no redundancy. Each part should be approximately 75 words. Each part should be able to stand alone. In each part add one little known fact or idea that would be useful for later comprehension questions to test the reader. All text must be at " + grade + "th grade reading level, as measured by the Flesch-Kincaid Grade Level formula. The topic should be " + topic + " \n\n###\n\n";

		response = await fetch('https://api.openai.com/v1/completions', {
			method: 'POST',
			body: JSON.stringify({
				model: "davinci:ft-sawyer-laboratories:new-test-2023-06-23-15-15-58",
				prompt: prompt,
				temperature: 1,
				max_tokens: 400,
				top_p: 1.0,
				frequency_penalty: 0.0,
				presence_penalty: 0.0,
				stop:["END"]

			}), 
			headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + key1 + key2
        }
		});
		
		api_calls_12 = api_calls_12 + 1;
		
		myJson = await response.json(); //extract JSON from the http response
		text = myJson.choices[0].text;

		for(var i = 1; i < 5; i++){
			text = text.replace(i + ")","<br><br>");
		}
				
		number_words = text.split(' ').filter(function (el) {
			return el != "";
		}).length;
		
		
		if(FKRA_calculator(text, grade) < 13 && FKRA_calculator(text, grade) > 11.5  && number_words > 260 && number_words < 340){
			return text;
		}
		else{
			return await generate_passages(topic, 12);
		}
		
	}
	else{
		prompt = "Topic: " + topic + "\n Keywords: " + keywords + "\n Generate a cohesive passage that consists of four distinct parts, each containing approximately 75 words. Avoid redundancy, and ensure that each part can stand alone as a coherent segment. Additionally, incorporate one little-known fact or idea in each part, which will be beneficial for later comprehension questions to test the reader's understanding. The entire passage must adhere to an 8th-grade reading level, as determined by the Flesch-Kincaid Grade Level formula. \n\n###\n\n";
		response = await fetch('https://api.openai.com/v1/completions', {
			method: 'POST',
			body: JSON.stringify({
				model: "davinci:ft-sawyer-laboratories:grade-8-fifth-attempt-2023-08-01-17-22-43",
				prompt: prompt,
				temperature: 1,
				max_tokens: 400,
				top_p: 1.0,
				frequency_penalty: 0.0,
				presence_penalty: 0.0,
				stop:["END"]

			}), // string or object
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + key1 + key2
			}
		});
		
		api_calls_8 = api_calls_8 + 1;
		
		myJson = await response.json(); //extract JSON from the http response
		text = myJson.choices[0].text;

		for(var i = 1; i < 5; i++){
			text = text.replace(i + ")","<br><br>");
		}
		
		number_words = text.split(' ').filter(function (el) {
			return el != "";
		}).length;
		
		
		if(FKRA_calculator(text, grade) < 9 && FKRA_calculator(text, grade) > 7.5  && number_words > 260 && number_words < 340){
			return text;
		}
		else{
			return await generate_passages(topic, 8, keywords);
		}
	}
			
}


function word_count(word) {
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
}

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
