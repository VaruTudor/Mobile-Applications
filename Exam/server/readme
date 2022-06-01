Messages

To manage messages sent by users, a firm designed a client-server system.
The server emits web socket notifications (ws://localhost:3000) related to users.
When a client opens a web socket connection the sever sends the list of senders in JSON
using the following format { senders: [userIds] }, e.g. { senders: ["u0", "u1"] }.
The server also allows clients to GET and DELETE messages, a message having the following props:
  id - integer,
  text - string,
  sender - string.
Develop a mobile application (client) as follows.

1. When the app is launched, it connects to the server and receives via web sockets the list of senders [1p].
A dropdown presents the list of senders, the first sender being selected by default [1p].

2. When the user selects a sender:
(a) The app fetches an array of messages sent by that sender using GET /messages?sender=value [1p].
(b) A list shows the messages fetched from the server [1p].

3. The user can select one or more messages by clicking on them.
The user will be able to toggle the selected messages [1p].

4. Below the list of messages, a 'Delete' button is shown.
(a) When the list does not have selected messages, 'Delete' is disabled [0.5p].
(b) When the user clicks on this button, all selected messages will be deleted.
    The app will execute in parallel DELETE /message/id, for all selected messages [1.5p].
(d) If the delete operation succeeds, the list will be updated [1p].

5. Whenever the app performs HTTP operations, it shows a progress indicator [0.5p].
Any IO errors will be reported to the user [0.5p].
