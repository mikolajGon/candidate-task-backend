# Senior Backend Engineer Assessment Solution

## Cut-offs:
* skipped extensive testing as couldnt sacrifice more time on task
* since it is task / POC narrowed down configs to be hardcoded
* the initial load of application is quite long. Grabbed first service i found for translation, and on initial load it is downloading all translation models. docker container is provided with healthcheck, and app is resilient for this time (all events will be processed once service is up)
* api-gateway is a big simplification as it should have more gracefully solution for async solution
* skipped a lot of error handlings such as monitoring services / DLQs etc due to the size and time spent on solution
* used simple zod validation, instead of processing with kafka schemas - to reduce complexity
* grabbed simple locale validation - may be some discrepancies with translate engine provided languages. Nevertheless, it handles those [languages](https://github.com/LibreTranslate/LibreTranslate/blob/main/README.md#ui-languages)

## Stack choices:
* nestjs - simple, elegant, a lot of out of the box solutions for writing async microservices
* dynamodb - nic fast db, good for fine granulated microservices. Due to the nice partition or partition/sort key it is nice for retrieving hashed data. Also have't used it for a while, and wanted 
* redpanda - a little bit lighter for local development than kafka. Has full functionalities of message broker, that solves a lot of issues with not loosing data.

## Arch choices
* since translation process may be heavy in resources, and long running fits all requirement for more complex event based architecture
* decided to split logic into 3 services:
  - hash-service - responsible for determining if we have such translation
  - translation-service - responsible for the process of translation
  - client-manager - responsible for managing client requests for translation, and dispatching them back
* internal services are hidden behind gateway. That one takes care for actual connections to the client, and provide (in principal) all auth/security stuff

## How to run solution

### Prerequisties
* docker
* docker-compose
* any http client
* browser

### Run
```shell
docker compose up -d
```

wait for docker containers to become healthy

just hit endpoint with POST `http://localhost:3000/v1/auto-translate` with eg. data
```json

{
  "original_language": "en_US",
  "language": "ja_JP",
  "data": {
    "title": "A nice guide",
    "steps": {
      "step1": "Romeo and Juliet is a tragedy written by William Shakespeare early in his career about the romance between two Italian youths from feuding families. It was among Shakespeare's most popular plays during his lifetime and, along with Hamlet, is one of his most frequently performed. Today, the title characters are regarded as archetypal young lovers.",
      "step2": "",
      "step3": "Romeo and Juliet belongs to a tradition of tragic romances stretching back to antiquity. The plot is based on an Italian tale written by Matteo Bandello and translated into verse as The Tragical History of Romeus and Juliet by Arthur Brooke in 1562 and retold in prose in Palace of Pleasure by William Painter in 1567. Shakespeare borrowed heavily from both but expanded the plot by developing a number of supporting characters, in particular Mercutio and Paris. Believed to have been written between 1591 and 1595, the play was first published in a quarto version in 1597. The text of the first quarto version was of poor quality, however, and later editions corrected the text to conform more closely with Shakespeare's original.",
      "step4": "",
      "step5": "Shakespeare's use of poetic dramatic structure (including effects such as switching between comedy and tragedy to heighten tension, the expansion of minor characters, and numerous sub-plots to embellish the story) has been praised as an early sign of his dramatic skill. The play ascribes different poetic forms to different characters, sometimes changing the form as the character develops. Romeo, for example, grows more adept at the sonnet over the course of the play.",
      "step6": "",
      "step7": "Romeo and Juliet has been adapted numerous times for stage, film, musical, and opera venues. During the English Restoration, it was revived and heavily revised by William Davenant. David Garrick's 18th-century version also modified several scenes, removing material then considered indecent, and Georg Benda's Romeo und Julie omitted much of the action and used a happy ending. Performances in the 19th century, including Charlotte Cushman's, restored the original text and focused on greater realism. John Gielgud's 1935 version kept very close to Shakespeare's text and used Elizabethan costumes and staging to enhance the drama. In the 20th and into the 21st century, the play has been adapted in versions as diverse as George Cukor's 1936 film Romeo and Juliet, Franco Zeffirelli's 1968 film Romeo and Juliet, Baz Luhrmann's 1996 film Romeo + Juliet, and most recently, Carlo Carlei's 2013 film Romeo and Juliet."
    }
  }
}
```

### Redpanda
redpanda panel is available under [http://localhost:8080](http://localhost:8080)

### Dynamodb-admin
dynamodb panel is available under [http://localhost:8001](http://localhost:8001)
