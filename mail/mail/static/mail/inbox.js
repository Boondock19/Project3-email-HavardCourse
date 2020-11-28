document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#email-id-view').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
  const NewEmail = document.querySelector("#compose-form")
  NewEmail.addEventListener("submit", (event) => {
    event.preventDefault();
    fetch('/emails', {
    method: "POST",
    body: JSON.stringify({
      recipients: document.querySelector('#compose-recipients').value,
      subject: document.querySelector('#compose-subject').value,
      body:  document.querySelector('#compose-body').value,
      }),
    })
    .then(response => response.json())
    .then(result => {
      console.log(result);
      load_mailbox("sent")
    });
  });
}

function load_email_id(id) {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-id-view').style.display = 'block';
  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
    console.log(email)
    const email_body=document.createElement("div");
    email_body.className="Email_id"
    email_body.innerHTML=`
    <div><span class="font-weight-bold" >From: </span> ${email.sender}</div>
    <div><span class="font-weight-bold" >To: </span> ${email.recipients}</div>
    <div><span class="font-weight-bold" >Subject: </span> ${email.subject}</div>
    <div><span class="font-weight-bold" >TimeStamp: </span> ${email.timestamp}</div>
    <div> <button type="button" class="btn btn-outline-dark" >REPLY</button> </div>    
    <hr>  
    <p>${email.body}</p>
    `;
    document.querySelector('#email-id-view').append(email_body);
  })
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-id-view').style.display = 'none';
  //delete an existing email in email-id-view
  let email_id=document.querySelector('#email-id-view');
  email_id.innerHTML="";

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  if (mailbox==="inbox") {
    fetch('/emails/inbox')
    .then(response => response.json())
    .then(emails => {
      console.log(emails);
      emails.forEach(function (emails) {
        const email = document.createElement("div");
        if (emails.read==false) {
          email.innerHTML=`<div class="card-body email" id="item-${emails.id}">
          ${emails.sender} this is inbox | ${emails.subject} | ${emails.timestamp}
          <button id="Archive-${emails.id}"> Archive </button></div>`;

        email.addEventListener("click",function() {
          if (emails.read==false){
            fetch(`/emails/${emails.id}`,{
              method: 'PUT',
              body: JSON.stringify({
                read: true
              })
            })
            
          } 
          load_email_id(`${emails.id}`)
        })
        document.querySelector("#emails-view").append(email);
        // Creating a butto with eventhandler for archive action
        archive_button=document.querySelector(`#Archive-${emails.id}`)
        archive_button.addEventListener("click",function() {
          fetch(`/emails/${emails.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                archived: true
            })
          })
          load_mailbox("archive")
        })
        } else {
          email.innerHTML=`<div class="card-body email-readed" id="item-${emails.id}">
          ${emails.sender} this is inbox | ${emails.subject} | ${emails.timestamp}
          <button id="Archive-${emails.id}"> Archive </button></div>`;
          email.addEventListener("click",function() {
            if (emails.read==false){
              fetch(`/emails/${emails.id}`,{
                method: 'PUT',
                body: JSON.stringify({
                  read: true
                })
              })
              
            }
            load_email_id(`${emails.id}`)
          })
          document.querySelector("#emails-view").append(email);
          // Creating a butto with eventhandler for archive action
          archive_button=document.querySelector(`#Archive-${emails.id}`)
          archive_button.addEventListener("click",function() {
          fetch(`/emails/${emails.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                archived: true
            })
          })
          load_mailbox("archive")
        })
        } 
        
      });
      
  })
}
    
  if (mailbox==="sent") {
     fetch('/emails/sent')
    .then(response => response.json())
    .then(emails => {
      console.log(emails);
      emails.forEach(function (emails) {
        const email = document.createElement("div");
        email.className="Email";
        email.innerHTML=`<div class="card-body email" id="item-${emails.id}">
        ${emails.recipients} this is sent | ${emails.subject} | ${emails.timestamp}
        </div>`;
        email.addEventListener("click",function() {
          load_email_id(`${emails.id}`)
        })
        document.querySelector("#emails-view").append(email);
       })
    });
  }
    
  if (mailbox==="archive") {
    fetch('/emails/archive')
    .then(response => response.json())
    .then(emails => {
      console.log(emails);
      emails.forEach(function (emails) {
        const email = document.createElement("div");
        if (emails.read==false) {
          email.innerHTML=`<div class="card-body email" id="item-${emails.id}">
          ${emails.sender} this is inbox | ${emails.subject} | ${emails.timestamp}
          <button id="Archive-${emails.id}"> Archive </button></div>`;

        email.addEventListener("click",function() {
          if (emails.read==false){
            fetch(`/emails/${emails.id}`,{
              method: 'PUT',
              body: JSON.stringify({
                read: true
              })
            })
            
          } 
          load_email_id(`${emails.id}`)
        })
        document.querySelector("#emails-view").append(email);
        // Creating a butto with eventhandler for archive action
        archive_button=document.querySelector(`#Archive-${emails.id}`)
        archive_button.addEventListener("click",function() {
          fetch(`/emails/${emails.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                archived: false
            })
          })
          load_mailbox("inbox")
        })
        } else {
          email.innerHTML=`<div class="card-body email-readed" id="item-${emails.id}">
          ${emails.sender} this is inbox | ${emails.subject} | ${emails.timestamp}
          <button id="Archive-${emails.id}"> Archive </button></div>`;
          email.addEventListener("click",function() {
            if (emails.read==false){
              fetch(`/emails/${emails.id}`,{
                method: 'PUT',
                body: JSON.stringify({
                  read: true
                })
              })
              
            }
            load_email_id(`${emails.id}`)
          })
          document.querySelector("#emails-view").append(email);
          // Creating a butto with eventhandler for archive action
          archive_button=document.querySelector(`#Archive-${emails.id}`)
          archive_button.addEventListener("click",function() {
          fetch(`/emails/${emails.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                archived: false
            })
          })
          load_mailbox("inbox")
        })
        } 
        
      });
      
  })
}
    
    
    const header5 = document.createElement("h5");
    header5.innerHTML="This is the testing of inbox page ";
    document.querySelector("#emails-view").append(header5);
}


