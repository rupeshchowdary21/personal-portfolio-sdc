const defaultProjects=[
 {title:"AI Based Crop Recommendation",description:"A project that recommends suitable crops using agricultural inputs."},
 {title:"Student Portfolio",description:"A responsive portfolio website built using HTML, CSS and JavaScript."}
];

function getUsers(){return JSON.parse(localStorage.getItem("users")||"[]")}
function saveUsers(users){localStorage.setItem("users",JSON.stringify(users))}
function getProjects(){return JSON.parse(localStorage.getItem("projects")||"null")||defaultProjects}
function saveProjects(p){localStorage.setItem("projects",JSON.stringify(p))}

document.addEventListener("DOMContentLoaded",()=>{
  if(!localStorage.getItem("projects")) saveProjects(defaultProjects);

  const signup=document.getElementById("signupForm");
  if(signup) signup.addEventListener("submit",e=>{
    e.preventDefault();
    const users=getUsers(), email=signupEmail.value.trim().toLowerCase();
    if(users.some(u=>u.email===email)){alert("Email already registered");return}
    users.push({name:signupName.value.trim(),email,password:signupPassword.value});
    saveUsers(users); alert("Signup successful. Please login."); location.href="login.html";
  });

  const login=document.getElementById("loginForm");
  if(login) login.addEventListener("submit",e=>{
    e.preventDefault();
    const user=getUsers().find(u=>u.email===loginEmail.value.trim().toLowerCase()&&u.password===loginPassword.value);
    if(!user){alert("Invalid email or password");return}
    localStorage.setItem("loggedInUser",JSON.stringify(user)); location.href="user.html";
  });

  const adminLogin=document.getElementById("adminLoginForm");
  if(adminLogin) adminLogin.addEventListener("submit",e=>{
    e.preventDefault();
    if(adminEmail.value.trim().toLowerCase()==="admin@portfolio.com"&&adminPassword.value==="admin123"){
      localStorage.setItem("adminLoggedIn","true"); location.href="admin-dashboard.html";
    }else alert("Invalid admin credentials");
  });

  const welcome=document.getElementById("welcomeUser");
  if(welcome){
    const user=JSON.parse(localStorage.getItem("loggedInUser")||"null");
    if(!user){location.href="login.html";return}
    welcome.textContent=user.name;
  }

  document.getElementById("logoutUser")?.addEventListener("click",e=>{
    e.preventDefault();localStorage.removeItem("loggedInUser");location.href="login.html";
  });
  document.getElementById("logoutAdmin")?.addEventListener("click",e=>{
    e.preventDefault();localStorage.removeItem("adminLoggedIn");location.href="admin.html";
  });

  renderProjects();
  renderAdmin();

  const projectForm=document.getElementById("projectForm");
  if(projectForm) projectForm.addEventListener("submit",e=>{
    e.preventDefault();
    if(localStorage.getItem("adminLoggedIn")!=="true"){location.href="admin.html";return}
    const projects=getProjects();
    projects.push({title:projectTitle.value.trim(),description:projectDescription.value.trim()});
    saveProjects(projects);projectForm.reset();renderAdmin();renderProjects();
  });

  const contact=document.getElementById("contactForm");
  if(contact) contact.addEventListener("submit",e=>{
    e.preventDefault();
    const messages=JSON.parse(localStorage.getItem("messages")||"[]");
    messages.push({name:contactName.value,email:contactEmail.value,message:contactMessage.value,date:new Date().toLocaleString()});
    localStorage.setItem("messages",JSON.stringify(messages));
    contact.reset();alert("Message sent successfully!");
  });
});

function renderProjects(){
  const box=document.getElementById("projectList"); if(!box)return;
  box.innerHTML=getProjects().map(p=>`<div class="project-card"><h3>${escapeHTML(p.title)}</h3><p>${escapeHTML(p.description)}</p></div>`).join("");
}
function renderAdmin(){
  const box=document.getElementById("adminProjectList"); if(box){
    if(localStorage.getItem("adminLoggedIn")!=="true"){location.href="admin.html";return}
    const projects=getProjects();
    box.innerHTML=projects.map((p,i)=>`<div class="project-card"><h3>${escapeHTML(p.title)}</h3><p>${escapeHTML(p.description)}</p><button class="btn" onclick="deleteProject(${i})">Delete</button></div>`).join("");
  }
  const messages=document.getElementById("messageList"); if(messages){
    const data=JSON.parse(localStorage.getItem("messages")||"[]");
    messages.innerHTML=data.length?data.map(m=>`<div class="message"><b>${escapeHTML(m.name)}</b> (${escapeHTML(m.email)})<p>${escapeHTML(m.message)}</p><small>${escapeHTML(m.date)}</small></div>`).join(""):"<p>No messages yet.</p>";
  }
}
function deleteProject(i){const p=getProjects();p.splice(i,1);saveProjects(p);renderAdmin();renderProjects()}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
