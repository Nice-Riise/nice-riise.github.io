document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);


  // Send mail 
  document.querySelector('#compose-form').addEventListener('submit', send_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
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

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Fetch emails from the server
  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      // Loop through emails and create a div for each email
      emails.forEach(userEmail => {
        // Create a new email element
        const newEmail = document.createElement('div');
        newEmail.innerHTML = `
          <h5>From: ${userEmail.sender}</h5> 
          <h4>Content: ${userEmail.subject}</h4>
          <p>${userEmail.timestamp}</p>
        `;

        // Add click event listener to the newEmail element
        newEmail.addEventListener('click', function() {
          console.log('This newEmail has been clicked!');
        });

        // Append the newEmail element to the emails-view container
        document.querySelector('#emails-view').appendChild(newEmail);
      });
    })
    .catch(error => {
      console.log('Error:', error);
    });
}



// Test send mail function
function send_email(event){
  event.preventDefault();

  // Store emails
  const recipients = document.querySelector('#compose-recipients').value;
  const subject =  document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

// Store data 
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

  //Print result
   console.log(result);
   load_mailbox('sent');
  });

}
