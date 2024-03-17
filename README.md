# Senior Backend Engineer Assessment Task

## Overview
You are tasked with designing and implementing the backend for a software product that manages guides.
The goal is to provide the ability to manage and automatically translate guides into other languages using an
external translation provider (the _Translation Service_).

### Guides Description
* A guide is composed of a title and an ordered list of steps.
* Each step consists of a title and textual content.
* Guides can be stored in multiple languages defined by the user.

### Functional Requirements
* The system should expose the necessary interface to allow users to perform CRUD operations on the guides.
* The system should expose the necessary interface to allow users to translate a guide into one or more languages.
* Upon request, the system should interact with the translation service to retrieve translations for each step of the guide and store them accordingly.
* The system should handle error cases gracefully and ensure the translated content is properly associated with the original guide.
* The system should allow users to translate a guide to multiple languages in one single interaction.

### Translation Service
The _translation service_ is an external service used to perform the actual translations of the guides.

Please understand that the design and implementation of the translation service are not included in the assigned task.
Instead, it should be recognized as an external requirement and therefore treated as a service provided externally.

The translation service API exposes an HTTP POST endpoint (`/v1/auto-translate`) to translate a JSON object passed in the body.

The body is a JSON object with the following fields:
* `original_language`: the language of the passed text
* `language`: the language to translate into
* `data`: a JSON object representing the content to be translated.
  it can have any structure, and the service will only translate the content of the fields but not the names.

An example of request body:
```
{
    "original_language": "en_US",
    "language": "it_IT",
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

An example response body:
```
{
    "original_language": "en_US",
    "language": "it_IT",
    "data": {
        "title": "Una bella guida", 
        "steps": [{
            "title": "passo 1",
            "content": "del contenuto"
        },{
            "title": "passo 2",
            "content": "dell'altro contenuto"
        }]
    }
}
```

## System Design Task
Design the system architecture for the backend considering the following factors:

1. Ensure the system can handle any number of languages to be translated into, even in the case of guides with a high number of steps.
2. Design the system to be resilient to failures, ensuring that guide data is not lost and that errors are handled gracefully.
3. Determine the schema for storing guides and their translations. Consider how to efficiently retrieve and update guide data.
4. Make sure the integration with the translation service is not binding, and we can change it in a future moment.

Document your system design decisions, explaining the rationale behind your choices and how they address the requirements and constraints of the problem.

## Coding Task
Implement a **proof of concept** of the backend in one of the following languages: PHP, Node.js (TypeScript), or Go.
You can use any framework or library you deem suitable for the task.

The system should allow to:

* Perform CRUD operations on guides
* Translate one guide to one or more languages

### Important Notes
* The coding task is a proof of concept, so simplifications to the original design will be expected.
* External dependencies can be mocked (e.g. storage, translation service).
* Assume the host of the translation service is a configuration of the system.
