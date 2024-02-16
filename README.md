# Senior Backend Engineer Assessment Task

## Task Overview:
You are tasked with designing and implementing the backend for a software product that stores guides. 
A guide is composed of a title and an ordered list of steps. Each step consists of a title and textual content. 
Guides can be stored in multiple languages defined by the user. 
The goal is to provide the ability to automatically translate guides into other languages using a separate translation service.

## Requirements:
* The system should allow users to specify the languages in which they want a guide to be translated. 
* Upon request, the system should interact with the translation service to retrieve translations for each step of the guide and store them accordingly. 
* The system should handle error cases gracefully and ensure the translated content is properly associated with the original guide.
* The system should allow users to translate a guide to multiple languages in one single interaction. 

## Translation API Description:
The translation API exposes a POST endpoint (`/v1/auto-translate`) to translate a JSON object passed in the body. 

The body is a JSON object with the following fields: 
* `original_language`: the language of the passed text
* `language`: the language to translate into
* `data`: the JSON object to translate, it can have any structure, and the service will only translate the content of the fields but not the names

An example of request body: 
```
{
    "original_language": "en-us",
    "language": "it-it",
    "data": {
        "title": "A nice guide", 
        "steps": [{
            "title": "step 1",
            "content": "some content"
        },{
            "title": "step 2",
            "content": "some other content"
        }]
    }
}
```

If the request is successful, the translation API will respond with a status 200 and a JSON object that looks exactly like the request, 
but the content will be in the requested language. 

## System Design Task:
Design the system architecture for the backend considering the following factors:

1. Ensure the system can handle any number of languages to be translated into, even in the case of guides with a high number of steps.
2. Design the system to be resilient to failures, ensuring that guide data is not lost and that errors are handled gracefully.
3. Determine the schema for storing guides and their translations. Consider how to efficiently retrieve and update guide data.

Document your system design decisions, explaining the rationale behind your choices and how they address the requirements and constraints of the problem.

## Coding Task:
Implement a proof of concept the backend in one of the following languages: PHP, Node.js (TypeScript), or Go. 
You can use any framework or library you deem suitable for the task.
The system should allow to: 

* Perform CRUD operations on guides
* Translate one guide to one or more languages

### Notes
* The coding task is only a proof of concept, so simplifications to the original design will be accepted.
* Feel free to mock any external service (e.g. storage, translation service).
* Assume the host of the translation service is a configuration of the system.

