 const mentorToggle = document.getElementById('mentor-toggle');
 const menteeToggle = document.getElementById('mentee-toggle');
 
 mentorToggle.addEventListener('click', () => {
     mentorToggle.classList.add('active');
     menteeToggle.classList.remove('active');
 });
 
 menteeToggle.addEventListener('click', () => {
     menteeToggle.classList.add('active');
     mentorToggle.classList.remove('active');
 });