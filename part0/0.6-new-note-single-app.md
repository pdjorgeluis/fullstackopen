sequenceDiagram
    participant browser
    participant server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
    activate server
    Note right of browser: note: "lajito came back"
    server-->>browser: {"message":"note created"}
    deactivate server
