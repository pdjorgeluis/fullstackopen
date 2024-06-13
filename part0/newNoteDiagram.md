sequenceDiagram
    participant browser
    participant server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
    activate server
    Note right of browser: note: lajito was here
    server-->>browser: HTTP status code 302
    deactivate server
    Note left of server:  URL redirect, server asks the browser to perform a new HTTP GET request to the address defined in the header's Location - the address notes

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate server
    server-->>browser: HTML document

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: the css file
    deactivate server
    Note right of browser: fetching the style sheet (main.css)

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate server
    server-->>browser: the JavaScript file
    deactivate server
    Note right of browser: The browser starts executing the JavaScript code that fetches the JSON from the server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: [{ "content": "free palestine","date": "2024-06-13T13:11:13.692Z" }, ... ]
    deactivate server
    Note right of browser: The browser executes the callback function that renders the notes
