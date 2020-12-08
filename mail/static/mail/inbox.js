
document.addEventListener('DOMContentLoaded', function() {


  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('form').onsubmit = () => send_email();

  // By default, load the inbox
  load_mailbox('inbox');
});

function send_email() {

   // save form fields as consts
   const recipients = document.querySelector('#compose-recipients').value;
   const subject = document.querySelector('#compose-subject').value;
   const body = document.querySelector('#compose-body').value;
   fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
         recipients: recipients,
         subject: subject,
         body: body
      })
   })
   .then(response => response.json())
   .then(result => {
       // Print result
       console.log(result);
   });
   //stop form from submiting
   fetch('/emails/sent').then(response => response.json()).then(emails => load_mailbox('sent'))
   return false;
}

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#emails-open').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {

   // Show the mailbox and hide other views
   document.querySelector('#emails-view').style.display = 'block';
   document.querySelector('#compose-view').style.display = 'none';
   document.querySelector('#emails-open').style.display = 'none';

   // Show the mailbox name
   document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;


   //fetch emails
      fetch('/emails/' + mailbox)
      .then(response => response.json())
      .then(emails => {
          // Print emails
          console.log(emails);
          //loop through emails for the user
          emails.forEach((item, i) => {
             //create consts for each div element
             const element=document.createElement('div');
             const elementsender = document.createElement('div');
             const elementdate = document.createElement('div');
             const elementsubject = document.createElement('div');
             //add innerHTML and some CSS
             elementsender.innerHTML = item.sender;
             elementdate.innerHTML = item.timestamp;
             elementsubject.innerHTML = item.subject;
             element.style.border = "1px solid black";
             element.style.padding= "5px";
             element.id="email" + i;
             elementsender.style.width="200px";
             elementdate.style.float="right";
             elementsubject.style.display="inline";
             elementsender.style.display="inline-block";
             //if email is read set background color to gray
             if (item.read === true) {
                element.style.backgroundColor="gray"
             };
             //onclick, open the email and mark as read
             element.addEventListener('click', function() {
                fetch('/emails/' + item.id)
                .then(response =>response.json())
                .then(email => {
                   console.log(email)
                })
                .then(email => {
                   document.querySelector('#emails-view').style.display = 'none';
                   document.querySelector('#emails-open').style.display = 'block';
                   const elementemail=document.querySelector('#emails-open');
                   elementemail.innerHTML = "<strong>From:</strong> " + item.sender + "</br><strong>To:</strong> " + item.recipients + "</br><strong>Subject:</strong> " + item.subject + "</br><strong>Date:</strong> " + item.timestamp + "<hr>" + item.body + "</br></br>";
                   //mark as read
                   fetch('/emails/' + item.id, {
                     method: 'PUT',
                     body: JSON.stringify({
                        read: true
                     })
                  })
                  if (mailbox === 'inbox') {
                     const button = document.createElement('button');
                     button.innerHTML = "Archive";
                     button.id = "archive";
                     button.classList.add("btn", "btn-sm", "btn-outline-primary");
                     document.querySelector('#emails-open').append(button);
                     document.querySelector('#archive').addEventListener('click', function() {
                        fetch('/emails/' + item.id, {
                           method: 'PUT',
                           body: JSON.stringify({
                              archived: true
                           })
                        })
                        fetch('/emails/inbox').then(response => response.json()).then(emails => load_mailbox('inbox'))
                     });
                  }
                  if (mailbox === 'archive') {
                     const button = document.createElement('button');
                     button.innerHTML = "Unarchive";
                     button.id = "archive";
                     button.classList.add("btn", "btn-sm", "btn-outline-primary");
                     document.querySelector('#emails-open').append(button);
                     document.querySelector('#archive').addEventListener('click', function() {
                        fetch('/emails/' + item.id, {
                           method: 'PUT',
                           body: JSON.stringify({
                              archived: false
                           })
                        })
                        fetch('/emails/inbox').then(response => response.json()).then(emails => load_mailbox('inbox'))
                     });
                  }
                });
             });
             //append the divs to the html
             document.querySelector('#emails-view').append(element);
             document.querySelector('#email' + i).append(elementsender);
             document.querySelector('#email' + i).append(elementsubject);
             document.querySelector('#email' + i).append(elementdate);


          });
       });
}
