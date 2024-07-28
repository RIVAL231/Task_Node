const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser')
app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,"public")));

app.get('/', (req,res)=>{
  fs.readdir(`./files`,(err,files)=>{
    res.render("index",{files: files}); 
  })
   
});
app.get('/files/:filename', (req,res)=>{
fs.readFile(`./files/${req.params.filename}`,"utf-8",(err,filedata)=>{
    res.render('show',{filename: req.params.filename,filedata: filedata});
});
});
app.get('/edit/:filename', (req,res)=>{
res.render('edit',{filename:req.params.filename});
});

app.post('/edit', (req,res)=>{
fs.rename(`./files/${req.body.previous}`,`./files/${req.body.new}`,(err)=>{
    res.redirect("/");
});
});



app.post('/create', (req, res) => {
    const title = req.body.title.split(' ').join('');
    const desc = req.body.desc;

    fs.writeFile(`./files/${title}.txt`, desc, (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return res.status(500).send('An error occurred while creating the file.');
        }
        res.redirect('/');
    });
});


app.listen(3000,()=>{
console.log("server started on port 3000");
}
)