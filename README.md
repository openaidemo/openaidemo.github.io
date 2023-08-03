
# LLM - Passage Generator

This project provides a fine-tuned OpenAI model for generating passages based on specific FKRA (Flesch-Kincaid Reading Age) and chunk size targets, ensuring clarity and coherence. The generated passages are tailored for 12th and 8th-grade levels.

### Website URL : https://openaidemo.github.io 

<img width="1447" alt="image" src="https://user-images.githubusercontent.com/54473815/257691399-9f0db7b1-fa06-4616-8a6f-d82ae265a9de.png">

## How to Use

1.  Choose the type of input you want to provide:
    -   Topic: If you want to generate passages based on a specific topic.
    -   Passage: If you want to generate passages based on a pre-written passage.
2.  Fill in the required information:
    
    -   For Topic: Enter the topic you want the passage to be about.
    -   For Passage: Paste the pre-written passage into the provided textarea.
3.  Click the "Submit" button to generate the passages.

## Web Application

The project includes an HTML web application that interacts with the OpenAI model and provides a user-friendly interface to generate passages.

### Dependencies

The web application utilizes the following external dependencies:

-   jQuery (v3.6.4): A JavaScript library for easier manipulation of HTML documents and event handling.
-   Bootstrap (v5.3.0 and v4.6.2): A popular front-end CSS framework for responsive and attractive UI design.

### Files

-   `index.html`: The main HTML file containing the web application structure and user interface elements.
-   `site.css`: A custom CSS file to style the web application.
-   `logo.png`: An image file used in the web application.
-   `script.js`: A custom JavaScript file containing the logic for user interaction and communication with the OpenAI model.

###  Getting Started
To get a local copy up and running follow these simple steps
```
git clone https://github.com/kaitestopenai/kaitestopenai.github.io.git
```

Running the file
```
```
## 1. OpenAI Completions API

This API from OpenAI is used to generate cohesive passages at different reading levels. The application makes two types of requests to this API:

### Request Type 1: Generate 12th Grade Passages

-   **Endpoint**: `https://api.openai.com/v1/completions`
-   **Method**: POST
-   **Body**:
    
```
"model":  "davinci:ft-sawyer-laboratories:new-test-2023-06-23-15-15-58",
"prompt":  "Generate a cohesive passage with four parts and no redundancy. Each part should be approximately 75 words. Each part should be able to stand alone. In each part add one little known fact or idea that would be useful for later comprehension questions to test the reader. All text must be at 12th grade reading level, as measured by the Flesch-Kincaid Grade Level formula. The topic should be <topic_here>  \n\n###\n\n",
"temperature":  1,
"max_tokens":  400,
"top_p":  1.0,
"frequency_penalty":  0.0,
"presence_penalty":  0.0,
"stop": ["END"] 
```
#### Response

If successful, the `POST` request will return a `200 OK` HTTP status code, along with the generated text and the following fields in the response body:

-   `number_words` (integer): The number of words in the passage.
-   `number_sentences` (integer): The number of sentences in the passage.
-   `number_syllables` (integer): The number of syllables in the passage.
-   `fkra_score` (float): The Flesch-Kincaid Reading Age score for the passage.
  
-   **Headers**:
   

    ```
    { "Content-Type":  "application/json",  "Authorization":  "Bearer <your_api_key>"  }
    ```
    

### Request Type 2: Generate 8th Grade Passages

-   **Endpoint**: `https://api.openai.com/v1/completions`
-   **Method**: POST
-   **Body**:
    
    
```
"model":  "davinci:ft-sawyer-laboratories:grade-8-fifth-attempt-2023-08-01-17-22-43",
"prompt":  "Topic: <topic_here>\n  Keywords: <keywords_here>\n  Generate a cohesive passage that consists of four distinct parts, each containing approximately 75 words. Avoid redundancy, and ensure that each part can stand alone as a coherent segment. Additionally, incorporate one little-known fact or idea in each part, which will be beneficial for later comprehension questions to test the reader's understanding. The entire passage must adhere to an 8th-grade reading level, as determined by the Flesch-Kincaid Grade Level formula.  \n\n###\n\n",  
"temperature":  1,  
"max_tokens":  400,  
"top_p":  1.0,  
"frequency_penalty":  0.0,  
"presence_penalty":  0.0,  
"stop": ["END"]
```
   
#### Response

If successful, the `POST` request will return a `200 OK` HTTP status code, along with the generated text and the following fields in the response body:

-   `number_words` (integer): The number of words in the passage.
-   `number_sentences` (integer): The number of sentences in the passage.
-   `number_syllables` (integer): The number of syllables in the passage.
-   `fkra_score` (float): The Flesch-Kincaid Reading Age score for the passage.
-   **Headers**:
    
    ```
    { "Content-Type":  "application/json",  "Authorization":  "Bearer <your_api_key>"  }
    ```
   ### Keyword Extractor: https://github.com/michaeldelorenzo/keyword-extractor

**Function Signature:** `extract(str, options)`

**Description:** This function extracts keywords from a given text. It removes stopwords (common words like "the," "is," "and," etc.), digits, punctuation, and returns an array of keywords.

**Parameters:**

-   `str`: The input text from which keywords will be extracted.
-   `options`: (Optional) An object containing options for the extraction process.
    -   `remove_digits`: If set to `true`, digits will be removed from the extracted keywords. Default is `true`.
    -   `return_changed_case`: If set to `true`, the extracted keywords will have their case changed to lowercase. Default is `true`.
    -   `language`: The language of the input text. Supported languages are "danish", "dutch", "english", "french", "galician", "german", "italian", "polish", "portuguese", "romanian", "russian", "spanish", "swedish", "persian", and "arabic". Default is "english".
    -   `remove_duplicates`: If set to `true`, duplicate keywords will be removed from the result. Default is `false`.
    -   `return_max_ngrams`: If set, the function will return n-grams up to the specified value. Default is `undefined`.
    -   `return_chained_words`: If set to `true`, words that are part of a chained n-gram will be returned as a single keyword. Default is `false`.

**Returns:** An array containing the extracted keywords from the input text.

###  FKRA Calculator:

**Function Signature:** `FKRA_calculator(passage, grade)`

**Description:** This function calculates the Flesch-Kincaid Reading Age (FKRA) score for a given passage. It calculates the number of words, sentences, and syllables in the passage and uses the ASL (average sentence length) and ASW (average syllables per word) to determine the reading age.

**Parameters:**

-   `passage`: The input passage for which the FKRA score will be calculated.
-   `grade`: The grade level (either 8 or 12) for which the passage's readability will be evaluated.

**Returns:** The calculated FKRA score.

### Update Results Table:

**Function Signature:** `updatePage(grade, passage)`

**Description:** This function updates the results table with the provided passage and relevant FKRA data based on the given grade (either 8 or 12).

**Parameters:**

-   `grade`: The grade level (either 8 or 12) for which the passage's data will be updated in the results table.
-   `passage`: The passage that will be displayed in the results table.

## Team

> Or Contributors/People

## License
