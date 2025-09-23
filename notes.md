1:ejs
app.set("view engine","ejs")
app.set("views","./views")

EJS is used to render dynamic HTML pages on the server using JavaScript and data from the backend.

EJS allows you to write HTML pages that contain JavaScript logic (like loops, conditions, variables). So instead of sending static HTML files, you can send customized, dynamic pages to users.

(ejs(server side rendering tutorial) : https://youtu.be/yy9cbu_e3Xg?si=mQIDSWnvms7uFYTj)

2:app.use(express.static("public"))

🗂️ app.use(express.static("public")) — What It Means in Express.js

This line tells Express to serve static files (like HTML, CSS, JS, images, fonts) from a folder called public.

✅ In simple words:

🧠 “Make everything inside the public folder accessible from the browser directly — no route needed.”re